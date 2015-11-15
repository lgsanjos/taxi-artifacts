class CreateTaxis < ActiveRecord::Migration
  def change
    create_table :taxis do |t|
      t.jsonb :data, null: false, default: '{}'
    end

    add_index  :taxis, :data, using: :gin
  end
end
