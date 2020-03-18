# frozen_string_literal: true

class ResourceItemsController < ApplicationController
  before_action :verify_two_factor
  include JsonHelper

  def index
    if check_privilege("Access Resource Catalog")
      selected_customer = current_user.customer_selection.customer
      resource_items = selected_customer&.resource_items
      log_info("User ID #{current_user&.id} accessed ResourceItem for customer#{selected_customer&.id} --ResourceItemsController::index")
      render json: Result.new(resource_items, "Data fetched", true), status: 200
    else
      render json: Result.new(nil, "Access denied", true), status: 200
    end
  rescue StandardError => e
    render json: Result.new(nil, e, false), status: 500
  end

  def create
    selected_customer = current_user.customer_selection.customer
    resource = selected_customer.resource_items.create!(resource_items_strong_params)
    log_info("User ID #{current_user&.id} create ResourceItem ID #{resource&.id} --ResourceItemsController::create")
    flash[:notice] = "The resource item has been created: #{resource.name}"
    render json: Result.new(resource, "The resource item has been created: #{resource.name}", true), status: 200
  rescue StandardError => e
    render json: Result.new(nil, e, false), status: 500
  end

  def update
    resource = ResourceItem.find_by_id(params[:id])
    resource.update!(resource_items_strong_params)
    log_info("User ID #{current_user&.id} updated ResourceItem ID #{resource&.id} --ResourceItemsController::update")
    flash[:notice] = 'The resource has been updated'
    render json: Result.new(resource, 'The resource has been updated', true), status: 200
  rescue StandardError => e
    render json: Result.new(nil, e, false), status: 500
  end

  def filter_resource
    resource_ids = params[:resource_ids]
    selected_customer = current_user.customer_selection.customer
    resource_items = selected_customer&.resource_items.where(id: resource_ids)
    log_info("User ID #{current_user&.id} accessed ResourceItem for customer#{selected_customer&.id} --ResourceItemsController::filter_resource")
    render json: Result.new(resource_items, "Data fetched", true), status: 200
  rescue StandardError => e
    render json: Result.new(nil, e, false), status: 500
  end

  private

  def resource_items_strong_params
    permited_params = %i[name link_url resource_type pdf is_deleted]
    params.permit(permited_params)
  end
end
