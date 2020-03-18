class AddMrnSequence < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL 
    CREATE SEQUENCE users_mrn_id_seq 
    INCREMENT 1 
    MINVALUE 1001
    MAXVALUE 9999999
    START 1001
    CYCLE; 
    SQL
  end

  def down
    DROP SEQUENCE users_mrn_id_seq;
  end
end
