// this file contains the EBNF for the json grammar
// @author Anthony Liu
// @date 2016-06-17

function getCharFunc(c) {
  return function(tokens, ret) {
    var isChar = tokens.length >= 1 && tokens[0] === c;
    if (isChar) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isChar;
  };
}

module.exports = {
  'value': {
    'or': [
      'object', 'array', 'number'
    ]
  }, 


  'array': {
    'and': [
      'leftBracket',
      {
        'repeat': [
          0, 1, {
            'and': [
              'value',
              {
                'repeat': [
                  0, 10,
                  {
                    'and': ['comma', 'value']
                  }
                ]
              }
            ]
          }
        ]
      },
      'rightBracket'
    ]
  },

  'object': {
    'and': [
      'leftBrace',
      {
        'repeat': [
          0, 1, {
            'and': [
              'keyValuePair',
              {
                'repeat': [
                  0, 10,
                  {
                    'and': ['comma', 'keyValuePair']
                  }
                ]
              }
            ]
          }
        ]
      },
      'rightBrace'
    ]
  },

  'keyValuePair': {
    'and': [
      'property', 'colon', 'value'
    ]
  },

  'property': {
    'and': [
      'double',
      'letter',
      {
        'repeat': [
          0, 10, {'or': ['letter', 'digit']}
        ]
      },
      'double'
    ]
  },

  'number': {
    'repeat': [1, 10, 'digit']
  },

  'digit': function(tokens, ret) {
    var isNumber = tokens.length >= 1 && !isNaN(tokens[0]);
    if (isNumber) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isNumber;
  },
  'letter': function(tokens, ret) {
    var isNumber = tokens.length >= 1 && tokens[0].match(/^[a-z]$/i);
    if (isNumber) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isNumber;
  },
  'leftBracket': getCharFunc('['),
  'rightBracket': getCharFunc(']'),
  'leftBrace': getCharFunc('{'),
  'rightBrace': getCharFunc('}'),
  'colon': getCharFunc(':'),
  'double': getCharFunc('"'),
  'comma': getCharFunc(',')
};
