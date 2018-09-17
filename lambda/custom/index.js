/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./alexa-cookbook.js');
const request = require('request');
const rp = require('request-promise-native');
const Fuse = require('fuse.js');
const https = require('https');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'Giving Guide';
const INTRO_MESSAGE = 'Welcome to Giving Guide, what cause would you like to help today?';
const GET_CHARITY_MESSAGE = 'Get charity message.';
const ALEXA_DONATE_MESSAGE = 'You can donate online or through Alexa, just say Alexa, make a donation to ';
const DEFAULT_DONATE_MESSAGE = 'Check the Alexa app for information on how to donate';
const HELP_MESSAGE = 'You can say how can I help followed by a cause like animal welfare or you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const ERROR_CANTFIND = 'Sorry, I can\'t seem to find anything for that';
const FALLBACK_MESSAGE = 'The giving guide skill can\'t help you with that.  It can help you discover charitable organizations if you say tell me how to help followed by a cause like humanitarian services. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


let charityData = [
  {
    name: "Saint Jude's Children Research Hospital",
    causes: [
      'treatment',
      'children',
      'prevention services',
      'Syria',
      'Syrian children',
    
    ],
    mission : [
      'is pioneering research and treatments for kids with cancer and other life-threatening diseases.'
    ],
    rating: [
      '89.83',
    
    ],
    category: [
      'Health',
    ],
    alexaDonate:[
      true,
    ],
    ein:[
      '351044585',
    ],
    site:[
      'stjude.org',
    ]
  },
  {
  name: "Doctor's Without Borders",
    causes: [
      'relief',
      'relief services',
      'doctors',
      'humanitarians',
      'humanitarian services',
    
    ],
    mission : [
      'provides lifesaving medical humanitarian care across the world.'
    ],
    rating: [
      '97.23',
    
    ],
    category: [
      'International',
    
    ],
    alexaDonate:[
      false,
    ],
    ein: [
    '133433452',
    ],
    site:[
      'doctorswithoutborders.org'
    ]
  },
  {
  name: "American Red Cross",
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
    
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '530196605',
    ]
  },
  {
    name: "World Wildlife Fund",
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
    name: "Zero to Three: National Center for Infants, Toddlers, and Families",
    causes: [
      'infant',
      'mental health',
      'infants', 
      'toddlers',
      'babies',
      'early childhood',
      'parenting',
      'childcare', 
      'early intervention',
      'child welfare', 
      'baby',
      'infant',
      'toddler',
      'parent'
    ],
    mission : [
      'ensures that all babies and toddlers have a strong start in life'
    ],
    rating: [
      '00.00',
    
    ],
    category: [
      'International',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '521105189'
    ],
    site: [
      'www.zerotothree.org'
    ]
  },
    {
    name: "Wreaths Across America",
    causes: [
      "Veterans", "Soldiers", "Military", "Donation", "Non-profit", "America", "Wreaths"
    ],
    mission : [
      'works withcommunity outreach, gatherings and wreath ceremonies in order to remember the sacrifices of veterans and their families.'
    ],
    rating: [
      '00.00',
    
    ],
    category: [
      'Military/Veterans Organizations',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '208362270',
    ],
    site: [
      'http://wreathsacrossamerica.org'
    ]
  },
  {
    name: "Wounded Warrior Project",
    causes: [
      "Wounded Warrior Project", "WWP", "Wounded Warrior", "veterans", "veteran", "disabled", "injured", "military"
    ],
    mission : [
      'is fostering the most successful, well-adjusted generation of wounded service members in our nations history.'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Military/Veterans Organizations',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '202370934',
    ],
    site: [
      'www.woundedwarriorproject.org'
    ]
  },
    {
    name: "Worldreader",
    causes: [
      "e-books", "ebooks", "mobile", "reading", "literacy", "mobile","learning","education","technology", "Africa", "India"
    ],
    mission : [
      'is a global non-profit that champions digital reading in underserved communities.'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Nonmonetary Support',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '272092468',
    ],
    site: [
      'www.worldreader.org'
    ]
  },
  {
    name: "World Wildlife Fund",
    causes: [
      "Endangered Species", "Wildlife", "Conservation", "Animal", "Global Warming", "Environment", "Ocean", "Forest"
    ],
    mission : [
      'is a leading conservation organization, working in 100 countries to protect the future of nature'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Natural Resource Conservation and Protection ',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '521693387',
    ],
    site: [
      'www.worldwildlife.org'
    ]
  },
    {
    name: "World Animal Protection",
    causes: [
      "World Animal Protection", "animal welfare", "animal protection", "animals in entertainment", "animals in the wild", "disaster relief", "farm animal welfare", "animals in communities", "dog vaccinations"
    ],
    mission : [
      'works over 50 countries, collaborating with local communities, NGOs and governments to responsibly and sustainably change animals lives for the better'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Animal Protection and Welfare (includes Humane Societies and SPCAs',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '042718182',
    ],
    site: [
      'www.worldanimalprotection.us'
    ]
  },
  {
    name: "Wikimedia Foundation",
    causes: [
      "Wikimedia", "Wikipedia", "free culture", "encyclopedia", "Open Source", "online", "educational content" 
    ],
    mission : [
      'empowers people around the world to collect and develop knowledge under a free license, and to disseminate that knowledge effectively and globally'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Libraries', 'Library Science',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '200049703',
    ],
    site: [
      'www.wikimediafoundation.org'
    ]
  },
  {
    name: "West Side Catholic Center",
    causes: [
      "Wikimedia", "Wikipedia", "free culture", "encyclopedia", "Open Source", "online", "educational content" 
    ],
    mission : [
      'assists all who come in need of food, clothing, shelter, advocacy and a path to self-sufficiency.'
    ],
    rating: [
      '00.00',
    ],
    category: [
      'Temporary Shelter For the Homeless',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '341244687',
    ],
    site: [
      'www.wsccenter.org'
    ]
  },
  {
    name: "West Seattle Baseball League"
  },
  {
    name: "Washington Youth Soccer Foundation",
    causes: [
      "youth development", "soccer", "youth sports", "mentor", "health", "underserved"],
    mission : [
      'is increasing opportunities and access to youth soccer in Washington, with a primary focus on underserved youth and communities.'],
    rating: [
      '00.00',
    ],
    category: [
      'Youth Athletics',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '812750141',
    ],
    site: [
      'www.wayouthsoccerfoundation.org'
    ]
  },
  {
    name: "WHAS Crusade For Children",
    causes: [
      "children", "Special needs", "handicap", "disability", "Kentucky", "Indiana"
    ],
    mission : [
      'makes life better for children with special needs by inspiring generosity for our community partners'
    ] 
    rating: [
      '00.00',
    ],
    category: [
      'Childrens and Youth Services',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '237075524',
    ],
    site: [
      'www.whascrusade.org'
    ]
  },
  {
    name: "The Vitalogy Foundation",
    causes: [
      "community", "science", "arts", "education", "social change", "pearl jam"
    ],
    mission : [
      'supports the efforts of non-profit organizations doing commendable work in the fields of community health, the environment, arts & education and social change. Founded by the members of Pearl Jam'    
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'Childrens and Youth Services',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '201030462',
    ],
    site: [
      'www.pearljam.com/acts/vitalogy'
    ]
  },
  {
    name: "Village Drive Village",
  },
  {
    name: "UNICEF USA",
    causes: [
      "UNICEF", "U.S. Fund for UNICEF", "UNICEF USA", "UNICEF America", "education", "children", "nutrition", "emergency", "child survival",
    ],
    mission : [
      'provides children with health care and immunizations, clean water and sanitation, nutrition, education, emergency relief and more'
    ], 
    rating: [
      '82.19',
    ],
    category: [
      'International Relief',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '131760110',
    ],
    site: [
      'www.unicefusa.org/'
    ]
  },  
  {
    name: "Tor Project",
    causes: [
      "privacy", "anonymity", "human rights", "journalism", "internet", "open source", "free speech", "research and development", "law enforcement", "citizen rights"],
    mission : [
      'develops, improves and distributes free, publicly available tools and programs that promote free speech, free expression, civic engagement and privacy rights online.'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'Research Institutes and Public Policy Analysis',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '208096820',
    ],
    site: [
      'www.torproject.org/'
    ]
  },
    {
    name: "Thirst Relief International",
    causes: [
      "thirst", "water", "safe water", "clean water", "relief"
    ],
    mission : [
      'is overcoming death and disease resulting from consumption of contaminated water by providing safe clean drinking water to those in need around the world.'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'International Relief',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '203398554',
    ],
    site: [
      'www.thirstrelief.org'
    ]
  },
  {
    name: "Thirst Relief International",
    causes: [
      "thirst", "water", "safe water", "clean water", "relief"
    ],
    mission : [
      'is overcoming death and disease resulting from consumption of contaminated water by providing safe clean drinking water to those in need around the world.'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'International Relief',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '203398554',
    ],
    site: [
      'www.thirstrelief.org'
    ]
  },
  {
    name: "THE WATER PROJECT",
    causes: [
      "thirst", "water", "safe water", "clean water", "relief", "water charity", "africa"
    ],
    mission : [
      'iunlocking human potential by providing sustainable water and sanitation projects to needlessly suffering communities in sub-Saharan Africa'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'International Development','Relief Services',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '261455510',
    ],
    site: [
      'www./thewaterproject.org'
    ]
  },
  {
    name: "The University of Puget Sound"
  },
  {
    name: "The Livestrong Foundation",
    causes: [
      "cancer", "survivorship", "cancer survivor", "patient advocacy", "healthcare", "cancer community"
    ],
    mission : [
      'provides direct services to anyone affected by cancer, develop community programs for cancer survivors, and partner with institutions and policymakers to change the way the world fights cancer'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'Health Support Services','Cancer',
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '742806618',
    ],
    site: [
      'www.livestrong.org'
    ]
  },
  {
    name: "The Humane Society of the United States",
    causes: [
      "animal protection", "animal welfare", "pets", "animal cruelty", "factory farming", "wildlife and habitat protection", "animal research", "humane education", "marine mammals", "endangered species" ],
    mission : [
      'helps provide hands-on care and services to more than 100,000 animals each year, and we professionalize the field through education and training for local organizations'], 
    rating: [
      '00.00',
    ],
    category: [
      'Animal Protection and Welfare'
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '530225390',
    ],
    site: [
      'www.humanesociety.org'
    ]
  },
  {
    name: "Greater Boston Food Bank",
    causes: [
      "gbfb", "boston food bank", "boston", "food", "food bank", "hunger", "hungry", "food distribution", "Massachusetts" 
    ],
    mission : [
      'is working to end hunger in Eastern Massachusetts'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'Food Banks and Food Pantries'
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '042717782',
    ],
    site: [
      'www.gbfb.org'
    ]
  },
  {
    name: "The Empty Stocking Fund",
    causes: [
      "Needy Children", "Holidays", "Christmas toys"  
    ],
    mission : [
      'empowers parents and guardians of children living in poverty in the communities we serve by providing  them with an opportunity to give their children gifts at Christmas time'
    ], 
    rating: [
      '00.00',
    ],
    category: [
      'Food Banks and Food Pantries'
    ],
    alexaDonate:[
      true,
    ],
    ein: [
      '237159125',
    ],
    site: [
      'www.emptystockingfund.org'
    ]
  },

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


/*
function getCharityData(ein, callback){

  let URL = 'https://api.data.charitynavigator.org/v2/Organizations/' + ein + '?app_id=4eeba281&app_key=d10e23f42225ca8a264984323f7275b3'
   
  // return new pending promise
  return new Promise((callback, reject) => {
    // select http or https module, depending on reqested url
    let lib = URL.startsWith('https') ? require('https') : require('http');
   
    let request = lib.get(URL, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      let body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        callback(body.join(''));
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  })
  
}
*/







function getData(url, callback) {  

  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    callback(body);
  });


  /*
  return new Promise((resolve, reject) => {
    function callback(error, response, body) {
      resolve(body);
    }
    request(url, callback);
  });
  */
}


