#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
from RPi import GPIO
import time
 
def RCtime (RCpin):
    reading = 0
    GPIO.setup(RCpin, GPIO.OUT)
    GPIO.output(RCpin, GPIO.LOW)
    time.sleep(0.1)

    GPIO.setup(RCpin, GPIO.IN)
    
    # This takes about 1 millisecond per loop cycle
    while (GPIO.input(RCpin) == GPIO.LOW):
        reading += 1
    
    return reading
    
# ===========================================================================
# Example
try:
    # Initialise the PWM device using the default address
    # pwm = PWM(0x40)
    # Note if you'd like more debug output you can instead run:
    pwm = PWM(0x40, debug=False)

    # Used for Drive A
    DRIVERA_AIN2 = 7
    DRIVERA_AIN1 = 8
    # Used for Drive A and B 
    DRIVERA_STBY = 25
    # Used for Drive B
    DRIVERA_BIN1 = 23
    DRIVERA_BIN2 = 24

    DRIVERB_STBY = 26
    DRIVERB_AIN1 = 13
    DRIVERB_AIN2 = 19

    # Pins for Photocells
    BELT_A_PIN = 9
    BELT_B_PIN = 10
    TRAY_DROP_PIN = 11
    BELT_DROP_PIN = 6

    # PWM Out for Drive A
    BELT_A_PWM = 0
    BELT_B_PWM = 2
    TRAY_PWM = 1
    ARM_PWM  = 3

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(DRIVERA_AIN1, GPIO.OUT)
    GPIO.setup(DRIVERA_AIN2, GPIO.OUT)
    GPIO.setup(DRIVERB_AIN1, GPIO.OUT)
    GPIO.setup(DRIVERB_AIN2, GPIO.OUT)
    GPIO.setup(DRIVERA_BIN1, GPIO.OUT)
    GPIO.setup(DRIVERA_BIN2, GPIO.OUT)
    GPIO.setup(DRIVERA_STBY, GPIO.OUT)
    GPIO.setup(DRIVERB_STBY, GPIO.OUT)
    GPIO.setup(BELT_DROP_PIN, GPIO.IN)

    servoMin = 2750 # Min pulse length out of 4096
    servoMax = 4096 # Max pulse length out of 4096

    print("* Moving Belt Forwards.")
    while(True):
        GPIO.output(DRIVERB_STBY, True)
        GPIO.output(DRIVERA_STBY, True)
        GPIO.output(DRIVERA_AIN2, False)
        GPIO.output(DRIVERA_AIN1, True)
        GPIO.output(DRIVERA_BIN2, False)
        GPIO.output(DRIVERA_BIN1, True)
        pwm.setPWM(BELT_A_PWM, servoMax, 0)
        
        if RCtime(BELT_A_PIN) > 500:
            print("* Photogate Broken.")
            break
    print("* Dispensing Slowly.")
    pwm.setPWM(BELT_A_PWM, 3072, 1024)
    while not GPIO.input(BELT_DROP_PIN):
        pass
    print("* Stopping.")
    GPIO.cleanup()
except KeyboardInterrupt:
    print("* Cleaning up.")
    GPIO.output(DRIVERA_STBY, False)
    GPIO.output(DRIVERB_STBY, False)
    pwm.setPWM(BELT_A_PWM, 0, servoMax)
    pwm.setPWM(BELT_B_PWM, 0, servoMax)
    pwm.setPWM(TRAY_PWM, 0, servoMax)
    pwm.setPWM(ARM_PWM, 0, servoMax)
    GPIO.cleanup()
