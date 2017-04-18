// goToStep = function(step, template) {
//    switch(step) {
//      case 1: template.step.set(step+1); break;
//      case 2: template.step.set(step+1); break;
//    }
// }
var captureQuestions = function(template, ques, answ) {
  questions = [];
  for (let i = 0; i < ques; i++ ) {
    let nSelector = `input[name=question${i+1}]`;
    let question = $(nSelector).val();
    questions.push({
      number: i+1,
      question: question,
      answers: []
    });
    for ( let j = 0; j < answ; j++ ) {
      let aSelector = `input[name=question${i+1}answer${j+1}]`;
      let answer = $(aSelector).val();
      questions[i].answers.push({
        number: j+1,
        answer: answer
      })
    }
  }
  return questions;
}
Template.createSurvey.onCreated(function() {
  this.numberOfQuestions = new ReactiveVar(1);
  this.numberOfAnswers = new ReactiveVar(1);
  this.step = new ReactiveVar(1);
  this.createdQuestionsAndAnswers = new ReactiveVar(null);
  this.surveyName = null;
});

Template.createSurvey.helpers({

  questionAttributes: function() {
    return {
      name: "number-of-questions",
      "data-action": "select-number-of-questions"
    };
  },

  numberOfQuestionOptions: function() {
    let options = []
    for ( let i = 1; i <= 20; i++ ) {
      options.push(i);
    }
    return options;
  },

  answerAttributes: function() {
    return {
      name: "number-of-answers",
      "data-action": "select-number-of-answers"
    };
  },

  numberOfQuestionAnswerOptions: function() {
    let options = []
    for ( let i = 1; i <= 5; i++ ) {
      options.push(i);
    }
    return options;
  },

  step: function() {
    return Template.instance().step.get();
  },

  step1: function(){
    if ( Template.instance().step.get() === 1 ) {
      return true;
    }
    return false;
  },

  step2: function(){
    if ( Template.instance().step.get() === 2 ) {
      return true;
    }
    return false;
  },

  step3: function(){
    if ( Template.instance().step.get() === 3 ) {
      return true;
    }
    return false;
  },

  questions: function() {
    let ques = Template.instance().numberOfQuestions.get();
    let answ = Template.instance().numberOfAnswers.get();
    if ( ques > 0 ) {
      questions = [];
      for ( let i = 0; i < ques; i++ ) {
        answers = [];
        questions.push({name: `question${i+1}`, label: "Question", number: i+1, answers: []});
        for( let j = 0; j < answ; j++ ) {
          questions[i].answers.push({ name: `question${i+1}answer${j+1}`, label: "Answer", number: j+1});
        }
      }
      return questions;
    }
  },

  createdQuestionAndAnswer: function() {
    if ( Template.instance().createdQuestionsAndAnswers ) {
      return Template.instance().createdQuestionsAndAnswers.get();
    }
  }

});

Template.createSurvey.events({
  "change [data-action=select-number-of-questions]": function(e, template){
    let number = $(e.target).val();
    template.numberOfQuestions.set(number);
  },
  "change [data-action=select-number-of-answers]": function(e, template){
    let number = $(e.target).val();
    template.numberOfAnswers.set(number);
  },
  'click [data-action=continue]': function(e, template) {
    e.preventDefault()
    let ques = template.numberOfQuestions.get();
    let ans = template.numberOfAnswers.get();
    if ( ques === 0 ) {
      Toast.error("There must be at least 1 question per survey", "Please Set Number of Questions", {displayDuration: 3000});
      return false;
    }
    if ( ans === 0 ) {
      Toast.error("There must be at least 1 answer per question", "Please Set Number of Answers", {displayDuration: 3000});
      return false;
    }

    let step = template.step.get()

    if ( step === 1 ) {
      template.surveyName = $('input[name=surveyName]').val();
    }

    if ( step === 2 ) {
    let QandA = captureQuestions(template, ques, ans);
      template.createdQuestionsAndAnswers.set(QandA);
    }
    template.step.set(step+1);
  },

  'click [data-action=create-survey]': function(e, template) {
    e.preventDefault();
    let QandA = template.createdQuestionsAndAnswers.get();

    let survey = {
      name: template.surveyName,
      createdAt: new Date().toDateString(),
      owner: Meteor.userId ? Meteor.userId : "anonymous",
      published: false,
      displayData: QandA
    }
    console.log(survey);
    Meteor.call('createSurvey', survey, function(error, response) {
      if (error) {
        Toast.error(error.reason, "Error", {displayDuration: 3000});
      }
      if (response) {
        Toast.success("Succesfully created survey", response, {displayDuration: 3000});
      }
    });
  }
});
