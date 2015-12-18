#encoding: utf-8
require 'xmpp4r'
require 'digest'
require_relative '../services/taxi_chooser'

class ProcessRequestWorker
  include Sidekiq::Worker

  def exceed_5_tries_and_no_taxi_replied(request)
    if !request.has_attribute?(:driver) && request.tryouts >= 5
      request.status  = "error"
      return true
    else
      return false
    end
  end

  def perform(id)
    Sidekiq::Logging.logger.level = Logger::INFO
    request = Request.find(id)

    return if request.has_attribute?(:driver)
    return if exceed_5_tries_and_no_taxi_replied(request)

    creator = request.creator
    customer = request.customer
    address = request.address
    location = request.address['location']
    #logger.info "location = #{location}"

    sql = "SELECT *, earth_distance(ll_to_earth(#{location['lat']}, #{location['lng']}), ll_to_earth((data->'last_location'->>0)::float8, (data->'last_location'->>1)::float8)) as distance_from_current_location FROM taxis WHERE data @> '{ \"busy\": false }' and data->'payment_methods' @> '\"#{request.payment}\"'"
    sql << " and data @>'{ \"large_trunk\": true }'" if request.large_trunk
    order_by = " ORDER BY distance_from_current_location ASC LIMIT 10"
    sql << order_by

    taxis = Taxi.find_by_sql(sql)
    taxi_chooser = TaxiChooser.new
    taxi = taxi_chooser.first_alive(taxis, request.taxis_tried)
    #If we didn't find any taxi matching the requirements we try again after 15 seconds, we try 5 times if after 5 times we didn't find anything we set status to error
    if taxi.nil?
      ProcessRequestWorker.perform_in(15.seconds, request.id)
      request.tryouts += 1
      request.save!
      return
    end

    travel_time = TaxiApp::TravelTime.new
    estimative = travel_time.get_route(taxi, request)
    route = estimative['routes'][0]

    request.tryouts += 1
    request.taxis_tried = [] if request.taxis_tried.nil?
    request.taxis_tried << taxi.id
    request.save!

    message_id = Digest::SHA1.hexdigest([Time.now, rand].join)
    client = Jabber::Client.new('854946048207@gcm.googleapis.com')
    client.use_ssl = true
    #client.connect('gcm-preprod.googleapis.com',5236)
    client.connect('gcm-xmpp.googleapis.com',5235)
    client.auth('AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8')
    message_body = <<-XML
      <message id="">
        <gcm xmlns="google:mobile:data">
        {
          "to": "#{taxi.gcm_token}",
          "priority": "high",
          "time_to_live": 0,
          "message_id":"m-#{message_id}",
          "data": {
             "id": "#{request.id}",
             "address": {
               "street": "#{address['route']}",
               "city": "#{address['locality']}",
               "neighborhood": "#{address['neighborhood']}",
               "street_number": "#{address['street_number']}",
               "state": "#{address['administrative_area_level_1']}"
             },
             "location": { "lat": "#{location['lat']}", "lng": "#{location['lng']}"},
             "time": "#{route['legs'][0]['duration']['text']}",
             "distance": "#{route['legs'][0]['distance']['text']}",
             "route": "#{route['overview_polyline']['points']}",
             "payment": "#{request.payment}",
             "creator": {"name": "#{creator['name']}"},
             "customer": {"name": "#{customer['name']}", "phone": "#{customer['phone']}", "cellphone": "#{customer['cellphone']}"},
             "created_at": "#{request.created_at}",
             "observation": "#{request.observation}"
           }
        }
        </gcm>
      </message>
      XML
      logger.info message_body
      client.send message_body
      FlowCheckerWorker.perform_in(40.seconds, request.id, request.tryouts)
  end
end
