Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.map(function() {
  // Pages
  this.route('homepage', {
    path: '/'
  });

  // Prescriptions
  this.route('prescription', {
    path: '/prescriptions/:_id',
    waitOn: function() {
      return Meteor.subscribe('singlePrescription', this.params._id);
    },
    data: function() {
      return {
        prescription: Prescriptions.findOne(this.params._id)
      }
    },
    action: function () {
      if (this.ready()) {
        this.render();
      }
    }
  });

  this.route('prescriptions', {
    waitOn: function() {
      return Meteor.subscribe('allPrescriptions');
    },
    data: function() {
      return {
        prescriptions: Prescriptions.find()
      }
    }
  });

  this.route('add-prescription');

  // Dosages
  this.route('dosage', {
    path: '/dosages/:_id',
    waitOn: function() {
      return [Meteor.subscribe('singleDosage', this.params._id),
              Meteor.subscribe('allPrescriptions')];
    },
    data: function() {
      return {
        dosage: Dosages.findOne(this.params._id),
        prescriptions: Prescriptions.find()
      }
    },
    action: function () {
      if (this.ready()) {
        this.render();
      }
    }
  });

  this.route('dosages', {
    waitOn: function() {
      return Meteor.subscribe('allDosages');
    },
    data: function() {
      return {
        dosages: Dosages.find()
      }
    },
    action: function () {
      if (this.ready()) {
        this.render();
      }
    }
  });

  this.route('add-dosage', {
    waitOn: function() {
      return Meteor.subscribe('allPrescriptions');
    },
    data: function() {
      return {
        prescriptions: Prescriptions.find()
      }
    }
  });

  // Users
  this.route('login');

  this.route('signup');

  this.route('forgot');
});
