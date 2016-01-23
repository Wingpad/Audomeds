Template.dosages.helpers({
  hasDosages: function() {
    return this.dosages.count() > 0;
  }
});
