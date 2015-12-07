require 'active_record'
require 'pry'
require 'pry-nav'

class Taxi < ActiveRecord::Base
  has_many :users
  store_accessor :data,
      :code,
      :license_plate,
      :large_trunk,
      :last_location,
      :payment_methods,
      :busy,
      :gcm_token,
      :heartbeat

  def is_alive
    (Time.now - Time.parse(self.heartbeat)) < 10 #if passed 16 seconds without sending last_location
  end
end
