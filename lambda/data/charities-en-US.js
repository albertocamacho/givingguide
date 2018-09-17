const SKILL_NAME = 'Giving Guide';
const INTRO_MESSAGE = 'Welcome to Giving Guide, what cause would you like to help today?';
const GET_CHARITY_MESSAGE = 'Here are some organizations that you might be interested in';
const HELP_MESSAGE = 'You can say how can I help followed by a cause like animal welfare or you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const ERROR_CANTFIND = 'Sorry, I can\'t seem to find anything for that';
const FALLBACK_MESSAGE = 'The Giving Guide skill can\'t help you with that.  It can help you discover charitable organizations if you say tell me how to help followed by a cause like humanitarian services. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';



let charityData = [
  {
    title: "Saint Jude's Children Hospital",
    causes: [
      'treatment',
      'children',
      'prevention services',
      'Syria',
      'Syrian children',
    
    ],
    mission : [
      'is a leading children\'s hospital pioneering research and treatments for kids with cancer and other life-threatening diseases.'
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
    site:[
      'stjude.org',
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
    site:[
      'doctorswithoutborders.com'
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
    
    ],
    alexaDonate:[
      true,
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
    
    ],
    alexaDonate:[
      false,
    ]
  }
]