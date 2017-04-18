Template.home.onCreated(function() {
  console.log("home created")
});

Template.home.events({
  'click [data-action=start-new-survey]': function(e, template) {
    console.log("here");
    Router.go('create-survey');
  }
});
