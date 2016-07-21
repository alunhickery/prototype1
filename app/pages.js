// Use this file to add pages and their corrsponding field validation.

module.exports = {

  list: ['welcome', 'applicant', 'nameanddate', 'dateofbirth', 'dateofdeath', 'address', 'maritalstatus', 'will', 'isexecutor', 'executors', 'executorsnotapplying', 'iht', 'summary'],

  mandatoryFields: {
	  'applicant':['applicant_firstname','applicant_lastname','applicant_home_phone_number','applicant_mobilework_phone_number','applicant_email_address','applicant_relationship_deceased','address'],
    'nameanddate': ['deceased_firstname', 'deceased_lastname','radio_other_names_group'],
    'dateofbirth': ['deceased_dob_day', 'deceased_dob_month', 'deceased_dob_year'],
    'dateofdeath': ['deceased_death_day', 'deceased_death_month', 'deceased_death_year'],
    'addresslookup': ['postcode'],
    'address': ['radio_address_england_group'],
    'maritalstatus': ['radio_marital_group'],
    'will': ['radio_will_group','radio_codicil_group','radio_will_address_group'],
    'isexecutor': ['radio_applicant_executor_group'],
    'executors': ['executor_firstname','executor_lastname'],
    'iht': ['radio_iht_group']
  }
};