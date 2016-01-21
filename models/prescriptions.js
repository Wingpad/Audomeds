Prescriptions = new Mongo.Collection('prescriptions');

Prescriptions.allow({
  insert: function(userId, doc) {
    return can.createPrescription(userId);
  },
  update: function(userId, doc, fieldNames, modifier) {
    return can.editPrescription(userId, doc);
  },
  remove: function(userId, doc) {
    return can.removePrescription(userId, doc);
  }
});

Meteor.methods({
  createPrescription: function(prescription) {
    if (can.createPrescription(Meteor.user()))
      Prescriptions.insert(prescription);
  },
  removePrescription: function(prescription) {
    if (can.removePrescription(Meteor.user(), prescription)) {
      Prescriptions.remove(prescription._id);
    } else {
      throw new Meteor.Error(403, 'You do not have the rights to delete this prescription.')
    }
  }
});
