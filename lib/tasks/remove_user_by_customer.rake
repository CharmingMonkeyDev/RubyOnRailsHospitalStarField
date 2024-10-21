# to call: rails remove_user_by_customer:patient_user[20]
namespace :remove_user_by_customer do
  desc "Rake task to remove user"
  task :patient_user, [:customer_id] => :environment do |task, args|
    customer_id = args[:customer_id]

    if customer_id.nil?
      puts "No customer id"
    else
      puts "Customer ID: #{customer_id}"
      customer = Customer.find(customer_id)
      patients = customer.users.where(role: "patient")
      patients.each do |patient|
        puts patient.id
        patient.destroy
      end
    end
  end
end