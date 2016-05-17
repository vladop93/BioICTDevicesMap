#Using Connected Devices Cache

All connected devices are mirrored in memory cache. 

Every device has the following properties:
* deviceID - the ID of the device
* deviceType - the type of the device
* lastUpdateTime - the time in milliseconds since midnight of January 1, 1970 and the last update time of the device
* lastUpdateDate - the date in GMT format of the last update time of the device

In addition, the device object holds the device attributes and their values, based on the device events payload.

For instance if a device sends an event with payload _"temperature = 10,pressure = 1000"_ then the cached device will have `device.temperature` and `device.pressure` properties 


##Usage
```javascript
//get the connected devices cache object from any js file in the application
var connectedDevices = require('workbenchLib').connectedDevicesCache;

//Get an array of all the connected devices 
var devices = connectedDevices.getConnectedDevices();

//Get an array of all the connected devices of a specific type (e.g. tempCtrl)
var tempCtrlDevices = connectedDevices.getConnectedDevicesOfType("tempCtrl");

//Get a specific device by ID (e.g. 9FEB756FAC8F)
var aDevice = connectedDevices.getConnectedDevice("9FEB756FAC8F");
```




