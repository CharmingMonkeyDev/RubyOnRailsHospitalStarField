# frozen_string_literal: true

# this controller is mainly user for provider CRUD action
# for patients action use patient controller
class UserController < ApplicationController
  before_action :verify_two_factor
  include JsonHelper
  include ChannelHelper

  def show
    user = User.find(params[:id])
    log_info("User ID #{current_user&.id} accessed UserObject ID #{user&.id} --UserController::show")
    json_response(user, 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def create
    result = ProcessProviderInvitation.new({
      first_name: user_add_strong_params[:first_name],
      last_name: user_add_strong_params[:last_name],
      middle_name: user_add_strong_params[:middle_name],
      email: user_add_strong_params[:email],
      invited_by_id: current_user.id,
      role: user_add_strong_params[:role],
      mobile_phone_number: user_add_strong_params[:mobile_phone_number],
      business_phone_number: user_add_strong_params[:business_phone_number],
      provider_npi_number: user_add_strong_params[:provider_npi_number]
    }).call
    if result.success?
      flash[:notice] = result.message
      log_info("User#{current_user&.id} invited user ID #{result&.resource&.id} and assigned default privileges--UserController::create")
      json_response('Provider Invited', 200)
    else
      flash[:notice] = result.message
      log_info("User#{current_user&.id} failed to invite user --UserController::create")
      json_response(result.message, 500)
    end
  rescue StandardError => e
    json_response(e, 500)
  end

  def update
    user = User.find_by_id!(params[:id])
    user.update!(user_add_strong_params)
    log_info("User ID #{current_user&.id} updated a user ID #{user&.id} --UserController::update")
    flash[:notice] = "The user has been updated: #{user.name}"
    json_response('User Updated', 200)
  rescue StandardError => e
    json_response(e, 500)
  end

  def deactivate
    user = User.find_by_id!(params[:id])
    user.is_active = false
    user.save!
    user.customer_users.update_all(status: 'inactive')
    user.unassign_related_resources

    render json: Result.new(nil, "User Deactivated.", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e}  --UsersController::deactivate")
    render json: Result.new(nil, "Provider cannot be deactivated", false), status: 500
  end

  def reactivate
    user = User.find_by_id!(params[:id])
    user.is_active = true
    user.save!

    render json: Result.new(nil, "User Reactivated.", true), status: 200
  rescue StandardError => e
    log_errors(e)
    Rollbar.warning("Error: #{e}  --UsersController::Reactivate")
    render json: Result.new(nil, "Provider cannot be Reactivated", false), status: 500
  end

  def resend_provider_invitation
    user = User.find(params[:user_id])
    user.invite!
    render json: Result.new(nil, "Invitation sent succesfully", true), status: 200
  rescue StandardError => e
    render json: Result.new(nil, e, false), status: 500
  end

  private

  def user_add_strong_params
    permited_params = %i[first_name middle_name last_name email mobile_phone_number business_phone_number role provider_npi_number]
    params.require(:user).permit(permited_params)
  end
end
