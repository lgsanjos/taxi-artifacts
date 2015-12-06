require 'active_record'

class Taxi < ActiveRecord::Base
  has_many :users
  store_accessor :data,
      :code,
      :license_plate,
      :large_trunk,
      :last_location,
      :payment_methods,
      :busy,
      :gcm_token
end
