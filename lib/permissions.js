can = {
  createDosage: function(user) {
    return true;
  },
  editDosage: function(user, dosage) {
    return user._id === dosage.userId;
  },
  removeDosage: function(user, dosage) {
    return user._id === dosage.userId;
  },
  createPrescription: function(user) {
    return true;
  },
  editPrescription: function(user, prescription) {
    return user._id === prescription.userId;
  },
  removePrescription: function(user, prescription) {
    return user._id === prescription.userId;
  }
}
