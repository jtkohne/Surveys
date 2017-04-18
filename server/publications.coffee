Meteor.publish 'mySurveys', (id) ->
  Surveys.find({owner: id});