async function getCC(_url) {
  try {
    const fulfilledValue = await get(_url);
    return fulfilledValue;
  }
  catch (rejectedValue) {
    // …
  }
}




const LaunchIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'LaunchIntent');
  },
  handle(handlerInput) {

    const speechOutput = INTRO_MESSAGE;
    const reprompt = 'Say a cause, like disaster relief to get a donation recommendation';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
}


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
    let speechOutput = '';
    let cardOutput = '';
    
    console.log('keyword : ' + keyword);

    let charity = results[0];

    if(!charity){
      speechOutput = ERROR_CANTFIND;
      cardOutput = ERROR_CANTFIND;
    }

    else{

      let URI = 'https://api.data.charitynavigator.org/v2/Organizations/' + charity.ein + '?app_id=4eeba281&app_key=d10e23f42225ca8a264984323f7275b3';
    
      /*
      charityName = charity.title;
      charityRating = charity.rating; 
      charityAlexaDonate = charity.alexaDonate;
      charityMission = charity.mission;
      charitySite = charity.site;
      charityEIN = charity.ein;
      */

      speechOutput += charity.title + ' ';
      speechOutput += charity.mission + ' '


      if(charity.alexaDonate == 'true'){
       speechOutput += ALEXA_DONATE_MESSAGE + charity.title;
       cardOutput = 'To donate to ' + charity.title + ' visit ' + charity.site + ' ' + ALEXA_DONATE_MESSAGE + charity.title;
      }
      else{
       speechOutput += DEFAULT_DONATE_MESSAGE;
       cardOutput = 'To donate to ' + charity.title + ' visit ' + charity.site;
      }

      getData(URI, (response) => {
        let data = JSON.parse(response);
        speechOutput += data.ein;
      });

      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, cardOutput)
        .getResponse();
      }
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
