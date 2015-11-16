require 'oj'
require 'timeout'
require "uri"
require 'json'
require 'json'
require 'rest-client'

module TaxiApp
  class TravelTime
      CLIENT_ERRORS = %w[
            INVALID_REQUEST
            MAX_ELEMENTS_EXCEEDED
            OVER_QUERY_LIMIT
            REQUEST_DENIED
            UNKNOWN_ERROR
          ]
      def get(url, options = {})
        response = RestClient::Request.execute(:url => url, :method => :get, :verify_ssl => false)

        case response.code
        when 200
          inspect_for_client_errors! response
        when Net::HTTPRequestURITooLong
          fail MatrixUrlTooLong.new url, UrlBuilder::MAX_URL_SIZE, response
        when Net::HTTPClientError
          fail "A" #ClientError.new response
        when Net::HTTPServerError
          fail "A"#ServerError.new response
        else # Handle this as a request error for now. Maybe fine tune this more later.
          fail "A" #ServerError.new response
        end
        rescue Timeout::Error => error
          fail "a"#ServerError.new error
      end

      def inspect_for_client_errors!(response)
        status = JSON.parse(response.body).fetch "status"
        #status = JSON.parse(response.body).fetch "status"

        puts status
        if CLIENT_ERRORS.include? status
          fail "a aeraer aer ar" #ClientError.new response, status
        end

        response
      end

      def estimate_travel_timee()
        url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=-30.056887,-51.174254&destinations=-30.059110,-51.173430&language=pt-BR&mode=driving&key=AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8"
        parsed = Oj.load(get(url).body)

        puts parsed
        parsed
      end

      def estimate_travel_time(taxi, request)
        #url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=-30.056887,-51.174254&destinations=-30.059110,-51.173430&language=pt-BR&mode=driving&key=AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8"
        location = request.address['location']
        url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{taxi.last_location[0]},#{taxi.last_location[1]}&destinations=#{location['lat']},#{location['lng']}&language=pt-BR&mode=driving&key=AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8"
        parsed = Oj.load(get(url).body)

        puts parsed
        parsed
      end

      def get_route(taxi, request)
        location = request.address['location']
        url = "https://maps.googleapis.com/maps/api/directions/json?origin=#{taxi.last_location[0]},#{taxi.last_location[1]}&destination=#{location['lat']},#{location['lng']}&language=pt-BR&mode=driving&key=AIzaSyAU6lgWN3JnMJfgmfHIY0WsKaE76RmQOy8"
        parsed = Oj.load(get(url).body)

        parsed
      end
  end
end
