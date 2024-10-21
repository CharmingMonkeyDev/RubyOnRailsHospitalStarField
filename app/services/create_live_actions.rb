class CreateLiveActions
  def initialize(attributes)
    @attributes = attributes
    @assigned_program = @attributes[:assigned_program]
    @assigned_provider_action = @attributes[:assigned_provider_action]
  end

  def call
    if @assigned_program.present?
      create_program_live_actions
    elsif @assigned_provider_action.present?
      create_provider_action_live_actions
    end
  end

  private
  attr_accessor :assigned_program

  def create_program_live_actions
    program = @assigned_program.program
    program_actions = program.program_actions
    program_start_date = @assigned_program.start_date
    program_actions.each do |program_action|
      action_data = if program_action.override_recurrence
        program_action
      else
        program_action.action.action_recurrence
      end

      if action_data.start_on_program_start
        actual_start_date = program_start_date
      else
        start_after_program_start_unit = action_data.start_after_program_start_unit
        start_after_program_start_value = action_data.start_after_program_start_value

        days_to_add = if start_after_program_start_unit == 'week'
          start_after_program_start_value * 7
        else
          start_after_program_start_value
        end
        actual_start_date = program_start_date + days_to_add.days
      end

      if action_data.repeat
        case action_data.end_timing
        when 'no_end_date'
          # Create up to 30 instances
          create_action_queues_with_limit(program_action.action_id,  @assigned_program.patient_id, action_data, actual_start_date, @assigned_program.id, nil, 30)
  
        when 'after_n_occurences'
          # Create n instances where n is stored in the occurences column
          create_action_queues_with_limit(program_action.action_id,  @assigned_program.patient_id, action_data, actual_start_date, @assigned_program.id)
  
        when 'after_program_start_date'
          # Create instances until the end date based on program start
          create_action_queues_until_end_date(@assigned_program.patient_id, program_action.action_id, action_data, actual_start_date, @assigned_program.id)
        end
      else
        # Only create one instance when repeat is false
        aq = ActionQueue.create!(
          patient_id: assigned_program.patient_id,
          action_id: program_action.action_id,
          assigned_program_id: assigned_program.id,
          due_date: actual_start_date
        )
      end
    end
  end

  # Method to create a limited number of ActionQueue instances
  def create_action_queues_with_limit(action_id, patient_id, action_data, actual_start_date, program_id = nil, assigned_provider_action_id = nil, limit = nil)
    if limit.nil?
      limit = [action_data.occurences, 30].min
    end
    total_created = 0
    i = 0
    days_of_week = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6
    }
    while total_created < limit
      next_due_date = calculate_next_due_date(actual_start_date, action_data.repeat_unit, action_data.repeat_value, i)
      if action_data.repeat_unit == 'week'
        created_count = 0
        due_date_starting_of_week = next_due_date.beginning_of_week
        days_of_week.each do |day, offset|
          if action_data.send(day)
            due_date = due_date_starting_of_week + offset.days
            if due_date >= Date.today
              ActionQueue.create!(
                patient_id: patient_id,
                action_id: action_id,
                assigned_program_id: program_id,
                assigned_provider_action_id: assigned_provider_action_id,
                due_date: due_date
              )
              total_created += 1
            end
            break if total_created >= limit
          end
        end
      else
        ActionQueue.create!(
          patient_id: patient_id,
          action_id: action_id,
          assigned_program_id: program_id,
          assigned_provider_action_id: assigned_provider_action_id,
          due_date: next_due_date
        )
        total_created += 1
      end

      i+=1
    end
  end

  # Method to create ActionQueue instances until the calculated end date
  def create_action_queues_until_end_date(patient_id, action_id, action_data, actual_start_date, program_id = nil, assigned_provider_action_id = nil)
    end_date = calculate_end_date(action_data, actual_start_date)

    total_created = 0
    i = 0
    days_of_week = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6
    }
    next_due_date = calculate_next_due_date(actual_start_date, action_data.repeat_unit, action_data.repeat_value, i)

    while next_due_date <= end_date
      if action_data.repeat_unit == 'week'
        created_count = 0
        due_date_starting_of_week = next_due_date.beginning_of_week
        days_of_week.each do |day, offset|
          if action_data.send(day)
            due_date = due_date_starting_of_week + offset.days
            if due_date >= Date.today and due_date >= actual_start_date
              ActionQueue.create!(
                patient_id: patient_id,
                action_id: action_id,
                assigned_program_id: program_id,
                assigned_provider_action_id: assigned_provider_action_id,
                due_date: due_date
              )
              total_created += 1
            end
          end
        end
      else
        ActionQueue.create!(
          patient_id: patient_id,
          action_id: action_id,
          assigned_program_id: program_id,
          assigned_provider_action_id: assigned_provider_action_id,
          due_date: next_due_date
        )
        total_created += 1
      end
      i+=1
      next_due_date = calculate_next_due_date(actual_start_date, action_data.repeat_unit, action_data.repeat_value, i)
    end
  end

  # Calculate the next due date based on the repeat unit and value
  def calculate_next_due_date(initial_date, unit, value, count)
    case unit
    when 'day'
      initial_date + (value * count).days
    when 'week'
      initial_date + (value * count).weeks
    else
      initial_date
    end
  end

  # Calculate the end date based on program start
  def calculate_end_date(action_data, program_start_date)
    case action_data.end_after_program_start_unit
    when 'day'
      program_start_date + action_data.end_after_program_start_value.days
    when 'week'
      program_start_date + action_data.end_after_program_start_value.weeks
    else
      program_start_date
    end
  end

  def create_provider_action_live_actions
    provider_action = @assigned_provider_action.action

    program_start_date = @assigned_provider_action.start_date
    action_data = provider_action.action_recurrence

    if action_data.start_on_program_start
      actual_start_date = program_start_date
    else
      start_after_program_start_unit = action_data.start_after_program_start_unit
      start_after_program_start_value = action_data.start_after_program_start_value

      days_to_add = if start_after_program_start_unit == 'week'
        start_after_program_start_value * 7
      else
        start_after_program_start_value
      end
      actual_start_date = program_start_date + days_to_add.days
    end

    if action_data.repeat
      case action_data.end_timing
      when 'no_end_date'
        # Create up to 30 instances
        create_action_queues_with_limit(provider_action.id,  @assigned_provider_action.patient_id, action_data, actual_start_date, nil, @assigned_provider_action.id, 30)

      when 'after_n_occurences'
        # Create n instances where n is stored in the occurences column
        create_action_queues_with_limit(provider_action.id,  @assigned_provider_action.patient_id, action_data, actual_start_date, nil, @assigned_provider_action.id)

      when 'after_program_start_date'
        # Create instances until the end date based on program start
        create_action_queues_until_end_date(@assigned_provider_action.patient_id, provider_action.id, action_data, actual_start_date, nil, @assigned_provider_action.id)
      end
    else
      # Only create one instance when repeat is false
      aq = ActionQueue.create!(
        patient_id:  @assigned_provider_action.patient_id,
        action_id: provider_action.id,
        assigned_program_id: nil,
        assigned_provider_action_id: @assigned_provider_action.id,
        due_date: actual_start_date
      )
    end
  end

end