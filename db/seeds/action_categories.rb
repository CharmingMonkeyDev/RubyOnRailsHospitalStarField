# frozen_string_literal: true

if ActionCategory.count.zero?
  customer_id = Customer.first.id

  category = ActionCategory.create!(
    name: 'Activities', 
    sort: 1
  )

  category.patient_actions.create!(
    text: 'Take a walk',
    subtext: 'Walk for 15 minutes', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )

  category.patient_actions.create!(
    text: 'Lift weights', 
    subtext: 'Lift 15 lbs each arm', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )
  category.patient_actions.create!(
    text: 'Do Situps', 
    subtext: '20 reps each day', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )

  category = ActionCategory.create!(
    name: 'Diet', 
    sort: 2
  )

  category.patient_actions.create!(
    text: 'Eat vegetables', 
    subtext: '2 carrots per day', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hospital'
  )

  category.patient_actions.create!(
    text: 'Count calories', 
    subtext: 'track the amount of food you eat',
    recurring: true, 
    customer_id: customer_id, 
    icon: 'hospital'
  )

  category.patient_actions.create!(
    text: 'One apple a day', 
    subtext: 'keeps the doctor away', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hospital'
  )

  category = ActionCategory.create!(
    name: 'Education', 
    sort: 3
  )

  category.patient_actions.create!(
    text: 'Exercise your mind', 
    subtext: 'Read a book', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'heart'
  )

  category.patient_actions.create!(
    text: 'Learn Diabetes', 
    subtext: 'learn more about your disease', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'heart'
  )

  category = ActionCategory.create!(
    name: 'Medication', 
    sort: 4
  )

  category.patient_actions.create!(
    text: 'Take Advil', 
    subtext: '1 pill', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'droplet'
  )

  category.patient_actions.create!(
    text: 'Take Tylenol', 
    subtext: '2 pills', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'droplet'
  )

  category.patient_actions.create!(
    text: 'Take Excedrin', 
    subtext: '3 pills', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'droplet'
  )

  category = ActionCategory.create!(
    name: 'Testing', 
    sort: 5
  )

  category.patient_actions.create!(
    text: 'Check Blood Glucose', 
    subtext: 'Once before each meal', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )

  category.patient_actions.create!(
    text: 'Check Blood Presure', 
    subtext: 'Use wallmart checker', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )

  category = ActionCategory.create!(
    name: 'Coach', 
    sort: 6
  )

  category.patient_actions.create!(
    text: 'Say hi to the patient', 
    subtext: 'Introduce yourself to your new patient', 
    recurring: true,
    customer_id: customer_id, 
    icon: 'hand'
  )
end
