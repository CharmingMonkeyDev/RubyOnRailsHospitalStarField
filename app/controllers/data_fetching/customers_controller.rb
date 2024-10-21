class DataFetching::CustomersController < ApplicationController
    include JsonHelper

    def index
        if check_privilege("View Customers")
            customers = Customer.order(:name)

            if params[:name].present?
                customers = customers.where("lower(name) ILIKE ? ", "%#{params[:name]}%")
            end
            if params[:city].present?
                customers = customers.where("lower(city) ILIKE ? ", "%#{params[:city]}%")
            end
            if params[:state].present?
                customers = customers.where("lower(state) ILIKE ? ", "%#{params[:state]}%")
            end
            result = {
                customers: customers
            }
            log_info("User ID #{current_user&.id} accessed list of all customers -- CustomersController::index")
            render json: result, status: 200
        end
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --CustomersController::index")
        json_response(e, 500)
    end

    def show
        customer = Customer.find(params[:id])
        result = {
            customer: customer,
            is_admin: current_user.is_admin?
        }
        log_info("User ID #{current_user&.id} accessed customer associated with customer ID #{customer&.id} -- CustomersController::show")
        render json: result, status: 200
    end

    def create
        customer = Customer.new(permitted_params)
        customer.save!
        # assigning current_user to currently created customer 
        customer_user = CustomerUser.create!(
            user: current_user,
            customer: customer,
            assigned_at: Time.now,
            status: "accepted",
            created_by_id: current_user.id
        )
        AssignCustomerUserPrivileges.new({customer_user: customer_user, creation_type:"new"}).call
        flash[:notice] = "#{customer.name} has been added to Starfield"
        log_info("User ID #{current_user&.id} created customer: #{customer&.id} -- CustomersController::create")
        json_response('Customer Created', 200)
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --CustomersController::create")
        json_response(e, 500)
    end

    def update
        customer = Customer.find(params[:id])
        customer.update(
            permitted_params
        )
        flash[:notice] = "#{customer.name} has been updated"
        log_info("User ID #{current_user&.id} updated customer associated with customer ID #{customer&.id} -- CustomersController::update")
        json_response('Customer Updated', 200)
    rescue StandardError => e
        Rollbar.warning("Error: #{e}  --CustomersController::update")
        json_response(e, 500)
    end

    def destroy
        customer = Customer.find(params[:id])
        if customer.check_deleteable
            customer.destroy
            render json: Result.new(nil, "Customer deleted", true), status: 200
        else
           render json: Result.new(nil, "Customer cannot be deleted", false), status: 200 
        end
        rescue StandardError => e
        log_errors(e)
        Rollbar.warning("Error: #{e}  --CustomersController::destroy")
        render json: Result.new(nil, "Customer cannot be deleted", false), status: 500
    end

    private

    def permitted_params
        params.require(:customer).permit(
            :name, 
            :address, 
            :city, 
            :state, 
            :zip, 
            :county,
            :notes, 
            :phone_number, 
            :facility_npi, 
            :federal_tax_id,
            :place_of_service_code
        )
    end

end