class @Surveys extends Minimongoid
  @_collection: new Meteor.Collection 'surveys'

  if Meteor.isServer
    Meteor.methods
      createSurvey: (survey) ->
        return Surveys.create(survey);

      deleteSurvey: (id) ->
        return Surveys.remove({_id: id});

      publishSurvey: (id) ->
        survey = Surveys.find({_id: id});
        console.log(survey.update);
        survey.update( {_id: survey._id}, { $set: {published: true, publishedOn: new Date().toDateString()} }, {upsert: true} );
