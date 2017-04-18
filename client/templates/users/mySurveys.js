Template.mySurveys.onCreated(function() {
  this.surveys = this.data
});

Template.mySurveys.helpers({
  mySurveys: function(){
    return this;
  }
});

Template.mySurveys.events({
  "click [data-action=show-questions]": function(e, template){
     e.preventDefault();
     console.log(this);
  },

  "click [data-action=publish-post]": function(e, template) {
    e.preventDefault();
    console.log(this);
    Meteor.call('publishSurvey', this, function(error, response) {
      if (error) {
        Toast.error("Error publishing survey");
      }
      if (response) {
        Toast.success(`Post sucessfully published on ${new Date().toDateString}`);
      }
    });
  }
});
