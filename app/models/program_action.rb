class ProgramAction < ApplicationRecord
  belongs_to :action
  belongs_to :program
  # has_one :action_recurrence, through: :action

  def serializable_hash(options = nil)
    super(options).merge(
      action: action,
      action_steps: action&.action_steps,
      action_resources: action&.resources,
      readable_recurrence: get_readable_recurrence,
    )
  end

  def get_readable_recurrence
    if !override_recurrence
      return nil
    end
    if !repeat
      return "Does not Repeat"
    end
    if repeat_unit == "day"
      str = "Repeats every #{repeat_value} #{'day'.pluralize(repeat_value)}"
    else
      str = "Repeats every  #{repeat_value} #{'week'.pluralize(repeat_value)}"
      days_of_week = %w[Monday Tuesday Wednesday Thursday Friday Saturday Sunday]
      days = []

      days_of_week.each do |day|
        if public_send(day.downcase)
          days << day
        end
      end
      unless days.empty?
        str << " on " << days.join(', ')
      end
    end
    
    if end_timing == ActionRecurrence.end_timings["after_n_occurences"]
      return str + " till #{occurences} #{'occurences'.pluralize(occurences)}"
    elsif end_timing == ActionRecurrence.end_timings["after_program_start_date"]
      return str + " till #{end_after_program_start_value} #{end_after_program_start_unit&.pluralize(end_after_program_start_value)} after program start date."
    end

    return str
  end
end
