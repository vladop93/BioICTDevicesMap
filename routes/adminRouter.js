var adminRouter = require('express').Router();
var app = require('../app.js');
app.use('/admin', adminRouter);
module.exports = adminRouter;

var appEnv = require("cfenv").getAppEnv();	
var IOTF = require('watsonIoT');
var connectedDevices = require('workbenchLib').connectedDevicesCache;
var WebSocketServer = require('ws').Server;
var basicAuth = require('basic-auth');

var ADMIN_USER     = "ADMIN";
var ADMIN_PASSWORD = "ADMIN";
//basic authentication 	
var authenticate = function(req,res,next){
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.status(401).end();
	}
	var user = basicAuth(req);
	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	}
	if (user.name === ADMIN_USER && user.pass === ADMIN_PASSWORD) {
		return next();
	} else {
		return unauthorized(res);
	}
};

//force https
adminRouter.all('*', function (req, res, next) {	
	if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http'){
		res.redirect('https://' + req.headers.host  + '/admin' + req.url);
	}
	else{
		next();
	}
});

adminRouter.get('/connectedDevices', authenticate, function(req,res){
	res.send(connectedDevices.getConnectedDevices());
});

adminRouter.get('/iotConfig', authenticate, function(req,res){
	res.send(IOTF.devicesConfigs);
});

adminRouter.prototype.wssServer = null;
var initWebSocketServer = null;

adminRouter.get('/messagesMonitor', authenticate, function(req,res){
	initWebSocketServer();
	res.render('messagesMonitor', { appName: appEnv.name, iotconfig: IOTF.devicesConfigs });
});

adminRouter.prototype.wssServer = null;

//open wed socket server for messages monitoring
initWebSocketServer = function (){
	if(adminRouter.prototype.wssServer !== null){
		return; //already created
	}
	//create websocket server
	adminRouter.prototype.wssServer = new WebSocketServer({ 
		server: app.server,
		path :  '/admin/messagesMonitor',
		verifyClient : function (info, callback) { //only allow internal clients from the server origin 
			var allow = (info.origin.toLowerCase() === appEnv.url.toLowerCase());
			if(!allow){
				console.log("rejected web socket connection form external origin " + info.origin + " only connection form internal origin " + appEnv.url + " are accepted");
			}
			if(!callback){
				return allow;
			}
			var statusCode = (allow) ? 200 : 403;
			callback (allow, statusCode);
		}});

	//listen to messages monitor
	var messagesMonitor = require('workbenchLib').messagesMonitor;
	messagesMonitor.addListener(function(msg){	
		adminRouter.prototype.wssServer.clients.forEach(function each(client) {
			try {
				client.send(JSON.stringify(msg));
			} catch (e) {
				console.error(e);
			}		
		});
	});	
};
