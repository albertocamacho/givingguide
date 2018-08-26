/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./alexa-cookbook.js');
const request = require('request');
const Fuse = require('fuse.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'Giving Guide';
const INTRO_MESSAGE = 'Welcome to Giving Guide, what cause would you like to help today?';
const GET_FACT_MESSAGE = 'Here are some organizations that you might be interested in';
const HELP_MESSAGE = 'You can say how can I help followed by a cause like animal welfare or you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const ERROR_CANTFIND = 'Sorry, I can\'t seem to find anything for that';
const FALLBACK_MESSAGE = 'The Giving Guide skill can\'t help you with that.  It can help you discover charitable organizations if you say tell me how to help followed by a cause like refugees. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


let charityData = [
  {
    title: "Saint Jude's",
    causes: [
      'treatment',
      'children',
      'prevention services',
      'Syria',
      'Syrian children',
    
    ],
    rating: [
      '89.83',
    
    ],
    category: [
      'Health',
    
    ]
  },
  {
    title: "Doctor's Without Borders",
    causes: [
      'relief',
      'relief services',
      'doctors',
      'humanitarians',
      'humanitarian services',
    
    ],
    rating: [
      '97.23',
    
    ],
    category: [
      'International',
    
    ]
  },
  {
    title: "American Red Cross",
    causes: [
      'relief',
      'relief services',
      'disaster response',
      'human services',
      'humanitarian services',
      'blood donation',
      'natural disasters',
    
    ],
    rating: [
      '84.09',
    
    ],
    category: [
      'Human Services',
    
    ]
  },
  {
    title: "World Wildlife Fund",
    causes: [
      'conservation',
      'animals',
      'wildlife',
      'pandas',
      'endangered species',
      'polar bears',
   
    ],
    rating: [
      '82.32',
    
    ],
    category: [
      'Animals',
    
    ]
  },
  {
    title: "UNICEF USA",
    causes: [
      'peace',
      'world peace',
      'children',
      'poverty',
      'clean water',
      'relief',
      'humanitarians',
      'humanitarian services'
    ],
    rating: [
      '82.19',
    
    ],
    category: [
      'International',
    
    ]
  }
]


const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "title",
    "causes"
  ]
};

const fuse = new Fuse(charityData, options);



const LaunchIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'LaunchIntent');
  },
  handle(handlerInput) {

    const speechOutput = INTRO_MESSAGE;
    const reprompt = 'Say a cause, like helping children to start';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, 'this is a placeholder for now')
      .reprompt(reprompt)
      .getResponse();
  },
}


/*
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = cookbook.getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};
*/

const CharityHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' 
      && request.intent.name === 'CharityIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let keyword = request.intent.slots.cause.value;

    let results = fuse.search(keyword);
    console.log(results[0]);
    console.log('keyword : ' + keyword);

    let charity = results[0];
    let charityRating = '';
    let charityName = '';
    let speechOutput = '';

    if(!charity){
      //no charity, need to handle this better
      //maybe need to confirm slot
      speechOutput = ERROR_CANTFIND;
    
    }
    else{
      charityName = charity.title;
      charityRating = charity.rating; 
      speechOutput = 'You could donate to ' + charityName + ' it has a rating of ' + charityRating; 
    }
  
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, charityName)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};


/*

function searchOH(keywords){

  let searchURL = 'https://data.orghunter.com/v1/charitysearch?user_key=5e286ac18a12cf8243ae144485afc9ac';
  let append = '&searchTerm=';

  for(var i = 0; i < keywords.length;i++){  
    append += keywords[i]
    
    if(i !== (keywords.length - 1)){
      append += '%20';
    }
  }
  
  searchURL += append;
  post(searchURL, parseOH);
}


function parseOH(body){
  //let charities = [];

  for(var i = 0; i < body['data'].length; i++){
    let charity = body['data'][i].charityName;
    console.log(charity);
  }  
}



function post(url, callback){
  request({
      url: url,
      method: "POST",
      json: true
  }, function (error, response){
      if(error){
        return error;
      }
      else{
        callback(response.body);
      }
  });
}

*/





const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchIntent,
    CharityHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
