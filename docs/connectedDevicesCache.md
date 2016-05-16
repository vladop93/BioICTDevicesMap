#Connected Devices Cache

##In memory cache for all connected devices 
Each device in the cache has the next properties
* deviceID - the ID of the device
* deviceType - the type of the device
* lastUpdateTime - the last update time in milliseconds of the device attributes
* lastUpdateDate - the last update time in GMT time of the device attributes

In addition each device defines property for each payload received.

For instance if your device sends payloads with "temperature" & "pressure" then the cached device will have `device.temperature` and `device.pressure` properties 


##Usage
```javascript
var connectedDevices = require('workbenchLib').connectedDevicesCache;

//Get an array of all the connected devices 
var devices = connectedDevices.getConnectedDevices();

//Get an array of all the connected devices of a specific type (e.g. tempCtrl)
var tempCtrlDevices = connectedDevices.getConnectedDevicesOfType("tempCtrl");

//Get a specific device by ID (e.g. 9FEB756FAC8F)
var aDevice = connectedDevices.getConnectedDevice("9FEB756FAC8F");
```




