# Returns formatted_data used in "data" of sanitized_data hash
class AmbulatoryCalculator
  def initialize(attributes)
    @attributes = attributes
    @data_type = @attributes[:data_type]
    @end_date = @attributes[:end_date]
    @patient = @attributes[:patient]
  end

  def call
    puts "Calling AmbulatoryCalcultor"
    @patient.reload
    end_date = @end_date
    start_date = end_date - 7.days
    readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", start_date, end_date)

    if @data_type == "average"
      ambulatory_report_weekly_average(readings, start_date, end_date)
    else 
      ambulatory_report_weekly_overlay(readings, start_date, end_date)
    end
  end

private
attr_accessor :patient

  def ambulatory_report_weekly_average(readings, start_date, end_date)
    start_minute = 0
    end_minute = 5
    main_array = []
    288.times do |time|
        all_dates = (start_date..end_date).to_a
        value_readings = []
        all_dates.each do |date|
            start_time = date&.beginning_of_day + start_minute.minutes
            end_time = date&.beginning_of_day + end_minute.minutes + 59.seconds

            reading_for_time_of_the_day = patient.glucose_readings.where("display_time >= ? and display_time <= ?", start_time, end_time)&.pluck(:egv_value)
            value_readings = value_readings + reading_for_time_of_the_day
        end
        value_readings_int = value_readings&.map(&:to_i)
        avg = value_readings_int. then {|val| val.sum.to_f / val.size}
        if avg&.positive?
            main_array << {
                y: avg,
                x: (end_date&.beginning_of_day + (5 * time).minutes).strftime("%Y-%m-%d %H:%M:%S"),
            }
        end
        start_minute = end_minute + 1
        end_minute = start_minute + 4
    end
    formatted_data = {}
    formatted_data[:start_date] = start_date.strftime("%B %d, %Y")
    formatted_data[:end_date] = end_date.strftime("%B %d, %Y")
    formatted_data[:datasets] = [{
        data: main_array,
        radius: 3,
        backgroundColor: "black"
    }]
    formatted_data
  end 

  def ambulatory_report_weekly_overlay(readings, start_date, end_date)
    formatted_data = {}
    readings_data = []
    formatted_data[:start_date] = start_date.strftime("%B %d, %Y")
    formatted_data[:end_date] = end_date.strftime("%B %d, %Y")
    all_dates = (start_date..end_date).to_a
    all_dates.each do |date|
        all_readings_for_day = readings.where("display_time >= ? and display_time <= ?", date&.beginning_of_day, date&.end_of_day)
        formatted_reading = get_daily_ambulatory_chart_data(all_readings_for_day)
        readings_data << {
            data: formatted_reading,
            radius: 4,
            backgroundColor: get_background_color(date)
        }
    end
    formatted_data[:datasets] = readings_data
    formatted_data
  end 

  def get_daily_ambulatory_chart_data(readings)
    formatted_reading = []
    readings.each do |reading|
        # if week_range == "2" || week_range == "4"
            x_val = "#{Date.today.strftime("%Y-%m-%d")} #{reading&.display_time&.strftime("%H:%M:%S")}"
        # else
        #     x_val = "#{reading&.display_time&.strftime("%Y-%m-%d %H:%M:%S")}"
        # end
        formatted_reading << {
            x: x_val,
            y: reading.egv_value&.to_i
        }
    end
    formatted_reading
  end

  def get_background_color(date)
    if date.sunday?
        return "#FF00F5"
    end
    if date.monday?
        return "#FF0000"
    end
    if date.tuesday?
        return "#FF890A"
    end
    if date.wednesday?
        return "#EBB708"
    end
    if date.thursday?
        return "#07BC6F"
    end
    if date.friday?
        return "#007FFF"
    end
    if date.saturday?
        return "#9300FF"
    end
end
end 