// Publish all items
Meteor.publish('allPrescriptions', function() {
  return Prescriptions.find();
});

// Publish a single item
Meteor.publish('singlePrescription', function(id) {
  return Prescriptions.find(id);
});

// Publish all items
Meteor.publish('allDosages', function() {
  return Dosages.find();
});

// Publish a single item
Meteor.publish('singleDosage', function(id) {
  return Dosages.find(id);
});
