import time

from MeteorClient import MeteorClient
from datetime import datetime
from threading import Thread, Lock
from collections import namedtuple

USERNAME = 'wingpad'
PASSWORD = 'nullandboyde'
SERVER   = 'ws://127.0.0.1:3000/websocket'
client   = MeteorClient(SERVER)

# How do we handle changes that are close to the dispensing period?
# Keep a copy, then wipe the schedule. If the dosage is not scheduled for today... just add it
#   Otherwise, check if the time has already been passed... if it has skip it
#   If the time is close to the current time, check to see if it's already been/being dispensed
#       if it has, then skip it
#   Otherwise just add it...

class Scheduler:
    def __init__(self):
        self.schedule     = []
        self.scheduleLock = Lock()
        # Start the dispensing task
        Thread(target = self.dispense, args = (self)).start()
    def refresh_schedule(self):
        threadLock.acquire()
        if dosages is None or prescriptions is None:
            threadLock.release()
            return
        for dosage in dosages:
            daysTimes = dosage.get('scheduledTime').split('|')
            times = daysTimes[1].split(',')
            if (daysTimes[0] == 'day'):
                daysTimes[0] = 'UMTWRFS'
            for prescription in dosage.get('prescriptions'):
                for day in daysTimes[0]:
                    for time in times:
                        self.add_dispensing(prescription.get('prescriptionId'), day, time)
        threadLock.release()
    def add_dispensing(self, prescriptionId, day, time):
        self.scheduleLock.acquire()
        day = convert_day_to_num(day)
        if day == datetime.today().weekday():
            print("Scheduled for today.")
        self.schedule.append(Dispensing(prescriptionId, day, time))
        self.scheduleLock.release()
    # Periodic Task to Handle Dispensing
    def dispense(self):
        while not stopped:
            # Print the current time
            self.scheduleLock.acquire()
            print(time.ctime())
            self.scheduleLock.release()
            # Wait til' the next minute comes around
            sleeptime = 60 - datetime.utcnow().second
            time.sleep(sleeptime)

class Dispensing:
    def __init__(self, prescriptionId, day, time):
        self.hasDispensed = False
        print('Scheduling {} for {} on {}'.format(prescriptionId, time, day))

userId = None
dosages = None
prescriptions = None
stopped = False
threadLock = Lock()
scheduler = Scheduler()

print('* STARTING')

def convert_day_to_num(day):
    switcher = {
        "U": 6,
        "M": 0,
        "T": 1,
        "W": 2,
        "R": 3,
        "F": 4,
        "S": 5
    }
    return switcher.get(day, None)

def subscribed(subscription):
    print('* SUBSCRIBED {}'.format(subscription))
    subscription = subscription[3:].lower();
    changed(subscription)

def changed(collection, id=None, fields=None, cleared=None):
    threadLock.acquire()
    if (collection == 'prescriptions'):
        global prescriptions
        prescriptions = client.find('prescriptions', selector={'userId': userId})
        print('* PRESCRIPTIONS - data: {}'.format(str(prescriptions)))
    elif (collection == 'dosages'):
        global dosages
        dosages = client.find('dosages', selector={'userId': userId, 'enabled': True})
        print('* DOSAGES - data: {}'.format(str(dosages)))
    threadLock.release()
    # Then refresh to use the newest data
    scheduler.refresh_schedule()

def connected():
    print('* CONNECTED')
    client.login(USERNAME, PASSWORD, callback=logged_in)

def failed(collection, data):
    print('* FAILED - data: {}'.format(str(data)))

def logged_in(error, data):
    if error:
        print(error)
    else:
        print('* LOGGED IN - data: {}'.format(str(data)))
        global userId
        userId = data.get('id')
        print('* USER ID - {}'.format(userId))
        client.subscribe('allPrescriptions')
        client.subscribe('allDosages')

# Register callbacks
client.on('added', changed)
client.on('failed', failed)
client.on('changed', changed)
client.on('removed', changed)
client.on('connected', connected)
client.on('subscribed', subscribed)

# Connect the Client to the server
client.connect()

# a (sort of) hacky way to keep the client alive
# ctrl + c to kill the script
while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        stopped = True
        break
