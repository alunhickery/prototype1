var express = require('express');
var app = express();

var messages = require('./messages.js');

var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



router.get('/', function (req, res) {
  res.render('probate/welcome');
});


router.get('/probate/:page', function(req,res) {
  var view = req.params.page;
  if (!req.session.form) {req.session.form = {};};
  res.render('probate/'+ view, {'form': req.session.form});
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


router.post('/probate/will', function (req,res){
  if (!req.session.form) {req.session.form = {};};
  req.session.form.will = req.body;
  if(req.body.radio_will_group == 'No'){
    res.render('probate/stop',{'reason' : messages.stop_no_will});
  } else {
	  res.render('probate/executors', {'form': req.session.form});
  }
});


router.post('/probate/executors', function(req,res) {
  if (!req.session.form) {req.session.form = {};};
  req.session.form.executors = req.body;
  if (req.body.addexecutor) {
    res.render('probate/executors', {'form': req.session.form});
  } else {
    res.render('probate/executorsnotapplying', {'form': req.session.form});
  }
});


router.post('/probate/stop',function(req,res){
  res.redirect('/probate/welcome');
});


router.post('/probate/:page', function(req,res) {
  var page_name = req.params.page;
  if (!req.session.form) {req.session.form = {};};
  req.session.form[page_name] = req.body;
  res.render('probate/' + getNextPage(page_name), {'form': req.session.form});
});


function getNextPage(currentPage) {
  pageList = ['welcome','applicant','nameanddate','address','maritalstatus','will','executors','executorsnotapplying','iht','summary'];
  index = pageList.indexOf(currentPage);
  if(index >= 0 && index < pageList.length - 1)
    return pageList[index + 1];
}


module.exports = router;
