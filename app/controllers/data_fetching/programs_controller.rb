class DataFetching::ProgramsController < ApplicationController  
    def index
      customer = current_user.customer_selection.customer
      programs = customer.programs
      log_info("Programs data accessed -- DataFetching::ProgramsController::index")
      render json: { programs: programs }, status: 200
    rescue StandardError => e
      log_errors(e)
      Rollbar.warning("Error: #{e} -- DataFetching::ProgramsController::index")
      render json: { error: "Data cannot be fetched" }, status: 500
    end
  end
  