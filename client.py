import time

from MeteorClient import MeteorClient
from datetime import datetime
from threading import Thread

USERNAME = 'wingpad'
PASSWORD = 'nullandboyde'
SERVER   = 'ws://127.0.0.1:3000/websocket'

client = MeteorClient(SERVER)

global stopped, userId, prescriptions, dosages
userId = None
dosages = None
prescriptions = None
stopped = False

print('* STARTING')

def subscribed(subscription):
    print('* SUBSCRIBED {}'.format(subscription))
    subscription = subscription[3:].lower();
    changed(subscription)

def changed(collection, id=None, fields=None, cleared=None):
    if (collection == 'prescriptions'):
        global prescriptions
        prescriptions = client.find('prescriptions', selector={'userId': userId})
        print('* PRESCRIPTIONS - data: {}'.format(str(prescriptions)))
    elif (collection == 'dosages'):
        global dosages
        dosages = client.find('dosages', selector={'userId': userId, 'enabled': True})
        print('* DOSAGES - data: {}'.format(str(dosages)))

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

# Periodic Task to Handle Dispensing
def dispense():
    # Print the current time
    print(time.ctime())
    # Restart the task in a minute
    if not stopped:
        sleeptime = 60 - datetime.utcnow().second
        time.sleep(sleeptime)
        Thread(dispense()).start()

# Register callbacks
client.on('added', changed)
client.on('failed', failed)
client.on('changed', changed)
client.on('removed', changed)
client.on('connected', connected)
client.on('subscribed', subscribed)

# Connect the Client to the server
client.connect()

# Start the dispensing task

Thread(dispense()).start()

# a (sort of) hacky way to keep the client alive
# ctrl + c to kill the script
while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        stopped = True
        break
