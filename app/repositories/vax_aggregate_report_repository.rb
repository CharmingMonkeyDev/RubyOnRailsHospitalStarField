class VaxAggregateReportRepository
  include GeneralHelper

  def initialize(attributes)
    @attributes = attributes
    @customer_id = @attributes[:customer_id]
    @insurance_type = @attributes[:insurance_type]
    @start_date = @attributes[:start_date]
    @end_date = @attributes[:end_date]
    @admin_report = @attributes[:admin_report]
    @provider_id = @attributes[:provider_id]
  end

  def get_data
    result = get_aggregate_data
  end

  private 

  attr_accessor :provider_id, :customer_id, :insurance_type, :start_date, :end_date

  def get_aggregate_data
    all_data = get_all_data
    array_data = all_data.to_a
    array_data
  end

  def provider
    @provider ||= User.find(provider_id)
  end

  def customer_ids
    # all the customer that the provider has active association
    if @admin_report
        customer_ids = Customer.all.pluck(:id)
    else
        customers = provider.customers.joins(:customer_users).where("customer_users.status = ?", "accepted").group(:id)
        customer_ids = customers.ids
    end
    
    customer_ids
  end

  def get_filters
      filter = ""
      if customer_id.present?
        filter += " and c.id = #{customer_id}"
      end

      if insurance_type.present?
        filter += " and lower(pi.insurance_type) = '#{insurance_type.downcase}'"
      end

      if start_date.present?
      filter += " and DATE(pfi.recommended_date) >= '#{start_date}'"
      end

      if end_date.present?
        filter += " and DATE(pfi.recommended_date) <= '#{end_date}'"
      end

      return filter
  end

  def vaccine_types
    return PatientForecastImmunization.pluck(:vaccine_type)&.uniq&.sort
  end

  def get_all_data
    sql = "SELECT c.id, c.NAME, c.zip, c.county,"

    vaccine_types.each do |type|
      formatted_type = to_snake_case(type)

      sql += "SUM(CASE WHEN pfi.vaccine_type = '#{type}' THEN 1 ELSE 0 END) AS #{formatted_type}_FORECASTED,
      SUM(CASE WHEN pfi.vaccine_type = '#{type}' AND pfi.given_date IS NOT NULL THEN 1 ELSE 0 END) AS #{formatted_type}_GIVEN,
      SUM(CASE WHEN pfi.vaccine_type = '#{type}' AND pfi.defer_date IS NOT NULL THEN 1 ELSE 0 END) AS #{formatted_type}_DEFERRED,"
    end

    sql +=  "SUM(CASE WHEN pfi.vaccine_type IS NOT NULL THEN 1 ELSE 0 END) AS TOTAL_FORECASTED,
            SUM(CASE WHEN pfi.given_date IS NOT NULL THEN 1 ELSE 0 END) AS TOTAL_GIVEN,
            SUM(CASE WHEN pfi.defer_date IS NOT NULL THEN 1 ELSE 0 END) AS TOTAL_DEFERRED
          FROM
            customers c 
          JOIN
            customer_users cu ON cu.customer_id = c.id
          JOIN
            users u ON cu.user_id = u.id
          LEFT JOIN
            patient_forecast_immunizations pfi ON u.id = pfi.user_id
          LEFT JOIN
            patient_insurances pi on u.id = pi.user_id
          WHERE c.id = any(array#{customer_ids}) #{get_filters}
          GROUP BY
            c.id
          ORDER BY
            c.name;"

    result = ActiveRecord::Base.connection.execute(sql)
  rescue StandardError => e
      Rollbar.warning("Error on Vax Aggregate report repository #{e}")
      return []
  end

end
