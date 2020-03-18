class CreateJoinTablePatientListUser < ActiveRecord::Migration[6.0]
  def change
    create_join_table :patient_lists, :users do |t|
      # t.index [:patient_list_id, :user_id]
      # t.index [:user_id, :patient_list_id]
    end
  end
end
