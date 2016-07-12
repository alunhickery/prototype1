var express = require('express');
var app = express();
var messages = require('./messages.js');
var form = {};

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/probate/nameanddate', function(req,res) {
  res.render('probate/nameanddate', {'form': form});
});

router.post('/probate/nameanddate', function(req,res) {
  form.nameanddate = req.body;
	res.render('probate/address', {'form': form});
});

router.post('/probate/address', function(req,res) {
  form.address = req.body;
    console.log(req.body);
  if(req.body.radio_address_england_group == 'No'){
    res.render('probate/stop',{'reason' : messages.stop_foreign_domicile});
  } else {
  	res.render('probate/maritalstatus', {'form': form});
  }
});

router.post('/probate/maritalstatus', function(req,res) {
  form.maritalstatus = req.body;
	res.render('probate/will', {'form': form});
});

router.post('/probate/will', function (req,res){
  form.will = req.body;
 if(req.body.radio_will_group == 'No'){
 res.render('probate/stop',{'reason' : messages.stop_no_will});
}
else {
	res.render('probate/executors', {'form': form});
}

});

router.post('/probate/executors', function(req,res) {
  form.executors = req.body;
	res.render('probate/summary', {'form': form});
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
