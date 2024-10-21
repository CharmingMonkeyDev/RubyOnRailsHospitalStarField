class EbSendChargesLog < ApplicationRecord
  belongs_to :encounter_billing
  belongs_to :user, optional: true #this is the provider who submit charges
end
