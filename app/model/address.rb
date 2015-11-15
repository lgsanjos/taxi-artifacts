class Address < ActiveRecord::Base
  store_accessor :data, :street_name, :street_number, :city, :state, :country, :zip_code, :neighborhood, :coordinates
end
