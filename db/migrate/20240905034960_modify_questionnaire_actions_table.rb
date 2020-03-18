class ModifyQuestionnaireActionsTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :questionnaire_actions, :assigned_pathway_week_action_id
    
    # Add the new foreign key column
    add_reference :questionnaire_actions, :action_queue, foreign_key: true
  end
end
