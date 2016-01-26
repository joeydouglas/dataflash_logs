

//set database variables
var server = "192.168.59.103";
var port = "8086";
var database = "testes";

//set tag variables that pertain to the log (uav name, uav number, flight name, flight number, etc).
var logInfo = '{"uav": "y6", "flight": "test01"}';

// create object from tags
var logInfoObj = JSON.parse(logInfo);

//create array and fill it w/ tags from the object so key names can be referenced in the output to Influxdb.
var logInfoArr = []

for (var property in logInfoObj) {
  logInfoArr.push(property + "=" + logInfoObj[property]);
}


function parseUpload(text) {

// static data. eventually this will be fed from the JSON log file
var text = '{"meta": {"timestamp": 1413680662.120, "type": "IMU"}, "data": {"TimeMS": 313230, "AccY": 0.013031154870986938, "AccX": -0.15820294618606567, "AccZ": -9.863511085510254, "GyrZ": 0.01947564072906971, "GyrX": 0.0015512341633439064, "GyrY": 0.0040904320776462555}}';

// create object from a line in the log file
var obj = JSON.parse(text);

//create array and fill it w/ tags from the object so key names can be referenced in the output to Influxdb.
var arr = []

for (var property in obj.data) {
    console.log(property + "=" + obj.data[property]);
    arr.push(property + "=" + obj.data[property]);
}

//sets text on webpage. for testing only at this point and will be removed.
document.getElementById("demo").innerHTML =
arr.toString();

var dataString = arr.toString();

//remove decimal from Linux Epoch time. Time precision in MS will be specified for Influxdb.
var newTimestamp = (obj.meta.timestamp + '').replace('.', '');


//add additional zero to timestamp if it's not 13 digits long
if (newTimestamp.length < 13) {
    newTimestamp = newTimestamp + "0";
}


var dbString1 = "http://" + server + ":" + port + "/write?db=" + database + "&precision=ms";
var dbString2 = obj.meta.type + "," + logInfoArr[0] + "," + logInfoArr[1] + " " + dataString + " " + newTimestamp;


var xhr = new XMLHttpRequest();
xhr.open("POST", dbString1, true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


xhr.send(dbString2);
console.log("dbString2= " + dbString2);

console.log("'http://" + server + ":" + port + "/write?db=" + database + "' --data-binary " + obj.meta.type + "," + logInfoArr[0] + "," + logInfoArr[1] + " " + dataString + " " + obj.meta.timestamp);
//console.dir(obj)
}
