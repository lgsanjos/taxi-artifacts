class User < ActiveRecord::Base
  belongs_to :taxi
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
      :phone

  def generate_token
    self.access_token = SecureRandom.urlsafe_base64
  end
end
