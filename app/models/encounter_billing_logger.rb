class EncounterBillingLogger < ApplicationRecord
    belongs_to :encounter_billing
    belongs_to :user

    enum action: {
        "created": "created",
        "updated": "updated",
        "added_addendum": "added_addendum",
        "sent_charges": "sent_charges",
        "pended": "pended",
        "signed": "signed",
        "code_added": "code_added",
        "code_removed": "code_removed",
    }

end