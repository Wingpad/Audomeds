// Global editor reference
var editor;

Template.addPrescription.rendered = function() {
  // Grab the holder for the Form
  var element = document.getElementById('editorHolder');
  // Grab the schema
  $.getJSON('schemas/prescription.json', function(schema) {
    // Initialize the editor
    editor = new JSONEditor(element, {
      theme: 'bootstrap3',
      disable_edit_json: true,
      disable_properties: true,
      show_errors: 'always',
      schema: schema
    });
  });
};

Template.addPrescription.events({
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

      Meteor.call('createPrescription', prescription, function(error, result) {
        alert('Item created.');
        Router.go('/prescriptions');
      });
    }
  }
});
