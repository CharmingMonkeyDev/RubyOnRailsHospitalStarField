class Reports::CgmReportsController < ApplicationController
    def glucose_exposure
        patient = get_patient(params[:patient_id])
        date_diff = 0
        gmi = nil
        date_label = ""
        if params[:start_date] == "null" && params[:end_date] == "null"
            reading = patient.glucose_readings.order("display_time DESC").first
            last_reading_date = reading&.display_time
            date_label = date_label_daily = date_label_biweekly = last_reading_date&.strftime("%B %d, %Y")
            glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", last_reading_date&.beginning_of_day, last_reading_date&.end_of_day)
        else
            # the star_date and end_date move backwards for eg from yesterday to 10 days ago
            start_date = params[:start_date].to_date
            end_date = params[:end_date].to_date
            date_diff = (start_date - end_date).to_i
            date_label = "#{end_date.strftime("%B %d, %Y")} - #{start_date.strftime("%B %d, %Y")}"
            date_label_daily = "#{start_date.strftime("%B %d, %Y")}"
            date_label_biweekly = "#{end_date.strftime("%B %d")} - #{start_date.strftime("%B %d, %Y")}"
            glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", end_date&.beginning_of_day, start_date&.end_of_day)
        end

        egv_values_str = glucose_readings.map(&:egv_value)
        egv_values_dates = glucose_readings.map(&:display_time).map(&:to_date).uniq
        
        # since we are storing string values this gives me string array
        egv_values_int = egv_values_str&.map(&:to_i)

        if egv_values_int.length > 0
            average_egv_result = egv_values_int. then {|val| val.sum.to_f / val.size}    
        else
            average_egv_result = nil
        end

        if egv_values_dates.size >= 12 && average_egv_result&.positive?
            gmi = calculate_gmi(average_egv_result)
        end
        log_info("User ID #{current_user&.id} accessed glucose reading for #{patient&.id} --Reports::CgmReportsController::glucose_exposure")
        result = {
            egv_value: average_egv_result&.to_i,
            gmi: gmi,
            date_label: date_label ? date_label : Date.today&.strftime("%B %d, %Y"),
            date_label_daily: date_label_daily,
            date_label_biweekly: date_label_biweekly,
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --Reports::CgmReportsController::glucose_exposure")
        render json: Result.new(nil, e, false), status: 500
    end

    def get_date_range
        patient = get_patient(params[:patient_id])
        reading = patient.glucose_readings.order("display_time DESC").first

        last_reading_date = reading&.display_time
        result = {
            daily_dates: {
                start_date: last_reading_date.strftime('%Y/%m/%d'),
                end_date: last_reading_date.strftime('%Y/%m/%d')
            },
            dates_7_days: {
                start_date: Date.yesterday.strftime('%Y/%m/%d'),
                end_date: (Date.yesterday - 6.days).strftime('%Y/%m/%d')
            },
            dates_14_days: {
                start_date: Date.yesterday.strftime('%Y/%m/%d'),
                end_date: (Date.yesterday - 13.days).strftime('%Y/%m/%d')
            },
            dates_30_days: {
                start_date: Date.yesterday.strftime('%Y/%m/%d'),
                end_date: (Date.yesterday - 29.days).strftime('%Y/%m/%d')
            }
            
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::CgmReportsController::get_date_range")
        render json: Result.new(nil, e, false), status: 500
    end

    def glucose_variability
        patient = get_patient(params[:patient_id])
        date_diff = 0
        if params[:start_date] == "null" && params[:end_date] == "null"
            reading = patient.glucose_readings.order("display_time DESC").first
            last_reading_date = reading&.display_time
            egv_values_str = patient.glucose_readings.where("display_time >= ? and display_time <= ?", last_reading_date&.beginning_of_day, last_reading_date&.end_of_day).pluck(:egv_value)
        else
            # the star_date and end_date move backwards for eg from yesterday to 10 days ago
            start_date = params[:start_date].to_date
            end_date = params[:end_date].to_date
            date_diff = (start_date - end_date).to_i + 1
            egv_values_str = patient.glucose_readings.where("display_time >= ? and display_time <= ?", end_date&.beginning_of_day, start_date&.end_of_day).pluck(:egv_value)
        end
        
        # since we are storing string values this gives me string array
        egv_values_int = egv_values_str&.map(&:to_i)
        standard_deviation = calculate_standard_deviation(egv_values_int)
        coefficient_of_variation = calculate_coefficient_of_variation(egv_values_int)
        cgm_active_percentage = calculate_cgm_active_percentage(date_diff, egv_values_int)

        log_info("User ID #{current_user&.id} accessed glucose reading for #{patient&.id} --Reports::CgmReportsController::glucose_variability")
        result = {
            standard_deviation: standard_deviation,
            coefficient_of_variation: coefficient_of_variation,
            cgm_active_percentage: cgm_active_percentage
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::CgmReportsController::glucose_variability")
        render json: Result.new(nil, e, false), status: 500
    end

    def glucose_ranges
        patient = get_patient(params[:patient_id])
        if params[:start_date] == "null" && params[:end_date] == "null"
            reading = patient.glucose_readings.order("display_time DESC").first
            last_reading_date = reading&.display_time
            egv_values_str = patient.glucose_readings.where("display_time >= ? and display_time <= ?", last_reading_date&.beginning_of_day, last_reading_date&.end_of_day).pluck(:egv_value)
        else
            # the star_date and end_date move backwards for eg from yesterday to 10 days ago
            start_date = params[:start_date].to_date
            end_date = params[:end_date].to_date
            egv_values_str = patient.glucose_readings.where("display_time >= ? and display_time <= ?", end_date&.beginning_of_day, start_date&.end_of_day).pluck(:egv_value)
        end
        log_info("User ID #{current_user&.id} accessed glucose reading for #{patient&.id} --Reports::CgmReportsController::glucose_ranges")
        egv_values_int = egv_values_str&.map(&:to_i)
        graph_data = get_chart_data(egv_values_int)
        result = {
            graph_data: graph_data
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::CgmReportsController::glucose_ranges")
        render json: Result.new(nil, e, false), status: 500
    end

    def ambulatory_report_daily
        patient = get_patient(params[:patient_id])
        date_label = ""
        if params[:selected_date] == "null" 
            reading = patient.glucose_readings.order("display_time DESC").first
            last_reading_date = reading&.display_time
            date_label = last_reading_date&.strftime("%m/%d/%Y") || Date.today.strftime("%m/%d/%Y")
            glucose_readings = patient.glucose_readings&.where("display_time >= ? and display_time <= ?", last_reading_date&.beginning_of_day, last_reading_date&.end_of_day)
            
        else
            # the star_date and end_date move backwards for eg from yesterday to 10 days ago so yesterday> 10 days ago
            start_date = params[:selected_date].to_date
            end_date = params[:selected_date].to_date
            date_label = start_date&.strftime("%m/%d/%Y")
            glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", end_date&.beginning_of_day, start_date&.end_of_day)
        end
        log_info("User ID #{current_user&.id} accessed glucose reading for #{patient&.id} --Reports::CgmReportsController::ambulatory_report_daily")
        graph_data = get_daily_ambulatory_chart_data(glucose_readings)
  
        result = {
            graph_data: graph_data,
            date_label: date_label
        }
        render json: Result.new(result, "Data fetched", true), status: 200
    rescue StandardError => e
        Rollbar.warning("Error: #{e} --Reports::CgmReportsController::ambulatory_report_daily")
        render json: Result.new(nil, e, false), status: 500
    end

    def ambulatory_report_weekly
        patient = get_patient(params[:patient_id])
        if params[:data_type] == "average"
            if params[:week_range] == "4"
                week_4_end_date = Date.yesterday
                week_4_start_date = week_4_end_date - 7.days
                week_3_end_date = week_4_start_date - 1.days
                week_3_start_date = week_3_end_date - 7.days
                week_2_end_date = week_3_start_date - 1.days
                week_2_start_date = week_2_end_date - 7.days
                week_1_end_date = week_2_end_date - 1.days
                week_1_start_date = week_1_end_date - 7.days
                glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", week_1_start_date&.beginning_of_day, week_4_end_date&.end_of_day)
                
                sanitized_data = [
                    {
                        label: "Week 1",
                        data: get_weekly_formatted_data_average(glucose_readings, week_1_start_date, week_1_end_date, patient)
                    },
                    {
                        label: "Week 2",
                        data: get_weekly_formatted_data_average(glucose_readings, week_2_start_date, week_2_end_date, patient)
                    },
                    {
                        label: "Week 3",
                        data: get_weekly_formatted_data_average(glucose_readings, week_3_start_date, week_3_end_date, patient)
                    },
                    {
                        label: "Week 4",
                        data: get_weekly_formatted_data_average(glucose_readings, week_4_start_date, week_4_end_date, patient)
                    }
                ]
            elsif params[:week_range] == "2"
                week_2_end_date = params[:start_date]&.to_date || Date.yesterday  #TODO shouldn't this be called "end_date" param
                week_2_start_date = week_2_end_date - 7.days
                week_1_end_date = week_2_start_date - 1.days
                week_1_start_date = week_1_end_date - 7.days
                glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", week_1_start_date&.beginning_of_day, week_2_end_date&.end_of_day)
                
                sanitized_data = [
                    {
                        label: "Week 1",
                        data: get_weekly_formatted_data_average(glucose_readings, week_1_start_date, week_1_end_date, patient)
                    },
                    {
                        label: "Week 2",
                        data: get_weekly_formatted_data_average(glucose_readings, week_2_start_date, week_2_end_date, patient)
                    }
                ]
            end
        else  #overlay
            if params[:week_range] == "4"
                week_4_end_date = Date.yesterday
                week_4_start_date = week_4_end_date - 7.days
                week_3_end_date = week_4_start_date - 1.days
                week_3_start_date = week_3_end_date - 7.days
                week_2_end_date = week_3_start_date - 1.days
                week_2_start_date = week_2_end_date - 7.days
                week_1_end_date = week_2_end_date - 1.days
                week_1_start_date = week_1_end_date - 7.days
                glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", week_1_start_date&.beginning_of_day, week_4_end_date&.end_of_day)
                
                sanitized_data = [
                    {
                        label: "Week 1",
                        data: get_weekly_formatted_data(glucose_readings, week_1_start_date, week_1_end_date, patient)
                    },
                    {
                        label: "Week 2",
                        data: get_weekly_formatted_data(glucose_readings, week_2_start_date, week_2_end_date, patient)
                    },
                    {
                        label: "Week 3",
                        data: get_weekly_formatted_data(glucose_readings, week_3_start_date, week_3_end_date, patient)
                    },
                    {
                        label: "Week 4",
                        data: get_weekly_formatted_data(glucose_readings, week_4_start_date, week_4_end_date, patient)
                    }
                ]
            elsif params[:week_range] == "2"
                week_2_end_date = Date.yesterday
                week_2_start_date = week_2_end_date - 7.days
                week_1_end_date = week_2_start_date - 1.days
                week_1_start_date = week_1_end_date - 7.days
                glucose_readings = patient.glucose_readings.where("display_time >= ? and display_time <= ?", week_1_start_date&.beginning_of_day, week_2_end_date&.end_of_day)
                
                sanitized_data = [
                    {
                        label: "Week 1",
                        data: get_weekly_formatted_data(glucose_readings, week_1_start_date, week_1_end_date, patient)
                    },
                    {
                        label: "Week 2",
                        data: get_weekly_formatted_data(glucose_readings, week_2_start_date, week_2_end_date, patient)
                    }
                ]
            end
        end
        log_info("User ID #{current_user&.id} accessed glucose reading for #{patient&.id} --Reports::CgmReportsController::ambulatory_report_weekly")
        result = {
            sanitized_data: sanitized_data&.reverse
        }
        render json: Result.new(result, "Data fetched", true), status: 200
        rescue StandardError => e
            Rollbar.warning("Error: #{e} --Reports::CgmReportsController::ambulatory_report_weekly")
            render json: Result.new(nil, e, false), status: 500
    end

    private

    def calculate_gmi(average_glucose)
        return (3.31 + (0.02392 * average_glucose)).round(1)
    end

    def calculate_standard_deviation(glucose_array)
        mean = glucose_array.sum(0.0) / glucose_array.size
        sum = glucose_array.sum(0.0) { |element| (element - mean) ** 2 }
        variance = sum / (glucose_array.size - 1)
        standard_deviation = Math.sqrt(variance)
        standard_deviation&.round(0)
        rescue StandardError => e
            Rollbar.warning("Error on standard deviation calculation #{e} --Reports::CgmReportsController::calculate_standard_deviation")
            "N/A"
    end

    def calculate_coefficient_of_variation(glucose_array)
        sd = calculate_standard_deviation(glucose_array)
        if sd.to_i > 0
            mean = glucose_array.sum(0.0) / glucose_array.size
            cv = (sd / mean) * 100
            return cv.round(1)
        else 
            return 0
        end
        rescue StandardError => e
            Rollbar.warning("Error on  coeffieient of variation calculation #{e} --Reports::CgmReportsController::calculate_coefficient_of_variation")
            "N/A"
    end

    def calculate_cgm_active_percentage(date_diff, glucose_array)
        should_be_readings = date_diff > 0 ? 288 * date_diff : 288
        actual_readings_count = glucose_array.length
        active_percentage = (actual_readings_count / should_be_readings.to_f) * 100
        active_percentage.round(1)
    end

    def get_chart_data(glucose_array)
        total_number_of_readings = glucose_array.count
        very_low_readings_number = glucose_array.select{|x| x < 34 }&.count
        low_readings_number = glucose_array.select{|x| x >= 34 && x < 70 }&.count
        in_target_readings_number = glucose_array.select{|x| x >= 70 && x <= 180 }&.count
        high_readings_number = glucose_array.select{|x| x > 180 && x <= 250 }&.count
        very_high_readings_number = glucose_array.select{|x| x > 250 }&.count

        very_low_percentage = ((very_low_readings_number/ total_number_of_readings.to_f) * 100)&.round(1)
        low_percentage = ((low_readings_number/ total_number_of_readings.to_f) * 100)&.round(1)
        in_target_percentage = ((in_target_readings_number/ total_number_of_readings.to_f) * 100)&.round(1)
        high_percentage = ((high_readings_number/ total_number_of_readings.to_f) * 100)&.round(1)
        very_high_percentage = ((very_high_readings_number/ total_number_of_readings.to_f) * 100)&.round(1)
        
        graph_data = {
            very_low: {
                label: "Very Low",
                data: very_low_percentage,
                background_color: "#AA0603"
            },
            low: {
                label: "Low",
                data: low_percentage,
                background_color: "#FF0000"
            },
            in_target: {
                label: "In Target Range",
                data: in_target_percentage,
                background_color: "#07BC2A"
            },
            high: {
                label: "High",
                data: high_percentage,
                background_color: "#FFEB00"
            },
            very_high: {
                label: "Very High",
                data: very_high_percentage,
                background_color: "#FFB40A"
            },
        }
        graph_data
    end

    def get_daily_ambulatory_chart_data(readings)
        formatted_reading = []
        readings.each do |reading|
            if params[:week_range] == "2" || params[:week_range] == "4"
                x_val = "#{Date.today.strftime("%Y-%m-%d ")} #{reading&.display_time&.strftime("%H:%M:%S")}"
            else
                x_val = "#{reading&.display_time&.strftime("%Y-%m-%d %H:%M:%S")}"
            end
            formatted_reading << {
                x: x_val,
                y: reading.egv_value&.to_i
            }
        end
        formatted_reading
    end

    def get_weekly_formatted_data(readings, start_date, end_date, patient)
        # Check for pre-existing results
        weekly_result = AmbulatoryWeeklyResult.where(user_id: patient.id, end_date: end_date, data_type: "overlay").first
        if weekly_result 
          puts "Found weekly_result"
          weekly_result.results 
        else
          data = AmbulatoryCalculator.new({patient: patient, data_type: "overlay", end_date: end_date}).call
          AmbulatoryWeeklyResult.create(data_type: "overlay", results: data, user_id: patient.id, end_date: end_date)
          data
        end
    end

    def get_weekly_formatted_data_average(readings, start_date, end_date, patient)
        # Check for pre-existing results
        weekly_result = AmbulatoryWeeklyResult.where(user_id: patient.id, end_date: end_date, data_type: "average").first
        if weekly_result 
          puts "Found weekly_result"
          weekly_result.results 
        else
          data = AmbulatoryCalculator.new({patient: patient, data_type: "average", end_date: end_date}).call
          AmbulatoryWeeklyResult.create(data_type: "average", results: data, user_id: patient.id, end_date: end_date)
          data
        end
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