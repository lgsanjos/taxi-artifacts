require 'active_record'

class Taxi < ActiveRecord::Base
  has_one :user
  store_accessor :data,
      :code,
      :license_plate,
      :large_trunk,
      :last_location,
      :payment_methods,
      :busy

  def gcm_token
    user.gcm_token
  end

  def access_token
    user.access_token
  end
end
