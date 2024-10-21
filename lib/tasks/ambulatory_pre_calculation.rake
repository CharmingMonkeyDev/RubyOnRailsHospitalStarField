# Recalculating every day and removing older ones
task ambulatory_precalc: :environment do

  def create_average_am_calc(data, end_date, patient_id, data_type)
    AmbulatoryWeeklyResult.create!(data_type: "average", results: data, user_id: patient_id, end_date: end_date)
  end

  # Cycle through every patient user
  patients = User.joins(:synced_accounts).where(role: "patient")
  patients.each do |patient|
    patient.ambulatory_weekly_results&.destroy_all
    week_1_end_date = Date.yesterday
    week_2_end_date = week_1_end_date - 8.days
    week_3_end_date = week_2_end_date - 8.days
    week_4_end_date = week_3_end_date - 8.days

    average_data = AmbulatoryCalculator.new({patient: patient, data_type: "average", end_date: week_1_end_date}).call
    create_average_am_calc(average_data, week_1_end_date, patient.id, "average")

    average_data = AmbulatoryCalculator.new({patient: patient, data_type: "average", end_date: week_2_end_date}).call
    create_average_am_calc(average_data, week_2_end_date, patient.id, "average")

    average_data = AmbulatoryCalculator.new({patient: patient, data_type: "average", end_date: week_3_end_date}).call
    create_average_am_calc(average_data, week_3_end_date, patient.id, "average")

    average_data = AmbulatoryCalculator.new({patient: patient, data_type: "average", end_date: week_4_end_date}).call
    create_average_am_calc(average_data, week_4_end_date, patient.id, "average")

    overlay_data = AmbulatoryCalculator.new({patient: patient, data_type: "overlay", end_date: week_1_end_date}).call
    create_average_am_calc(average_data, week_1_end_date, patient.id, "overlay")

    overlay_data = AmbulatoryCalculator.new({patient: patient, data_type: "overlay", end_date: week_2_end_date}).call
    create_average_am_calc(average_data, week_2_end_date, patient.id, "overlay")

    overlay_data = AmbulatoryCalculator.new({patient: patient, data_type: "overlay", end_date: week_3_end_date}).call
    create_average_am_calc(average_data, week_3_end_date, patient.id, "overlay")

    overlay_data = AmbulatoryCalculator.new({patient: patient, data_type: "overlay", end_date: week_4_end_date}).call
    create_average_am_calc(average_data, week_4_end_date, patient.id, "overlay")
  end
end

