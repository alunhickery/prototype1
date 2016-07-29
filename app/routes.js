var express = require('express');
var app = express();

var messages = require('./messages.js');
var pageFlow = require('./pageFlow');

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
	pageFlow.validateFields(req, 'nameanddate');
	if (req.validationErrors()) {
	  res.render('probate/nameanddate', {'form': req.session.form, 'errors': req.validationErrors()});
	} else {
	  res.redirect('dateofbirth');
	}   
  }
});


router.post('/probate/will', function (req,res){
  req.session.form.will = req.body;
  pageFlow.validateFields(req, 'will');
  if (req.validationErrors()) {
        res.render('probate/will', {'form': req.session.form, 'errors': req.validationErrors()});
  } else {
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
	   res.redirect('isexecutor');
    }
  }
});


router.post('/probate/executors', function(req,res) {
  if (req.body.addexecutor) {
    pageFlow.validateFields(req, 'executors');
    if (req.validationErrors()) {
      res.render('probate/executors', {'form': req.session.form, 'errors': req.validationErrors()});
    } else {
      req.session.form.form_action = "addexecutor";
      if (!req.session.form.executors) {req.session.form.executors = [];}
      req.session.form.executors[req.session.form.executors.length] = req.body;
      res.render('probate/executors', {'form': req.session.form});
   }
  } else if (req.body.cancel_executor) {
    req.session.form.form_action = "cancel_executor";
    res.render('probate/executors', {'form': req.session.form});
  } else if (req.body.add_another_executor) {
    req.session.form.form_action = "add_another_executor";
    res.render('probate/executors', {'form': req.session.form});
  } else {
    res.redirect('executorsnotapplying');
  }
});

router.post('/probate/executorsnotapplying', function(req,res) {
  req.session.form.executors = req.body.executors;
  res.redirect('iht');
});

router.post('/probate/iht', function(req,res) {
  req.session.form.iht = req.body;
  pageFlow.validateFields(req, 'iht');
  if (req.validationErrors()) {
    res.render('probate/iht', {'form': req.session.form, 'errors': req.validationErrors()});
  } else {
    if(req.body.radio_iht_group == 'No'){
      res.render('probate/stop',{'reason' : messages.stop_iht, 'returnpage':'iht'});
    } else {
      res.redirect('summary');
    }
  }
});

router.post('/probate/stop',function(req,res){
  var page_name = req.body.return_page;
  res.redirect(page_name);
});

router.post('/probate/address', function(req,res) {
  req.session.form.address = req.body;
  if (req.body.findaddress) {
    pageFlow.validateFields(req, 'addresslookup');
    if (req.validationErrors()) {
      res.render('probate/address', {'form': req.session.form, 'errors': req.validationErrors()});
    } else {
      req.session.form.form_action = 'findaddress';
      res.render('probate/address', {'form': req.session.form});
    }
  } else {
    req.session.form.form_action = 'continue';
    pageFlow.validateFields(req, 'address');
    if (req.validationErrors()) {
      res.render('probate/address', {'form': req.session.form, 'errors': req.validationErrors()});
    } else {
      if(req.body.radio_address_england_group == 'No'){
        res.render('probate/stop',{'reason' : messages.stop_foreign_domicile, 'returnpage':'address'});
      } else {
        res.redirect('maritalstatus');
      }
    }
  }
});

router.post('/probate/applicant', function (req, res) {
    req.session.form.applicant= req.body;
    if (req.body.findaddress) {
      pageFlow.validateFields(req, 'addresslookup');
      if (req.validationErrors()) {
          res.render('probate/applicant', {'form': req.session.form, 'errors': req.validationErrors()});
      } else {
        req.session.form.form_action = 'findaddress';
        res.redirect('applicant');
      }
    } else {
      pageFlow.validateFields(req, 'applicant');
      if (req.validationErrors()) {
          res.render('probate/applicant', {'form': req.session.form, 'errors': req.validationErrors()});
      } else {
          req.session.form.form_action = 'continue';
          res.redirect('nameanddate');
      } 
    }
});

//generic POST handler
router.post('/probate/:page', function (req, res) {
    var page_name = req.params.page;
    console.log('generic post page:'+page_name);
    req.session.form[page_name] = req.body;
    pageFlow.validateFields(req, page_name);
    if (req.validationErrors()) {
        res.render('probate/' + page_name, {'form': req.session.form, 'errors': req.validationErrors()});
    }
    else {
        res.redirect(getNextPage(page_name));
    }
});

//generic GET handler
router.get('/probate/:page', function (req, res) {
        res.render('probate/' + req.params.page, {'form': req.session.form});
});

module.exports = router;
