from motor import motor
import time
import os
motor1 = motor('m1', 17, simulation=False)
motor2 = motor('m2', 22, simulation=False)
motor3 = motor('m3', 23, simulation=False)
motor4 = motor('m4', 24, simulation=False)
motors = [motor1, motor2, motor3, motor4]
try :
	for m in motors :
		m.start()
		m.setW(100)
	time.sleep(5)
	for m in motors:
		m.start()
		m.setW(0)
	time.sleep(5)
	for m in motors:
		m.start()
		m.setW(10)
	time.sleep(5)
	for m in motors:
		m.start()
		m.setW(0)
	
except error :
	print "Error"