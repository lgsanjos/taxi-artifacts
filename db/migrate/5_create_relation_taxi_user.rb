class CreateRelationTaxiUser < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.belongs_to :taxi, index: true
    end
  end
end
