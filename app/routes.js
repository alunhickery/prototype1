var express = require('express');
var app = express();

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get('/', function (req, res) {
  res.render('index');
});

router.post('/probate/names', function(req,res) {
	res.render('probate/address', { 'form': req.body });
});

router.post('/probate/address', function(req,res) {
	res.render('probate/marriage', { 'form': req.body });
});

router.post('/probate/marriage', function(req,res) {
	res.render('probate/will', { 'form': req.body });
});

router.post('/probate/will', function(req,res) {
	res.render('probate/applicant', { 'form': req.body });
});

router.post('/probate/applicant', function(req,res) {
	res.render('probate/executors', { 'form': req.body });
});

router.post('/probate/executors', function(req,res) {
	res.render('probate/review', { 'form': req.body });
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
