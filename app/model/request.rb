class Request < ActiveRecord::Base
  store_accessor :data, :number, :driver, :customer, :large_trunk, :location, :payment_method, :phone, :cellphone, :observation, :address, :creator, :created_at, :accepted_at, :tryouts, :payment, :destination, :final_taxi_location, :taxis_tried, :status

end
