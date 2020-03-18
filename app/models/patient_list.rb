class PatientList < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_and_belongs_to_many :patients, class_name: 'User', dependent: :destroy
end
