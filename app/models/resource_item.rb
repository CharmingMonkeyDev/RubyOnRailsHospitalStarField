# frozen_string_literal: true

class ResourceItem < ApplicationRecord
  belongs_to :customer
  has_one_attached :pdf
  default_scope { order('created_at DESC') }

  def as_json(options = {})
    options[:methods] = %i[pdf_url attachment representable]
    super
  end

  def serializable_hash(options = nil)
    super(options).merge(
      link: get_resource_link,
    )
  end

  def pdf_url
    pdf.attached? ? Rails.application.routes.url_helpers.url_for(pdf) : nil
  rescue StandardError
    nil
  end

  def get_resource_link
    link_url = self.link_url
    if self.resource_type == "pdf" 
      link_url = self.pdf_url
    end
    link_url
  end

  def attachment
    pdf.attached?
  end

  def representable
    pdf.representable?
  rescue StandardError
    nil
  end
end
