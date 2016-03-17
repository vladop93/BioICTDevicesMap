var iotfAppClient = require("ibmiotf").IotfApplication;
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var fs = require('fs-extra');
var camelize = require('camelize');
var appEnv = require("cfenv").getAppEnv();

var getDevicesConfigs,getCredentials;

function iotfClient(options) {
	if (!(this instanceof iotfClient)) {
		return new iotfClient(options);
	}
	options = (options) ? options : {};
	EventEmitter.call(this);
	var iotfConfig = getCredentials();
	this.iotfAppClient = new iotfAppClient(iotfConfig);
	this.devicesConfigs = [];
	if(options.configFile){
		this.devicesConfigs = getDevicesConfigs(options.configFile);
		if(options.configs){
			this.devicesConfigs = options.configs;
		}
		if(options.config){
			this.devicesConfigs.push(options.config);
		}
		this.createCommandsMethods();
		this.iotfAppClient.on("connect",_.bind(this.subscribeToDevicesEvents, this));
		this.iotfAppClient.on("deviceEvent", _.bind(this.onDeviceEvent, this));
		this.iotfAppClient.on("deviceStatus", _.bind(this.onDeviceStatus, this));
	}
	this.iotfAppClient.connect();	
}

module.exports = iotfClient;
//Inherit functions from `EventEmitter`'s prototype
util.inherits(iotfClient, EventEmitter);

iotfClient.prototype.onDeviceStatus = function(deviceType, deviceId, payload, topic){
	payload = JSON.parse(payload);
	this.emit(deviceId + "_" + payload.Action, deviceType, deviceId, payload, topic);
	this.emit(deviceType + "_" + payload.Action, deviceType, deviceId, payload, topic);
	this.emit("+_" + payload.Action, deviceType, deviceId, payload, topic);	
	this.emit("+_DeviceStatus", deviceType, deviceId, payload, topic);	
};

iotfClient.prototype.onDeviceEvent = function(deviceType, deviceId, eventType, format, payload){
	payload = (format === 'json') ? JSON.parse(payload).d : payload;
	this.emit(deviceId + "_+", payload, deviceType, deviceId, eventType, format);
	this.emit(deviceId + "_" + payload, deviceType, deviceId, eventType, format);
	this.emit(deviceType + "_+",  payload, deviceType, deviceId, eventType, format);
	this.emit(deviceType + "_"  +  payload, eventType, deviceType, deviceId, eventType, format);
	this.emit("+", payload, deviceType, deviceId, eventType, format);
};

iotfClient.prototype.subscribeToDevicesEvents = function(){
	_.each(this.devicesConfigs, function(config){
		config.deviceType = (config.deviceType) ? config.deviceType : ["+"];
		config.Ids = (config.Ids) ? config.Ids : ["+"];
		config.events = (config.events) ? config.events : ["+"];
		_.each(config.Ids, function(deviceID){				
			_.each(config.events, function(event){
				this.iotfAppClient.subscribeToDeviceEvents(config.deviceType, deviceID, event, "json");	
				if(config.subscribeToStatus){
					this.iotfAppClient.subscribeToDeviceStatus(config.deviceType, "+");
				}
			},this);
		},this);
	},this);

};

iotfClient.prototype.sendCommand = function(deviceType, deviceID, command, payload){
	payload = (payload)? payload : {};
	this.iotfAppClient.publishDeviceCommand(deviceType, deviceID, command, 'json', JSON.stringify(payload));
};

iotfClient.prototype.createCommandsMethods = function createCommandsMethonds(){
	//create send<message name>Message function 
	_.each(this.devicesConfigs, 
			function(config){
		this[config.deviceType] = {};
		_.each(config.commands, 
				function(command){
			var functionName = camelize('send_' + command.name + '_Message');
			var funct =  _.bind(function(deviceID, payload) {
				return this.sendCommand(config.deviceType, deviceID, command.name, payload);
			},this);
			//set the method both on this and on this.<deviceType>
			this[functionName] = funct;
			this[config.deviceType][functionName] = funct;
		},this);
	},this);
};

getCredentials = function (){
	var iotFcreds = null;
	try{
		iotFcreds = VCAP_SERVICES["iotf-service"][0].credentials;

	}catch (e) {
		throw "Cannot get IoT-Foundation credentials - for local debug update _debug.js";
	}
	var config = {
			"org" : iotFcreds.org,
			"id" :  appEnv.name,
			"auth-key" : iotFcreds.apiKey,
			"auth-token" : iotFcreds.apiToken
	};
	return config;
};

getDevicesConfigs = function getDevicesConfigs(file){
	var obj = fs.readJsonSync(file, {throws: false});
	if(!obj){
		console.log("cannot load devices info file");
		obj = {};
	}
	return obj;
};
