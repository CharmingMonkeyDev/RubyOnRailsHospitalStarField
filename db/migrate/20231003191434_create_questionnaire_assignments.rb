class CreateQuestionnaireAssignments < ActiveRecord::Migration[6.0]
  def change
    create_table :questionnaire_assignments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :provider, null: false, foreign_key: {to_table: 'users'}
      t.references :questionnaire, null: false, foreign_key: true
      t.string :assignment_type
      t.date :expiration_date
      t.string :submission_status
      t.uuid :uuid, default: -> { "gen_random_uuid()" }, null: false
      t.timestamps
    end
  end
end
