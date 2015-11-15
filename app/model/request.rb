class Request < ActiveRecord::Base
  store_accessor :data, :number, :taxi, :customer, :location, :payment_method, :phone, :cellphone, :observation, :address, :creator, :created_at, :accepted_at, :tryouts, :payment

end
