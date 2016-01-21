Template.prescription.helpers({
  oneSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.storage == 1) ? 'selected' : '';
  },
  twoSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.storage == 2) ? 'selected' : '';
  },
  threeSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.storage == 3) ? 'selected' : '';
  },
  fourSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.storage == 4) ? 'selected' : '';
  },
  roundSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Round') ? 'selected' : '';
  },
  triangularSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Triangular') ? 'selected' : '';
  },
  oblongSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Oblong') ? 'selected' : '';
  },
  dropSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Drop') ? 'selected' : '';
  },
  ovalSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Oval') ? 'selected' : '';
  },
  otherSelected: function() {
    prescription = Template.instance().data.prescription;
    return (prescription.shape == 'Other') ? 'selected' : '';
  }
});

Template.prescription.events({
  'click #delete': function(e, instance) {
    var item = this.prescription;
    console.log(item);
    Meteor.call('removePrescription', item, function(error, result) {
      alert('Item deleted.');
      Router.go('/prescriptions');
    });
  }
});
