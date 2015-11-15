class User < ActiveRecord::Base
  store_accessor :data, 
      :username, 
      :name, 
      :email, 
      :first_name, 
      :middle_name, 
      :last_name, 
      :password, 
      :access_token, 
      :created_at, 
      :phone,
      :taxi_id

  def generate_token
    self.access_token = SecureRandom.urlsafe_base64
  end
end
