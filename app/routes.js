var express = require('express');
var app = express();

var messages = require('./messages.js');

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/probate/applicant', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  res.render('probate/applicant', {'form': req.session.form});
});

router.get('/probate/nameanddate', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  res.render('probate/nameanddate', {'form': req.session.form});
});

router.get('/probate/executors', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  res.render('probate/executors', {'form': req.session.form});
});

router.post('/probate/applicant', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.applicant = req.body;
  res.render('probate/nameanddate', {'form': req.session.form});
});

router.post('/probate/nameanddate', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.nameanddate = req.body;
	res.render('probate/address', {'form': req.session.form});
});

router.post('/probate/address', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.address = req.body;
    console.log(req.body);
  if(req.body.radio_address_england_group == 'No'){
    res.render('probate/stop',{'reason' : messages.stop_foreign_domicile});
  } else {
  	res.render('probate/maritalstatus', {'form': req.session.form});
  }
});

router.post('/probate/maritalstatus', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.maritalstatus = req.body;
	res.render('probate/will', {'form': req.session.form});
});

router.post('/probate/will', function (req,res){
  if (!req.session.form) {req.session.form = {};};
  req.session.form.will = req.body;
  if(req.body.radio_will_group == 'No'){
  res.render('probate/stop',{'reason' : messages.stop_no_will});
}
else {
	res.render('probate/executors', {'form': req.session.form});
}

});

router.post('/probate/executors', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.executors = req.body;
  if (req.body.addexecutor) {
    res.render('probate/executors', {'form': req.session.form});
  } else {
    res.render('probate/iht', {'form': req.session.form});
  }
});

router.post('/probate/iht', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.iht = req.body;
  res.render('probate/summary', {'form': req.session.form});
});

router.post('/probate/stop',function(req,res){
  res.redirect('/probate/welcome');
});
// Example routes - feel free to delete these

// Passing data into a page

router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name' : 'Foo' });
});

// Branching

router.get('/examples/over-18', function (req, res) {
  // get the answer from the query string (eg. ?over18=false)
  var over18 = req.query.over18;
  if (over18 == "false"){
    // redirect to the relevant page
    res.redirect("/examples/under-18");
  } else {
    // if over18 is any other value (or is missing) render the page requested
    res.render('examples/over-18');
  }
});

// add your routes here

module.exports = router;
