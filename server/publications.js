// Publish all items
Meteor.publish('allPrescriptions', function() {
  return Prescriptions.find();
});

// Publish a single item

Meteor.publish('singlePrescription', function(id) {
  return Prescriptions.find(id);
});
