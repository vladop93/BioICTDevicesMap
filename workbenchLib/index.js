module.exports.messagesMonitor = require('./messagesMonitor.js');
module.exports.connectedDevicesCache = require('./connectedDevicesCache.js');


//iot-workbench additional requires   
try {
	require("./_requires.js");	
} catch (e) {	
	console.error(e);		
}

