/*For debug in local environment uncomment this file & generate IoT Platform API keys and set apiKey & apiToken
//DO NOT COMMIT TO BLUEMIX

var apiKey = "MY_API_KEY";
var apiToken = "MY_API_TOKEN";


var org = apiKey.split("-")[1];

process.env.VCAP_SERVICES = (process.env.VCAP_SERVICES) ? process.env.VCAP_SERVICES : JSON.stringify(
{
   "iotf-service": [
      {
         "credentials": {
            "org": org,
            "apiKey": apiKey,
            "apiToken": apiToken
         }
      }
   ]
});
*/