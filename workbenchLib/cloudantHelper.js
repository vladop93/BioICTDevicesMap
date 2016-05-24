var _ = require('underscore');
var connectedDevicesCache = require('workbenchLib').connectedDevicesCache;
var cloudantHelper = exports;


var CLOUDANT_DB_NAME = 'mydb';


var DB_UPDATE_INTERVAL = 6000; // period to update the DB from the memory image (mSec)

var cloudantCreds = VCAP_SERVICES.cloudantNoSQLDB[0].credentials;

// init cloudant DB connection
var Cloudant = require('cloudant');

var cloudant = {};


var _db_ = null;

// connect to the database or create it if needed
cloudantHelper.init = function()
{

	cloudant = Cloudant(cloudantCreds.url, function(err,cloudant) 
			{
				// create DB if does not exist
				var db = cloudant.db.use(CLOUDANT_DB_NAME);
				cloudant.db.get(CLOUDANT_DB_NAME, function(err, body) {
					  if (!err) 
					  {
						    console.log(body);
					  }
					  else 
					  {
						  console.log('creating ' + CLOUDANT_DB_NAME);
						  cloudant.db.create(CLOUDANT_DB_NAME, function(err,body) {
							console.log('create error ' + err + ' body get ' + body);
							if (!err)
							{
								console.log(body);
							}
							else
							{
								console.log('Err creating DB ' + body );
							}
						  });
					  }
				})
			});
};

// called periodically - scan devices and store data in DB
// a document per device
cloudantHelper.storeDeviceData = function(){
	if (!_db_)
	  _db_ = cloudant.db.use(CLOUDANT_DB_NAME);
	
	var connectedDevices = connectedDevicesCache.getConnectedDevices();
	_.each(connectedDevices, function(device){
		cloudantHelper.createOrUpdateDevice(device);
	});	
};

// update device in a DB document - if the device exists update data, 
// if not, create a new document
cloudantHelper.createOrUpdateDevice = function(device)
{
	if (!device) return; // no device....
	
	var devID = device.deviceID;
	
	var updateTime = device.lastUpdateTime;
	if (updateTime > 0)
	{
		_db_.get(devID,null,function(err,body) {
			if (!err)
			{
				console.log('successfully got ' + JSON.stringify(body,null,"\t"));

				body[updateTime] = device;
				console.log('-------AFTER ' + JSON.stringify(body,null,"\t"));
				_db_.insert(body,null,function(err, body) 
				{
					  if (!err)
						 console.log(body);
					  else 
						 console.log("!!!!!!!!error inserting" + devID + " err = " + err + " body = " + body); 
				});
			}
			else if (err.error == 'not_found') 
			{
				var doc = {};
				doc[updateTime] = device;
	
				_db_.insert(doc,devID,function(err, body) {
					  if (!err)
						 console.log("created document " + JSON.stringify(body));
					  else 
						  console.log("error inserting" + devID + " err = " + err + " body = " + body); 
				});
			}
			else
			{
				console.log('error on get document ' + devID + " "+ err + ' body ' + body);
			}
		});
	}
}


cloudantHelper.init();
setInterval(cloudantHelper.storeDeviceData, DB_UPDATE_INTERVAL);