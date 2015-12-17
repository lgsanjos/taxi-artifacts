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
      :gcm_token,
      :heartbeat

  def is_alive
    return false if self.heartbeat.nil?
    (Time.now - Time.parse(self.heartbeat)) < 16 #if passed 16 seconds without sending last_location
  end

  def free?
    not self.busy?
  end

  def busy?
    self.busy == true
  end

  def large_trunk?
    self.large_trunk == true
  end

  def accepts_card?
    self.payment_methods.include? 'cartao'
  end

  def accepts_money?
    self.payment_methods.include? 'dinheiro'
  end

end
