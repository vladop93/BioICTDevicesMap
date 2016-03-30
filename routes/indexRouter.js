var indexRouter = require('express').Router();
var app = require('app.js');
var appEnv = require("cfenv").getAppEnv();
app.use('/', indexRouter);
module.exports = indexRouter;


indexRouter.get('/', function(req, res) {
	 res.render('index', { appName: appEnv.name });
});


