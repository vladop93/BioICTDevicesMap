#Sending/receiving device commands/events

__The following describes how to listen to device events and send commands, per device type.__ 
___

#Device Type: Car
***
#Events

__Listen to all events from all __Car__ devices__
```javascript
var IoTClient = require('watsonIoT');
...
IoTClient.on("Car_+", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});
```
__Listen to specific events__


__Event Name: SendPosition__

__Payload: Name,lat,lon,Model__

```javascript
var IoTClient = require('watsonIoT');

Listen to SendPosition events from all Car devices
IoTClient.on("Car_SendPosition, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Name, payload.lat, payload.lon, payload.Model
...
});

Listen to SendPosition event from a specific device (e.g. 9FEB756FAC8F) 
IoTClient.on("9FEB756FAC8F_SendPosition, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Name, payload.lat, payload.lon, payload.Model
...
});

```


___


__Event Name: ModelChange__

```javascript
var IoTClient = require('watsonIoT');

Listen to ModelChange events from all Car devices
IoTClient.on("Car_ModelChange, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event 
...
});

Listen to ModelChange event from a specific device (e.g. 9FEB756FAC8F) 
IoTClient.on("9FEB756FAC8F_ModelChange, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event 
...
});

```


___





***
#Device Type: GasStation
***
#Events

__Listen to all events from all __GasStation__ devices__
```javascript
var IoTClient = require('watsonIoT');
...
IoTClient.on("GasStation_+", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});
```
__Listen to specific events__


__Event Name: SendPosition__

__Payload: Name,lat,lon,Octane__

```javascript
var IoTClient = require('watsonIoT');

Listen to SendPosition events from all GasStation devices
IoTClient.on("GasStation_SendPosition, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Name, payload.lat, payload.lon, payload.Octane
...
});

Listen to SendPosition event from a specific device (e.g. 9FEB756FAC8F) 
IoTClient.on("9FEB756FAC8F_SendPosition, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Name, payload.lat, payload.lon, payload.Octane
...
});

```


___


__Event Name: OctaneChange__

__Payload: Octane__

```javascript
var IoTClient = require('watsonIoT');

Listen to OctaneChange events from all GasStation devices
IoTClient.on("GasStation_OctaneChange, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Octane
...
});

Listen to OctaneChange event from a specific device (e.g. 9FEB756FAC8F) 
IoTClient.on("9FEB756FAC8F_OctaneChange, function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event payload.Octane
...
});

```


___





***





#Usage examples

```javascript
//Get the iot-platform client 
var IoTClient = require('watsonIoT');

//general api for sending commands
var deviceType = "tempCtrl";
var deviceID = "9FEB756FAC8F";
var command = "setDesiredTemp";
var payload = {desiredTemp : 25};
IoTClient.sendCommand(deviceType, deviceID, command, payload);


//Listen to all events from all devices
IoTClient.on("+", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
}); 

//Listen to all status events from all devices
IoTClient.on("+_DeviceStatus", function(deviceType, deviceId, payload, topic){
//ToDo handle status event
...
});

//Listen to connect event from all devices
IoTClient.on("+_Connect", function(deviceType, deviceId, payload, topic){
//ToDo handle status event
...
});

//Listen to disconnect event from all devices
IoTClient.on("+_Disconnect", function(deviceType, deviceId, payload, topic){
//ToDo handle status event
...
});

//Listen to events from a specific device (e.g. 9FEB756FAC8F) 
//All events
IoTClient.on("9FEB756FAC8F_+", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});
//All status events
IoTClient.on("9FEB756FAC8F_DeviceStatus", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});
//Connect event
IoTClient.on("9FEB756FAC8F_Connect", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});
//Disconnect event
IoTClient.on("9FEB756FAC8F_Disconnect", function(payload, deviceType, deviceId, eventType, format){
//ToDo handle event
...
});


```

