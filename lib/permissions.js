can = {
  createDosage: function(userId) {
    return true;
  },
  editDosage: function(userId, dosage) {
    return userId === dosage.userId;
  },
  removeDosage: function(userId, dosage) {
    return userId === dosage.userId;
  },
  createPrescription: function(userId) {
    return true;
  },
  editPrescription: function(userId, prescription) {
    return userId === prescription.userId;
  },
  removePrescription: function(userId, prescription) {
    return userId === prescription.userId;
  }
}
