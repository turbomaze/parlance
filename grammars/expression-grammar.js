// this file contains the EBNF for the grammar
// @author Anthony Liu
// @date 2016-06-17

module.exports = {
  'expression': {
    'and': [
      'term',
      {
        'repeat': [
          0, 10, {'and': ['plus', 'term']}
        ]
      }
    ]
  },

  'term': {
    'and': [
      'group',
      {
        'repeat': [
          0, 5, {'and': ['times', 'group']}
        ]
      }
    ]
  },

  'group': {
    'or': [
      'number',
      {'and': ['left', 'expression', 'right']}
    ]
  },

  'left': function(tokens, ret) {
    var isLeft = tokens.length >= 1 && tokens[0] === '(';
    if (isLeft) {
      ret.newTokens = tokens.slice(1);
      ret.structure = [tokens[0]];
    }
    return isLeft;
  },

  'plus': function(tokens, ret) {
    var isPlus = tokens.length >= 1 && tokens[0] === '+';
    if (isPlus) {
      ret.newTokens = tokens.slice(1);
      ret.structure = [tokens[0]];
    }
    return isPlus;
  },

  'times': function(tokens, ret) {
    var isTimes = tokens.length >= 1 && tokens[0] === '*';
    if (isTimes) {
      ret.newTokens = tokens.slice(1);
      ret.structure = [tokens[0]];
    }
    return isTimes;
  },

  'right': function(tokens, ret) {
    var isRight = tokens.length >= 1 && tokens[0] === ')';
    if (isRight) {
      ret.newTokens = tokens.slice(1);
      ret.structure = [tokens[0]];
    }
    return isRight;
  },

  'number': function(tokens, ret) {
    var isNumber = tokens.length >= 1 && !isNaN(tokens[0]);
    if (isNumber) {
      ret.newTokens = tokens.slice(1);
      ret.structure = [tokens[0]];
    }
    return isNumber;
  }
};
