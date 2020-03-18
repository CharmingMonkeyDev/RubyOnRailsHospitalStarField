last_customer = Customer.first

actions = [
  { action_type: "provider", title: "Welcome Email", published_at: DateTime.now, subject: "Initial welcome email to new customer", icon: "email", is_archived: false, action_category_id: 1, customer_id: last_customer.id },
  { action_type: "provider", title: "Account Activation", published_at: DateTime.now, subject: "Alert to activate account", icon: "account_circle", is_archived: false, action_category_id: 2, customer_id: last_customer.id },
  { action_type: "provider", title: "Subscription Expiry", published_at: DateTime.now, subject: "Reminder about upcoming subscription expiry", icon: "timer", is_archived: false, action_category_id: 3, customer_id: last_customer.id },
  { action_type: "provider", title: "Profile Update Needed", published_at: DateTime.now, subject: "Request to update profile details", icon: "update", is_archived: false, action_category_id: 4, customer_id: last_customer.id }
]

actions.each do |action_attributes|
  Action.create!(action_attributes)
end

puts "Seeded Actions for last customer: #{last_customer.name}"