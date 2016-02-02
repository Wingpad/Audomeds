Template.dosages.helpers({
  hasDosages: function() {
    return this.dosages.count() > 0;
  },
  isChecked: function(enabled) {
    return enabled ? 'checked' : '';
  }
});

Template.dosages.rendered = function() {
  this.data.dosages.forEach(function(dosage) {
    var elem = document.querySelector('#' + dosage._id);
    var switchery = new Switchery(elem);

    elem.onchange = function(e) {
      var id      = elem.id;
      var enabled = elem.checked;

      Meteor.call('setDosageEnabled', id, enabled, function(error, result) {
        console.log(error);
      });
    };
  });
};
