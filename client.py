import time

from MeteorClient import MeteorClient
from datetime import datetime, timedelta
from threading import Thread, Lock
from collections import namedtuple
from operator import attrgetter

USERNAME = 'wingpad'
PASSWORD = 'd104rtxxx'
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
        # Initialize the schedule
        self.schedule = []
        # Start the dispensing task
        Thread(target = self.dispense).start()
    def refresh_schedule(self):
        threadLock.acquire()
        # In reality we shouldn't just naively wipe out the old schedule
        # like this
        self.schedule = []
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
                        self.add_dispensing(prescription.get('prescriptionId'), prescription.get('quantity'), day, time)
        self.schedule = sorted(self.schedule, key=attrgetter('date'))
        threadLock.release()
    def add_dispensing(self, prescriptionId, quantity, day, time):
        day  = convert_day_to_num(day)
        time = map(int, time.split(':'))
        date = datetime.today().replace(hour=time[0], minute=time[1], second=0, microsecond=0)
        # More checks should be here in order to verify that we aren't
        # scheduling something that's already been dispensed
        if day != date.weekday():
            n = (day - date.weekday()) % 7
            date = date + timedelta(days=n)
        # And add it to the schedule
        self.schedule.append(Dispensing(prescriptionId, quantity, date))
    # Periodic Task to Handle Dispensing
    def dispense(self):
        while not stopped:
            # Print the current time
            threadLock.acquire()
            now = datetime.today().replace(second=0, microsecond=0)
            print('The time is now {}.'.format(now))
            for dispensing in self.schedule:
                if (dispensing.date > now):
                    break
                elif (dispensing.date == now):
                    print('Scheduled to dispense {}.'.format(dispensing))
            threadLock.release()
            # Wait til' the next minute comes around
            sleeptime = 60 - datetime.utcnow().second
            time.sleep(sleeptime)

class Dispensing:
    def __init__(self, prescriptionId, quantity, date):
        self.date = date
        self.quantity = quantity
        self.prescriptionId = prescriptionId
    def __str__(self):
        return '{}x of {} on {}'.format(self.quantity, self.prescriptionId, self.date)

userId = None
dosages = None
stopped = False
threadLock = Lock()
prescriptions = None
scheduler = Scheduler()

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
    if (collection == 'prescriptions'):
        threadLock.acquire()
        global prescriptions
        prescriptions = client.find('prescriptions', selector={'userId': userId})
        print('* PRESCRIPTIONS - data: {}'.format(str(prescriptions)))
        threadLock.release()
    elif (collection == 'dosages'):
        threadLock.acquire()
        global dosages
        # Print the data
        print('* DOSAGES - data: {}'.format(str(dosages)))
        # Update the dosages
        dosages = client.find('dosages', selector={'userId': userId, 'enabled': True})
        # Then refresh everything to use the newest data
        threadLock.release()
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

print('* STARTING')

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
