var express = require('express');
var app = express();

var messages = require('./messages.js');
var pages = require('./pages.js');

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.use(function (req, res, next) {
  if (!req.session.form) {
    req.session.form = {};
  }
  next();
});

router.get('/', function (req, res) {
  res.render('probate/welcome');
});




router.post('/probate/nameanddate', function(req,res) {
  req.session.form.nameanddate = req.body;
  if(req.body.radio_other_names_group == 'Yes'){
    res.render('probate/stop',{'reason' : messages.stop_alias, 'returnpage':'nameanddate'});
  } else {
    res.render('probate/dateofbirth', {'form': req.session.form});
  }
});

router.post('/probate/address', function(req,res) {
  req.session.form.address = req.body;
  if (req.body.findaddress) {
    req.session.form.form_action = 'findaddress';
    res.render('probate/address', {'form': req.session.form});
  } else {
    req.session.form.form_action = 'continue';
    if(req.body.radio_address_england_group == 'No'){
      res.render('probate/stop',{'reason' : messages.stop_foreign_domicile, 'returnpage':'address'});
    } else {
      res.render('probate/maritalstatus', {'form': req.session.form});
    }
  }
});


router.post('/probate/will', function (req,res){
  req.session.form.will = req.body;
  if(req.body.radio_will_group == 'No'){
    res.render('probate/stop',{'reason' : messages.stop_no_will,'returnpage':'will'});
  }else if (req.body.radio_will_original_group =='No'){
    res.render('probate/stop',{'reason': messages.stop_no_original_will,'returnpage':'will'});
  }else if (req.body.radio_will_address_group =='Yes'){
    res.render('probate/stop',{'reason': messages.stop_outside_englandwales_will,'returnpage':'will'});
  }
  else if (req.body.radio_codicil_group =='Yes'){
    res.render('probate/stop',{'reason': messages.stop_codicil_will,'returnpage':'will'});
  }
   else {
	  res.render('probate/executors', {'form': req.session.form});
  }
});


router.post('/probate/executors', function(req,res) {
  if (req.body.addexecutor) {
    req.session.form.form_action = "addexecutor";
    if (!req.session.form.executors) {req.session.form.executors = [];}
    req.session.form.executors[req.session.form.executors.length] = req.body;
    res.render('probate/executors', {'form': req.session.form});
  } else if (req.body.cancel_executor) {
    req.session.form.form_action = "cancel_executor";
    res.render('probate/executors', {'form': req.session.form});
  } else if (req.body.add_another_executor) {
    req.session.form.form_action = "add_another_executor";
    res.render('probate/executors', {'form': req.session.form});
  } else {
    res.render('probate/executorsnotapplying', {'form': req.session.form});
  }
});

router.post('/probate/executorsnotapplying', function(req,res) {
  req.session.form.executors = req.body.executors;
  res.render('probate/iht', {'form': req.session.form});
});

router.post('/probate/iht', function(req,res) {
  req.session.form.iht = req.body;
  if(req.body.radio_iht_group == 'No'){
    res.render('probate/stop',{'reason' : messages.stop_iht, 'returnpage':'iht'});
  } else {
    res.render('probate/summary', {'form': req.session.form});
  }
});

router.post('/probate/stop',function(req,res){
  var page_name = req.body.return_page;
  res.redirect('/probate/'+page_name);
});


router.post('/probate/applicant', function (req, res) {
    req.session.form.applicant= req.body;
    if (req.body.findaddress) {
      req.session.form.form_action = 'findaddress';
      res.render('probate/applicant', {'form': req.session.form});
    } else {
      req.session.form.form_action = 'continue';
      validateFields(req, 'applicant');
      if (req.validationErrors()) {
          res.render('probate/applicant', {'form': req.session.form, 'errors': req.validationErrors()});
      }
      else {
          res.render('probate/nameanddate', {'form': req.session.form});
      } 
    }
});

//generic POST handler
router.post('/probate/:page', function (req, res) {
    var page_name = req.params.page;
    console.log('generic post page:'+page_name);
    if (!req.session.form) {
        req.session.form = {};
    }
    console.log('>>>>>>'+req.body);
    req.session.form[page_name] = req.body;
    validateFields(req, page_name);
    if (req.validationErrors()) {
        res.render('probate/' + page_name, {'form': req.session.form, 'errors': req.validationErrors()});
    }
    else {
        res.render('probate/' + getNextPage(page_name), {'form': req.session.form});
    }
});

//generic GET handler
router.get('/probate/:page', function (req, res) {
        res.render('probate/' + req.params.page, {'form': req.session.form});
});


function getNextPage(currentPage) {
  index = pages.list.indexOf(currentPage);
  if(index >= 0 && index < pages.list.length - 1)
    return pages.list[index + 1];
}

function validateFields(req, currentPage) {
  var mandatoryFieldsArray = pages.mandatoryFields[currentPage];
    mandatoryFieldsArray.forEach(function(s) {
        req.checkBody(s, 'Field should not be empty').notEmpty();
      }
  )}

module.exports = router;
