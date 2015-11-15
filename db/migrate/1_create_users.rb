class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.jsonb :data, null: false, default: '{}'
    end

    add_index  :users, :data, using: :gin
  end
end
