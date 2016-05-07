from motor import motor
import os
import sys
motor1 = motor('m1', 17, simulation=False)
motor2 = motor('m2', 22, simulation=False)
motor3 = motor('m3', 23, simulation=False)
motor4 = motor('m4', 24, simulation=False)
motors = [motor1, motor2, motor3, motor4]
try :
	print sys.argv[1];
	print sys.argv[2];
	print sys.argv[3];
	print sys.argv[4];
	
	
	for m in motors :
		m.start()
	motor1.setW( sys.argv[1]);
	motor2.setW( sys.argv[2]);
	motor3.setW( sys.argv[3]);
	motor4.setW( sys.argv[4]);
	
except error :
	print "Error"