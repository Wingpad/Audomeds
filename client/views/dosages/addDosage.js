var addedPrescriptions = [];
var dayFormat  = /^(day|[umtwrfs]+)$/i;
var timeFormat = /^((([01]?[0-9]|2[0-3]):[0-5][0-9],\s*)*(([01]?[0-9]|2[0-3]):[0-5][0-9]))$/;
Session.set('addedPrescriptions', addedPrescriptions);
Session.set('errors', []);

Template.addDosage.helpers({
  hasPrescriptions: function() {
    return this.prescriptions.count() > 0;
  },
  hasAddedPrescriptions: function() {
    return Session.get('addedPrescriptions').length > 0;
  },
  hasErrors: function() {
    return Session.get('errors').length > 0;
  },
  addedPrescriptions: function() {
    return Session.get('addedPrescriptions');
  },
  errors: function() {
    return Session.get('errors');
  },
  quantities: [
    1,2,3,4,5,6
  ]
});

Template.addDosage.events({
  'click #addPrescription': function(e, instance) {
    var selectedId = $('#prescriptionSelector option:selected').attr('id');

    if (selectedId) {
      if (indexOfById(selectedId) >= 0) {
        alert('You have already added this prescription to the dosage.');
        return;
      }
      var prescription = Prescriptions.findOne(selectedId);
      addedPrescriptions.push(prescription);
      Session.set('addedPrescriptions', addedPrescriptions);
      Meteor.defer(function() {
        $('#row'+selectedId+' td a').click(function() {
          var index = indexOfById(selectedId);
          addedPrescriptions.splice(index, 1);
          Session.set('addedPrescriptions', addedPrescriptions);
          alert('Prescription "' + prescription.name + '" removed.');
        });
      });
    } else {
      alert('Please select a prescription first.');
    }
  },
  'click #submit': function(e, instance) {
    e.preventDefault();

    var day  = $('#dayInput').val();
    var time = $('#timeInput').val();

    var errors = [];
    var dosage = {
      name: $('#nameInput').val(),
      enabled: $('#enabled').is(':checked'),
      prescriptions: [],
      scheduledTime: day + '{' + time + '}'
    };

    if (addedPrescriptions.length === 0) {
      errors.push('Please add prescriptions to the dosage.');
    }

    if (!dosage.name) {
      errors.push('Please enter a name for the dosage.');
    }

    if (!(dayFormat.test(day) && timeFormat.test(time))) {
      errors.push('Please correct the Scheduled Time.');
    }

    addedPrescriptions.forEach(function(prescription) {
      var tuple = {
        prescriptionId: prescription._id,
        quantity: $('#row'+prescription._id+' select option:selected').val()
      };

      if (tuple.quantity) {
        dosage.prescriptions.push(tuple);
      } else {
        errors.push('Please set a quantity for "' + prescription.name + '."');
      }
    });

    Session.set('errors', errors);

    if (!errors.length) {
      Meteor.call('createDosage', dosage, function(error, result) {
        alert('Item created.');
        Router.go('/dosages');
      });
    }
  }
});

function indexOfById(id) {
  for (var i = 0; i < addedPrescriptions.length; i++) {
    if (addedPrescriptions[i]._id === id) {
      return i;
    }
  }
  return -1;
}
