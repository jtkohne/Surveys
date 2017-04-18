Meteor.startup ->
  if Meteor.isClient
    Router.configure
      layoutTemplate: 'master'

Router.route '/',
  name: 'home'
  template: 'home'

Router.route '/create',
  name: 'create-survey'
  template: 'createSurvey'

Router.route '/my-surveys',
  name: 'my-surveys'
  template: 'mySurveys'

  waitOn: -> [
    Meteor.subscribe 'mySurveys', Meteor.UserId
  ]

  data: ->
    return Surveys.find({}).fetch();
