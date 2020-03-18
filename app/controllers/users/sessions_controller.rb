class Users::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!  #TODO should this be authenticated?
  before_action :remove_customer_selection, only: :destroy

  def remove_customer_selection
    customer_selection = current_user.customer_selection
    unless customer_selection.do_not_ask
        customer_selection.destroy
    end
  end
end