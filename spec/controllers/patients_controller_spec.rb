# # frozen_string_literal: true

# require 'rails_helper'

# RSpec.feature 'Patients Features', type: :request do
#   before do
#     @pharmacist = create(:user, role: 'pharmacist')
#     @patient = create(:user, role: 'patient')
#     @invited_user = nil
#   end

#   it 'invite a patient' do
#     sign_in @pharmacist

#     debugger

#     post '/invite_patient', params: {
#       user: {
#         email: 'suman.koirala@codelation.com',
#         first_name: 'Test',
#         last_name: "patient",
#         date_of_birth: '10/12/1985'
#       }
#     }
#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Patient Invited')

#     @invited_user = User.where.not(invite_token: nil).first
#     sign_out @pharmacist

#     # verify_identity
#     post '/verify_identity', params: {
#       user: {
#         date_of_birth: @invited_user.date_of_birth,
#         invite_token: @invited_user.invite_token
#       }
#     }
#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Identity Verified')

#     # complete_account
#     post '/complete_account', params: {
#       user: {
#         name: @invited_user.name,
#         email: @invited_user.email,
#         password: 'secret',
#         invite_token: @invited_user.invite_token
#       }
#     }
#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Account Completed')
#   end

#   it 'patient important note' do
#     sign_in @pharmacist

#     # add_note
#     post '/add_note', params: {
#       note: {
#         user_id: @patient.id,
#         value: 'New important Note',
#         note_type: 'important'
#       }
#     }

#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Note Added')
#   end

#   it 'patient progress note' do
#     sign_in @pharmacist

#     # add_note
#     post '/add_note', params: {
#       note: {
#         user_id: @patient.id,
#         value: 'New progress Note',
#         note_type: 'progress'
#       }
#     }

#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Note Added')
#   end

#   it 'patient medication' do
#     sign_in @pharmacist

#     # add_medication
#     post '/add_medication', params: {
#       medication: {
#         user_id: @patient.id,
#         name: 'Test Medication',
#         value: 'Test Note'
#       }
#     }

#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Medication Added')
#   end

#   it 'patient edit_patient_info' do
#     sign_in @pharmacist

#     # edit_patient_info
#     post '/edit_patient_info', params: {
#       user: {
#         id: @patient.id,
#         name: 'Patient Name',
#         email: @patient.email,
#         address: '1st street',
#         city: 'fargo',
#         state: 'ND',
#         zip: '58103',
#         mobile_phone_number: '555-555-5555',
#         gender: 'Female'
#       }
#     }

#     expect(response).to have_http_status(:success)
#     json_response = JSON.parse(response.body)
#     expect(json_response.keys).to match_array(['message'])
#     expect(json_response['message']).to eq('Patient Updated')
#   end
# end
