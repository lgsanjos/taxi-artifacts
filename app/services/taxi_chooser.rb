#encoding: utf-8

class TaxiChooser
  def first_alive(cab_list, excluded_taxis = [])
    excluded_taxis = [] if excluded_taxis.nil?

    selected_cabs = cab_list.reject{ |cab| excluded_taxis.include? cab }
    selected_cabs.select { |cab| cab.is_alive }.first
  end
end
