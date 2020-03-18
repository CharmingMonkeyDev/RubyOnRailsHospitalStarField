# frozen_string_literal: true
def create_customer_user(user, customer)
  customer.customer_users.create!(
    user: user,
    assigned_at: Time.now,
    accepted_at: Time.now,
    status: "accepted"
  )
end

def create_dummy_patient(number)
  patient = User.create!(
    email: "dev+star_patient#{number}@codelation.com",
    password: 'STAR_key123', 
    role: 'patient',
    first_name: 'Test',
    middle_name: "Patient", 
    last_name: "lastname #{number}", 
    date_of_birth: '1985-10-9 17:22:02.800194', 
    address: '1st street', 
    city: 'Fargo', 
    state: 'ND', 
    zip: '58103', 
    mobile_phone_number: Faker::PhoneNumber.cell_phone, 
    gender: 'Male', 
    patient_identifier: ENV['TEST_PATIENT_IDENTIFIER'],
    user_creation_type: "invited",
  )
  patient
end

def create_dummy_provider(role, number)
  provider = User.create!(
    email: "dev+star_#{role}#{number}@codelation.com", 
    password: 'STAR_key123', 
    role: "#{role}",
    first_name: 'Test', 
    middle_name: "#{role}",
    last_name: "lastname #{number}",
    mobile_phone_number: Faker::PhoneNumber.cell_phone,
    provider_npi_number: rand.to_s[2..11] 
  )
end

