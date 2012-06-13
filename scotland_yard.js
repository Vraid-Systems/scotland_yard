if (Meteor.is_client) {
  Template.about.greeting = function () {
    return "Welcome to the online version of Scotland Yard!";
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}