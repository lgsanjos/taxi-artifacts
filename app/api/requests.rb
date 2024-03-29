#encoding: utf-8
require './app/api/entities/request.rb'
require './app/model/request.rb'
require 'date'
require 'sidekiq'

module TaxiApp
  module Api
    class Requests < Grape::API
      resource :requests do
        desc "Returns the most recent requests"
        get('/') do
          requests = Request.all
          present requests, with: TaxiApp::Api::Entities::Request
        end

        params do
          requires :large_trunk, type: Boolean
          requires :address, type: Hash do
            requires :location, :type => Hash do
                requires :lat, type: Float, values: -90.0..+90.0
                requires :lng, type: Float, values: -180.0..+180.0
            end
          end
        end

        desc "Creates a request to call a taxi", entity: TaxiApp::Api::Entities::Request
        post('/') do
          request = Request.new(params.to_h)
          request.created_at = Time.now
          request.tryouts = 0
          request.save!
          ProcessRequestWorker.perform_async request.id
          present request, with: TaxiApp::Api::Entities::Request
        end

        desc "Updates a request when a taxi driver accepts", entity: TaxiApp::Api::Entities::Request
        put ':id' do
          request = Request.find(params[:id])
          request.accepted_at = Time.now
          user = User.find(params[:driver_id])
          user_hash = user.as_json.except('taxi_id')
          user_hash = user_hash.merge(user_hash.delete('data'))
          taxi_hash = user.taxi.as_json
          taxi_hash = taxi_hash.merge(taxi_hash.delete('data'))
          user_hash['taxi'] = taxi_hash
          request.driver = user_hash
          request.save!

          taxi = Taxi.find(request.driver['taxi']['id'])
          taxi.busy = true
          taxi.save!

          present request, with: TaxiApp::Api::Entities::Request
        end

        resource ':id/reject' do
          post do
            request = Request.find(params[:id])
            if (!request.driver.nil?)
              taxi = Taxi.find(request.driver['taxi']['id'])
              taxi.busy = false
              taxi.save!
            end

            #request.driver = nil
            request.data.delete('driver')
            request.save!

            ProcessRequestWorker.perform_async request.id
            present request, with: TaxiApp::Api::Entities::Request
          end
        end

        resource ':id/finish' do
          post do
            request = Request.find(params[:id])
            request.destination = params[:destination]
            request.final_taxi_location = params[:final_taxi_location]
            request.save!
            present request, with: TaxiApp::Api::Entities::Request
          end
        end
      end
    end
  end
end
