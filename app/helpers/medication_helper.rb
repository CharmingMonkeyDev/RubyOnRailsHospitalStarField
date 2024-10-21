# frozen_string_literal: true

require 'net/http'
require 'json'

module MedicationHelper
  def search_rxnorm(name)
    results = []

    url = URI("#{ENV['RX_NORM_URL']}?name=#{name}")
    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Get.new(url)
    medication_search = https.request(request).read_body

    xmlData = Nokogiri::XML(medication_search)
    xmlData.remove_namespaces!
    xmlData.xpath('//rxnormdata//drugGroup//conceptGroup//conceptProperties//name/text()').each do |name|
      name_object = name.to_s
      results.push(name_object)
    end

    results
  end
end
