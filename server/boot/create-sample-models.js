var async = require('async');
module.exports = function(app) {
  //data sources
  var db = app.dataSources.db;
  //create all models
  async.parallel({
    prescriptions: async.apply(createPrescriptions)
  }, function(err, results) {
    if (err) throw err;
    createDosages(results.prescriptions, function(err) {
      if (err) throw err;
      console.log('> models created sucessfully');
    });
  });
  //create prescriptions
  function createPrescriptions(cb) {
    db.automigrate('prescription', function(err) {
      if (err) return cb(err);
      var Prescription = app.models.prescription;
      Prescription.create([
        { name: 'Ibuprofen', shape: 'Circular', identifier: '44-291', quantity: 25, length: 9.67, width: 9.67, height: 4.92, tray: 'A' },
        { name: 'Dextroamphetamine', shape: 'Elliptical', identifier: 'B-973', quantity: 25, length: 10.18, width: 8.12, height: 3.19, tray: 'B' },
        { name: 'Lisdexamfetamine', shape: 'Capsule', identifier: 'S489', quantity: 25, length: 15.74, width: 5.58, height: 5.58, tray: 'C' }
      ], cb);
    });
  }
  // create dosages
  function createDosages(prescriptions, cb) {
    db.automigrate('dosage', function(err) {
      if (err) return cb(err);
      var Dosage = app.models.dosage;
      Dosage.create([
        { name: 'Morning', scheduledTime: 'EveryDay9:00AM', enabled: true, prescriptionIds: [ prescriptions[0].id, prescriptions[1].id ] }
      ], cb);
    });
  }
}
