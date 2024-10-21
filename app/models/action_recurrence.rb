class ActionRecurrence < ApplicationRecord
  belongs_to :action
  enum end_timing: {
    "after_n_occurences": "after_n_occurences",
    "after_program_start_date": "after_program_start_date",
    "no_end_date": "no_end_date"
  }
end