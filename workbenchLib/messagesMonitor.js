
//Monitor for http and mqtt messages using W

var app = require('../app.js');
var IOTF = require('watsonIoT');
var stream = require('stream');
var util = require('util');
var logger = require('morgan');
var _ = require('underscore');


var listeners = [];
/*
 * messages listener registration 
 * listener example:
 * function(message){
 *  console.log(message);
 */

module.exports.addListener= function(func){
	if(!_.isFunction(func)){
		throw "listener must be a function";
	}
	listeners.push(func);
};

module.exports.removeListener= function(func){
	listeners = _.without(listeners, func);
};

function broadcast(msg){
	_.each(listeners, function(listener){
		try {
			listener(msg);
		} catch (e) {
			console.error(e);
		}		
	});
}

function wsStream () {
	stream.Writable.call(this);
}

util.inherits(wsStream, stream.Writable); 

wsStream.prototype._write = function (chunk, encoding, done) {
	var msg = {protocol: "http", message: chunk.toString()};
	broadcast(msg);
	done();
};

var httpStream = new wsStream();

app.use(logger('tiny', {stream: httpStream}));


IOTF.on("+", function(payload, deviceType, deviceId, eventType, format){
	payload = (payload) ? payload : {};
	payload = (format !== "json") ? payload.toString() : JSON.stringify(payload); 
	var msg = {protocol: "mqtt", message: eventType + " from " + deviceType + " id:" +
			deviceId + " payload: " + JSON.stringify(payload)};
	broadcast(msg);
});
