#encoding: utf-8
require 'geocoder'

class TaxiChooser
  #coordinate is an array [lat,lng]
  def nearest_to(coordinate, cabs_list)
    nearest_cab_list = Hash.new
    cabs_list.each do |cab|
      nearest_cab_list[Geocoder::Calculations.distance_between(coordinate, cab.last_location)] = cab
    end
    distance = nearest_cab_list.keys.sort[0]
    #[distance, nearest_cab_list[distance]] should we return the distance too ?
    nearest_cab_list[distance]
  end
end
