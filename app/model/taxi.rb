require 'active_record'

class Taxi < ActiveRecord::Base
  store_accessor :data, 
      :code, 
      :license_plate, 
      :large_trunk, 
      :last_location, 
      :payment_methods, 
      :gcm_token, 
      :busy, 
      :access_token

  def generate_token
    self.access_token = SecureRandom.urlsafe_base64
  end
end
