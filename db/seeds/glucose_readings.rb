require "csv"
def create_glucose_record(account_id, time, value )
    GlucoseReading.create!(
        synced_account_id: account_id,
        system_time: time,
        display_time: time,
        egv_value: value,
        real_time_value: value
    )
end
if GlucoseReading.count.zero?
    patient = User.where(email: "dev+star_patient@codelation.com").first
    synced_account = SyncedAccount.create!(
        user_id: patient.id,
        account_type: "Dexcom CGM"
    )

    csv_text = File.read(Rails.root + "app/assets/files/glucose_reading.csv")
    formated_csv_text = csv_text.dup
    formated_csv_text.sub!("\xEF\xBB\xBF".dup.force_encoding("UTF-8"), "")
    csv = CSV.parse(formated_csv_text, headers: true)
    csv.each do |row|
        GlucoseReading.create!(
            synced_account_id: synced_account.id,
            system_time: row["system_time"],
            display_time: row["display_time"],
            egv_value: row["egv_value"],
            real_time_value: row["real_time_value"]
        )
    end

    (0..14).each do |i| 
      date = Time.now - i.days
      # very high value glucose
      15.times do |i|
        value = rand(250..300)
          create_glucose_record(synced_account.id, date.beginning_of_day + (i*5).minutes, value )
      end

      # high_value glucose
      36.times do |i|
          value = rand(181..249)
          create_glucose_record(synced_account.id, date.beginning_of_day + (i*5).minutes, value )
      end

      #  in target value glucose
      60.times do |i|
          value = rand(70..180)
          create_glucose_record(synced_account.id, date.beginning_of_day + (i*5).minutes, value )
      end

      #  low value glucose
      10.times do |i|
          value = rand(35..69)
          create_glucose_record(synced_account.id, date.beginning_of_day + (i*5).minutes, value )
      end

      #  very low value glucose
      10.times do |i|
          value = rand(1..34)
          create_glucose_record(synced_account.id, date.beginning_of_day + (i*5).minutes, value )
      end
    end 
end


def create_new_recent_readings
  past_readings = GlucoseReading.last(100)
  past_readings.each do |reading| 
    dup = reading.dup 
    display_time = Date.today - rand(30).days
    dup.display_time = display_time
    dup.save!
  end 
end 