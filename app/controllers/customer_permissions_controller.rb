class CustomerPermissionsController < ApplicationController
    def show
        customer = Customer.find(params[:id])
        cpcs = customer.customer_permission_controls.includes(:customer_permission).order('customer_permissions.name ASC')
        render json: Result.new(cpcs, "Permission succefully fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --CustomerPermissionsController#show")
        render json: Result.new(nil, "Permission cannot be fetched", false), status: 500
    end

    def update
        cpc = CustomerPermissionControl.find(params[:id])
        cpc.update(permitted: permit_params[:permitted])
        customer = cpc.customer
        cpcs = customer.customer_permission_controls
        render json: Result.new(cpcs, "Permission succefully fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --CustomerPermissionsController#update")
        render json: Result.new(nil, "Permission cannot be fetched", false), status: 500
    end

    def get_customer_permissions
        user = current_user
        customer = current_user.customer_selection.customer 
        permission_type = params[:type]
        permission_ids = customer.customer_permission_controls.where(permitted: true).pluck(:customer_permission_id)
        permissions = CustomerPermission.where(id: permission_ids).pluck(:name)
        permitted = permissions.any? {|p| p.downcase == permission_type.downcase}
        render json: Result.new(permitted, "Permission succefully fetched", true), status: 200
    rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e} --CustomerPermissionsController#update")
        render json: Result.new(nil, "Permission cannot be fetched", false), status: 500
    end

    private
    def permit_params
        params.require(:customer_permission_control).permit(:permitted)
    end
end
