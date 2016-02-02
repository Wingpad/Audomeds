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
    var elem = document.querySelector('#chkbox' + dosage._id);
    var switchery = new Switchery(elem, {
      color: '#18bc9c'
    });

    elem.onchange = function(e) {
      var id      = dosage._id;
      var enabled = elem.checked;

      Meteor.call('setDosageEnabled', id, enabled, function(error, result) {
        if(error) {
          alert(error);
        }
      });
    };
  });
};
