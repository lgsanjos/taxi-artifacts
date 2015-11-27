#encoding: utf-8
require './app/api/entities/request.rb'
require './app/model/request.rb'
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
          request.taxi = params[:taxi] if params[:taxi]
          request.save!

          taxi = Taxi.find(params[:taxi]['id'])
          taxi.busy = true
          taxi.save!

          present request, with: TaxiApp::Api::Entities::Request
        end

        resource ':id/reject' do
          post do
            request = Request.find(params[:id])
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
