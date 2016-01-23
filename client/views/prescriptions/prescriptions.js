Template.prescriptions.helpers({
  hasPrescriptions: function() {
    return this.prescriptions.count() > 0;
  }
});
