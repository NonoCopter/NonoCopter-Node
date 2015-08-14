var http   = require('http');
var exec   = require("child_process").exec;
var spawn  = require("child_process").spawn;
var server = http.createServer(function(req, res) { console.log( "Serveur créé"); });
var io     = require('socket.io').listen(server);

var config = {};
config.nodeDir  = "/home/pi/NonoCopter/";
config.calibDir = config.nodeDir + "calibration/";

var calibreDone = false;

io.sockets.on('connection', function(socket) {
	console.log( "Client connecté");
	socket.on( "startCalibration", function( data, callback){
		if ( calibreDone ){ callback( 2); return; }
		exec( "sudo python " + config.calibDir + "esc_calibration.py", function (error, stdout, stderr) {						
			if ( !error && !stderr){
				calibreDone = true;
				exec( "sudo /home/pi/pi-blaster/./pi-blaster &", function (error, stdout, stderr) {});
				callback( 1);
			} else callback( 0);
			
		});
	});	
	
	socket.on( "photo", function( data, callback){
		
	});
	
	socket.on( "video", function( data, callback){
		
	});
	
	socket.on( "raspberry_halt", function( data, callback){
		exec( "sudo halt", function (error, stdout, stderr) {});
	});
	
	socket.on( "raspberry_reboot", function( data, callback){
		exec( "sudo reboot", function (error, stdout, stderr) {});
	});

	socket.on('disconnect', function(){
		console.log( "Client déconnecté");
	});
});
server.listen(8080);



/*var i2c     = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');
var i2c1    = i2c.openSync(1);
var sensor  = new MPU6050(i2c1, 0x68);
var COS45   = Math.cos( 45);
var SIN45   = Math.sin( 45);
var assert  = require('assert');
function getRotation(){
	try{
		var raw = sensor.readSync();
		assert( raw, "Données MPU6050 non disponible");
		var rot = raw.rotation;
		assert( rot, "Données de rotation manquantes");
		var x1 = rot.x;
		var y1 = rot.y;
		assert( x1 !=null && y1 != null, "Données X ou/et Y manquante(s)");
		return { x : x1, y : y1};
	}
	catch(e) {
		console.log( e);
	}
}
function calcXYforDrone( _x, _y){
	if ( _x == null || _y == null ) return { x : 0, y : 0};
	var x2 = ( _x * COS45 )  + ( _y * SIN45);
	var y2 = ( -_x * SIN45 ) - ( _y * COS45);
	console.log( x2);
	console.log( y2);
	return { x : x2, y : y2};
}
var rotation = getRotation();
calcXYforDrone( rotation.x, rotation.y);
*/

/*var i2c     = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');
var address = 0x68;
var i2c1    = i2c.openSync(1);
var sensor  = new MPU6050(i2c1, address);
for( var i=0; i < 5000; i++ ) {
	try {
		console.log( sensor.readSync());
	}
	catch( e) {
		console.log( e);
	}
}*/

/*var piblaster = require('pi-blaster.js');
var motors = [ 17, 22, 23, 24];
for ( var i=0; i < motors.length; i++){
	var motor = motors[ i];
	piblaster.setPwm( motor, 0.10);
}*/