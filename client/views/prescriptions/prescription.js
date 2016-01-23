// Global editor reference
var editor;

if (!location.origin)
   location.origin = location.protocol + '//' + location.host;

Template.prescription.rendered = function() {
  // Grab the prescription
  var prescription = this.data.prescription;
  // Grab the holder for the Form
  var element = document.getElementById('editorHolder');
  // Grab the schema
  $.getJSON(window.location.origin + '/schemas/prescription.json', function(schema) {
    // Initialize the editor
    editor = new JSONEditor(element, {
      theme: 'bootstrap3',
      disable_edit_json: true,
      disable_properties: true,
      no_additional_properties: true,
      show_errors: 'always',
      schema: schema
    });
    // Set Editor Values
    editor.setValue(prescription);
  });
};

Template.prescription.events({
  'click #submit': function(e, instance) {
    // Validate the editor's current value against the schema
    var errors = editor.validate();
    // errors is an array of objects, each with a `path`, `property`, and `message` parameter
    //   property` is the schema keyword that triggered the validation error (e.g. "minLength")
    //   `path` is a dot separated path into the JSON object (e.g. "root.path.to.field")
    if(errors.length) {
      $('#warning').addClass('show').removeClass('hidden');
    } else {
      var prescription = editor.getValue();

      prescription._id    = this.prescription._id;
      prescription.userId = this.prescription.userId;

      Meteor.call('editPrescription', prescription, function(error, result) {
        alert('Item updated.');
        Router.go('/prescriptions');
      });
    }
  },
  'click #delete': function(e, instance) {
    var item = this.prescription;
    console.log(item);
    Meteor.call('removePrescription', item, function(error, result) {
      alert('Item deleted.');
      Router.go('/prescriptions');
    });
  }
});
