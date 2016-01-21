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

  // Users
  this.route('login');

  this.route('signup');

  this.route('forgot');
});
