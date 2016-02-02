var addedPrescriptions = [];
var dayFormat  = /^(day|[umtwrfs]+)$/i;
var timeFormat = /^((([01]?[0-9]|2[0-3]):[0-5][0-9],\s*)*(([01]?[0-9]|2[0-3]):[0-5][0-9]))$/;
Session.set('errors', []);
Session.set('addedPrescriptions', addedPrescriptions);

Template.dosage.rendered = function() {
  // Grab the dosage
  var dosage = this.data.dosage;
  // Get the prescriptions
  addedPrescriptions = [];
  dosage.prescriptions.forEach(function(tuple) {
    // Push the prescription onto the stack
    addedPrescriptions.push(Prescriptions.findOne({_id: tuple.prescriptionId}));
    // Defer quantity setting
    Meteor.defer(function() {
      $('#row'+tuple.prescriptionId+' select option[value="'+tuple.quantity+'"]').attr('selected', 'selected');
    });
  });
  Session.set('addedPrescriptions', addedPrescriptions);
  // Set the other fields
  $('#nameInput').val(dosage.name);
  // Check/Uncheck the dosage
  if (dosage.enabled) {
    $('#enabled').attr('checked', 'checked');
  } else {
    $('#enabled').removeAttr('checked');
  }
  // Set the time
  var tmp = dosage.scheduledTime.split('|');
  $('#dayInput').val(tmp[0]);
  $('#timeInput').val(tmp[1]);
}

Template.dosage.helpers({
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

Template.dosage.events({
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
      userId: Meteor.userId(),
      _id: this.dosage._id,
      scheduledTime: day + '|' + time
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
      Meteor.call('editDosage', dosage, function(error, result) {
        alert('Item updated.');
        Router.go('/dosages');
      });
    }
  },
  'click #delete': function(e, instance) {
    var item = this.dosage;

    Meteor.call('removeDosage', item, function(error, result) {
      alert('Item deleted.');
      Router.go('/dosages');
    });
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
