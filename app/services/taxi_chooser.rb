#encoding: utf-8

class TaxiChooser
  def first_alive(cab_list)
    cab_list.select { |cab| cab.is_alive }.first
  end
end
