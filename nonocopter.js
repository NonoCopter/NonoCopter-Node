var http   = require('http');
var exec   = require("child_process").exec;
var spawn  = require("child_process").spawn;
var server = http.createServer(function(req, res) { console.log( "Serveur créé"); });
var io     = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log( "Client connecté");
	socket.on( "startCalibration", drone.onStartCalibration);	
	socket.on( "photo",			   drone.onTakePhoto);	
	socket.on( "video", 		   drone.onTakeVideo);
	socket.on( "raspberry_halt",   drone.onHaltRaspberry);	
	socket.on( "raspberry_reboot", drone.onRebootRaspberry);
	socket.on("disconnect",        drone.onDisconnect);
});
server.listen(8080);

var conf = {};
conf.nodeDir    = "/home/pi/NonoCopter/";
conf.calibDir   = conf.nodeDir + "calibration/";
conf.usbDir     = conf.nodeDir + "mnt_usb/";
conf.photoDir   = conf.usbDir + "photos/";
conf.unmountCmd = "sudo umount " + conf.usbDir;
conf.mountCmd   = "sudo mount /dev/sda1 " + conf.usbDir + " -o uid=pi,gid=pi";
conf.photoCmd   = "raspistill -n --raw -w 2592 -h 1944 -q 100 -t 2000 -th none -vf -hf -ex sports -e jpg -o " + conf.usbDir;

var drone = {
	calibre : false,
	
	onStartCalibration : function( data, callback){
		if ( drone.calibre ){ callback( 2); return; }
		exec( "sudo python " + conf.calibDir + "esc_calibration.py", function (error, stdout, stderr) {						
			if ( !error && !stderr){
				drone.calibre = true;
				exec( "sudo /home/pi/pi-blaster/./pi-blaster &", function (error, stdout, stderr) {});
				callback( 1);
			} else callback( 0);
			
		});
	},
	
	onTakeVideo : function( data, callback){
		// Todo
	},
	
	onTakePhoto : function( data, callback){
		var unmountUSB = function(){ drone.unmountUSB( callback);}
		var takePhoto  = function(){ drone.takePhoto( data, unmountUSB)}
		drone.mountUSB( takePhoto);
	},
	
	takePhoto : function( data, callback){
		var fileName = ( data ? data : Date.now() )  + ".jpg";
		exec( conf.photoCmd + fileName, function (error, stdout, stderr) { 
			console.log( "### photo error  : " + error);
			console.log( "### photo stdout : " + stdout);
			console.log( "### photo stderr : " + stderr);
			if ( callback ) callback( error == null);
		});
	},
	
	mountUSB : function( callback){
		exec( conf.mountCmd, function (error, stdout, stderr) { 
			console.log( "### mountUSB error  : " + error);
			console.log( "### mountUSB stdout : " + stdout);
			console.log( "### mountUSB stderr : " + stderr);
			if ( callback ) callback( error == null);
		});
	},
	
	unmountUSB : function( callback){
		exec( conf.unmountCmd, function (error, stdout, stderr) { 
			console.log( "### unmountUSB error  : " + error);
			console.log( "### unmountUSB stdout : " + stdout);
			console.log( "### unmountUSB stderr : " + stderr);
			if ( callback ) callback( error == null);
		});
	},
	
	onRebootRaspberry : function( data, callback){
		exec( "sudo reboot", function (error, stdout, stderr) {});
	},
	
	onHaltRaspberry : function( data, callback){
		exec( "sudo halt", function (error, stdout, stderr) {});
	},
	
	onDisconnect : function( data, callback){
		// Todo
	}
}



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