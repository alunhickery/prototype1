var express = require('express');
var app = express();

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.get('/', function (req, res) {
  res.render('index');
});

router.post('/probate/nameanddate', function(req,res) {
	res.render('probate/address', { 'form': req.body });
});

router.post('/probate/address', function(req,res) {
	res.render('probate/maritalstatus', { 'form': req.body });
});

router.post('/probate/maritalstatus', function(req,res) {
	res.render('probate/will', { 'form': req.body });
});

router.post('/probate/will', function (req,res){
 if(req.body.radio_will_group == 'No'){
 res.render('probate/stop',{'reason' : 'No will is available. So the application would be stopped at this point.'});
}
else {
	res.render('probate/executors', { 'form': req.body });
}

});

router.post('/probate/executors', function(req,res) {
	res.render('probate/summary', { 'form': req.body });
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