if User.count.zero?
  customer = Customer.first
  customer2 = Customer.second
  patient = User.create!(
    email: 'dev+star_patient@codelation.com',
    password: 'STAR_key123', 
    role: 'patient',
    first_name: 'Test',
    middle_name: "Patient", 
    last_name: "lastname 1", 
    date_of_birth: '1985-10-12 17:22:02.800194', 
    address: '1st street', 
    city: 'Fargo', 
    state: 'ND', 
    zip: '58103', 
    mobile_phone_number: Faker::PhoneNumber.cell_phone, 
    gender: 'Male', 
    patient_identifier: ENV['TEST_PATIENT_IDENTIFIER'],
    user_creation_type: "invited",
  )
  create_customer_user(patient, customer)
  
  # Physician user-- non admin
  physician = User.create!(
    email: 'dev+star_physician@codelation.com', 
    password: 'STAR_key123', 
    role: 'physician',
    first_name: 'Test', 
    middle_name: "Physician",
    last_name: "lastname 2",
    mobile_phone_number: Faker::PhoneNumber.cell_phone,
    provider_npi_number: rand.to_s[2..11] 
  )
  create_customer_user(physician, customer)

  # health coach user -- non admin
  health_coach = User.create!(
    email: 'dev+star_health_coach@codelation.com', 
    password: 'STAR_key123', 
    role: 'health_coach',
    first_name: 'Test', 
    middle_name: "Health Coach", 
    last_name: "1", 
    mobile_phone_number: Faker::PhoneNumber.cell_phone,
    provider_npi_number: rand.to_s[2..11] 
  )
  create_customer_user(health_coach, customer)
  create_customer_user(health_coach, customer2)

  # pharmacy user ---admin
  pharmacy_user = User.create!(
    email: 'dev+star_pharmacist@codelation.com', 
    password: 'STAR_key123', 
    role: 'pharmacist',
    first_name: 'Test', 
    middle_name: "Pharmacist", 
    last_name: "1", 
    mobile_phone_number: Faker::PhoneNumber.cell_phone,
    provider_npi_number: rand.to_s[2..11] 
  )

  create_customer_user(pharmacy_user, customer)
  create_customer_user(pharmacy_user, customer2)

  customer3 = Customer.third
  customer4 = Customer.fourth

  create_customer_user(pharmacy_user, customer3)
  create_customer_user(pharmacy_user, customer4)

  
  # patient chat channels
  channel = pharmacy_user.chat_channels.create!(name: "#{patient.name}, #{pharmacy_user.name}")
  channel.chat_channel_users.create!(
    user_id: patient.id, 
    chat_user: "#{patient.id}-patient", 
    user_type: 'patient'
  )

  channel.chat_channel_users.create!(
    user_id: pharmacy_user.id, 
    chat_user: "#{pharmacy_user.id}-pharmacist",
    user_type: 'pharmacist'
  )

  # colleageue only chat channels
  channel = pharmacy_user.chat_channels.create!(name: "#{health_coach.name}, #{pharmacy_user.name}")
  channel.chat_channel_users.create!(
    user_id: health_coach.id, 
    chat_user: "#{health_coach.id}-health_coach", 
    user_type: 'health_coach'
  )

  channel.chat_channel_users.create!(
    user_id: pharmacy_user.id, 
    chat_user: "#{pharmacy_user.id}-pharmacist",
    user_type: 'pharmacist'
  )

  # all member chat channel
  channel = pharmacy_user.chat_channels.create!(name: 'Patient 1, All Members')
  channel.chat_channel_users.create!(
    user_id: patient.id, 
    chat_user: "#{patient.id}-patient", 
    user_type: 'patient'
  )
  channel.chat_channel_users.create!(
    user_id: pharmacy_user.id, 
    chat_user: "#{pharmacy_user.id}-pharmacist",
    user_type: 'pharmacist'
  )
  channel.chat_channel_users.create!(
    user_id: physician.id, 
    chat_user: "#{physician.id}-physician",
    user_type: 'physician'
  )
  channel.chat_channel_users.create!(
    user_id: health_coach.id, 
    chat_user: "#{health_coach.id}-health_coach",
    user_type: 'health_coach'
  )

  pharmacy_user = User.create!(
    email: 'dev+star_pharmacist_2@codelation.com', 
    password: 'STAR_key123', 
    role: 'pharmacist',
    first_name: 'Test', 
    middle_name: 'Pharmacist', 
    last_name: "2", 
    mobile_phone_number: Faker::PhoneNumber.cell_phone,
    provider_npi_number: rand.to_s[2..11] 
  )
  # patient chat channels
  channel = pharmacy_user.chat_channels.create!(name: "#{patient.name}, #{pharmacy_user.name}")
  channel.chat_channel_users.create!(
    user_id: patient.id, 
    chat_user: "#{patient.id}-patient", 
    user_type: 'patient'
  )
  channel.chat_channel_users.create!(
    user_id: pharmacy_user.id, 
    chat_user: "#{pharmacy_user.id}-pharmacist",
    user_type: 'pharmacist'
  )

  pharmacy_user = User.create!(
    email: 'dev+star_pharmacist_3@codelation.com', 
    password: 'STAR_key123', 
    role: 'pharmacist',
    first_name: 'Test', 
    middle_name: 'Pharmacist', 
    last_name: '3', 
    is_active: false,
    mobile_phone_number: Faker::PhoneNumber.cell_phone
  )

  customer.customer_users.create!(
    user: pharmacy_user,
    assigned_at: Time.now,
    accepted_at: Time.now,
    cancelled_at: Time.now,
    status: "inactive"
  )

  # patient chat channels
  channel = pharmacy_user.chat_channels.create!(name: "#{patient.name}, #{pharmacy_user.name}")
  channel.chat_channel_users.create!(
    user_id: patient.id, 
    chat_user: "#{patient.id}-patient", 
    user_type: 'patient'
  )

  channel.chat_channel_users.create!(
    user_id: pharmacy_user.id, 
    chat_user: "#{pharmacy_user.id}-pharmacist",
    user_type: 'pharmacist'
  )

  # create patients
  (1..25).each do |i|
    patient = create_dummy_patient(i)
    create_customer_user(patient, customer)
  end 

  #creating more providers
  physicain2 = create_dummy_provider("physician", 2)
  create_customer_user(physicain2, customer)

  physicain3 = create_dummy_provider("physician", 3)
  create_customer_user(physicain3, customer)

  physicain4 = create_dummy_provider("physician", 4)
  create_customer_user(physicain4, customer)

  health_coach2 = create_dummy_provider("health_coach", 2)
  create_customer_user(health_coach2, customer)

  health_coach3 = create_dummy_provider("health_coach", 3)
  create_customer_user(health_coach3, customer)

  health_coach4 = create_dummy_provider("health_coach", 4)
  create_customer_user(health_coach4, customer)

  health_coach4 = create_dummy_provider("pharmacist", 4)
  create_customer_user(health_coach4, customer)

  health_coach5 = create_dummy_provider("pharmacist", 5)
  create_customer_user(health_coach5, customer)

  health_coach6 = create_dummy_provider("pharmacist", 6)
  create_customer_user(health_coach6, customer)
end
