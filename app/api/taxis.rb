#encoding: utf-8
require './app/api/entities/taxi.rb'
require './app/model/taxi.rb'

module TaxiApp
  module Api
    class Taxis < Grape::API
      resource :taxis do
        desc "Retrieve a list of taxis and their location", entity: TaxiApp::Api::Entities::Taxi
        get('/') do
          taxis = Taxi.all
          present taxis, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Creates a new Taxi", entity: TaxiApp::Api::Entities::Taxi
        post('/') do
          hash = Oj.load(request.body.read)
          taxi = Taxi.new(hash)
          taxi.busy = true
          taxi.save!

          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Updates a taxi info", entity: TaxiApp::Api::Entities::Taxi
        put('/') do
          hash = Oj.load(request.body.read)
          taxi = Taxi.find(params[:id])
          taxi.license_plate = params[:license_plate]
          taxi.code = params[:code]
          taxi.payment_methods = params[:payment_methods]
          taxi.large_trunk = params[:large_trunk]
          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        desc "Returns the count of taxi status"
        get('/count') do
            count =
            {
              'free' => {
                'total' => 0,
                'large_trunk' => {
                  'total' => 0,
                  'cartao' => 0,
                  'dinheiro' => 0
                 }
               },

               'busy' => {
                 'total' => 0
               }
            }

            all_taxis = Taxi.all.select(&:is_alive)
            all_free = all_taxis.select(&:free?)
            all_free_large_trunk = all_free.select(&:large_trunk?)

            count['free']['total'] = all_free.size 
            count['free']['cartao'] = all_free.select(&:accepts_card?).size
            count['free']['dinheiro'] = all_free.select(&:accepts_money?).size
            count['free']['large_trunk']['total'] = all_free_large_trunk.size
            count['free']['large_trunk']['dinheiro'] = all_free_large_trunk.select(&:accepts_money?).size
            count['free']['large_trunk']['cartao'] = all_free_large_trunk.select(&:accepts_cartao?).size
            count['busy']['total'] = all_taxis.select(&:busy?).size
            present count
            # sql =  "SELECT data->'busy' as status, data->'large_trunk' as large_trunk, count(data) as total, p as payment_method FROM taxis, jsonb_array_elements(data->'payment_methods') p GROUP BY data->'busy', data->'large_trunk', p"
            # result = ActiveRecord::Base.connection.execute(sql)
            # count = { 'free' => {},
            #            'busy' => {}}

            # busycount = 0
            # totalfree = 0
            # totalfree_large_trunk = 0
            # result.values.each do |value|
            #   if value[0] == "false"
            #     if value[1] == "true"
            #       count['free'].merge!({ 'large_trunk' => { value[3] => value[2] } })
            #       totalfree_large_trunk += 1
            #     else
            #       count['free'].merge!({ value[3] => value[2] })
            #     end
            #     totalfree += 1
            #   else
            #     busycount += 1
            #   end
            # end
            # count['busy'] = { 'total' => busycount}
            # count['free'].merge!({ 'total' => totalfree})
            # count['free']['large_trunk'].merge!({ 'total' => totalfree_large_trunk}) if totalfree_large_trunk > 0
        end

        desc "Stores the generated token from android app for GCM communication", entity: TaxiApp::Api::Entities::Taxi
        put ":id/gcm_token" do
          taxi = Taxi.find(params[:id])
          taxi.gcm_token = params[:gcm_token]
          taxi.save!
          present taxi, with: TaxiApp::Api::Entities::Taxi
        end

        resource ":id/location" do
          desc "Updataes the current location", entity: TaxiApp::Api::Entities::Taxi
          put do
            hash = Oj.load(request.body.read)

            taxi = Taxi.find(params[:id])
            taxi.last_location = [hash['latitude'], hash['longitude']]
            taxi.heartbeat = Time.now
            taxi.save!

            present taxi, with: TaxiApp::Api::Entities::Taxi
          end
        end

        resource ":id/busy" do
          desc "Updataes the busy status", entity: TaxiApp::Api::Entities::Taxi
          put do
            taxi = Taxi.find(params[:id])
            taxi.busy = params[:busy]
            taxi.save!

            present taxi, with: TaxiApp::Api::Entities::Taxi
          end
        end

        desc "Login the cab driver from android app", entity: TaxiApp::Api::Entities::Taxi
        post('/login') do
          hash = Oj.load(request.body.read)
          user = User.new(hash)

          from_db = User.where('data @> ?', {username: user.username}.to_json).first
          error!({message: 'falha no login', description: 'usuário incorreto'}, 401) if from_db.nil?
          error!({message: 'falha no login', description: 'senha incorreta'}, 401) unless from_db.password == user.password

          error!({message: 'falha no login', description: 'Usuário não está associado a um taxi'}, 401) if from_db.taxi.nil?

          present from_db, with: TaxiApp::Api::Entities::User
        end

        desc "Return directions for the given points", entity: TaxiApp::Api::Entities::Taxi
        get('/directions') do
          travel_time = TaxiApp::TravelTime.new
          estimative = travel_time.get_route_for(params[:origin].split(','), params[:destination].split(','))
          estimative['routes'][0]['overview_polyline']
        end
      end
    end
  end
end
