var addedPrescriptions = [];
Session.set('addedPrescriptions', addedPrescriptions);

Template.addDosage.helpers({
  hasPrescriptions: function() {
    return this.prescriptions.count() > 0;
  },
  hasAddedPrescriptions: function() {
    return Session.get('addedPrescriptions').length > 0;
  },
  addedPrescriptions: function() {
    return Session.get('addedPrescriptions');
  },
  quantities: [
    1,2,3,4,5,6
  ]
});

Template.addDosage.events({
  'click #addPrescription': function(e, instance) {
    var selectedId = $('#prescriptionSelector option:selected').attr('id');

    if (selectedId) {
      var prescription = Prescriptions.findOne(selectedId);
      addedPrescriptions.push(prescription);
      Session.set('addedPrescriptions', addedPrescriptions);
    } else {
      alert('Please select a prescription first, thanks.');
    }
  }
});
