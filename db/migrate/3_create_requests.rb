class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.jsonb :data, null: false, default: '{}'
    end

    add_index  :requests, :data, using: :gin
  end
end
