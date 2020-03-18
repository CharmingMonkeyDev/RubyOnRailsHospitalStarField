class AddLtcFacilityToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :ltc_facility, foreign_key: true
  end
end