// Use this file to change prototype configuration.// Note: prototype config can be overridden using environment variables (eg on heroku)module.exports = {  list: ['welcome', 'applicant', 'nameanddate', 'dateofbirth', 'dateofdeath', 'address', 'maritalstatus', 'will', 'executors', 'executorsnotapplying', 'iht', 'summary'],  mandatoryFields: {	'applicant':['applicant_firstname','applicant_lastname','applicant_home_phone_number','applicant_mobilework_phone_number','applicant_email_address','applicant_relationship_deceased'],    'dateofbirth': ['deceased_dob_day', 'deceased_dob_month', 'deceased_dob_year'],    'dateofdeath': ['deceased_death_day', 'deceased_death_month', 'deceased_death_year'],    'maritalstatus': ['radio_marital_group']  }};