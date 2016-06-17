var expressionGrammar = {
  'expression': {
    'and': [
      'group',
      {
        'repeat': [
          0, 10,
          {
            'and': [
              'plus', 'expression'
            ]
          }
        ]
      }
    ]
  },

  'group': {
    'or': [
      'number',
      {
        'and': ['left', 'expression', 'right']
      }
    ]
  },

  'left': function(tokens, newTokens) {
    var isLeft = tokens.length >= 1 && tokens[0] === '(';
    if (isLeft) Parser.copyArray(newTokens, tokens.slice(1));
    return isLeft;
  },

  'plus': function(tokens, newTokens) {
    var isPlus = tokens.length >= 1 && tokens[0] === '+';
    if (isPlus) Parser.copyArray(newTokens, tokens.slice(1));
    return isPlus;
  },

  'right': function(tokens, newTokens) {
    var isRight = tokens.length >= 1 && tokens[0] === ')';
    if (isRight) Parser.copyArray(newTokens, tokens.slice(1));
    return isRight;
  },

  'number': function(tokens, newTokens) {
    var isNumber = tokens.length >= 1 && typeof tokens[0] === 'number';
    if (isNumber) Parser.copyArray(newTokens, tokens.slice(1));
    return isNumber;
  }
};

var Parser = (function() {
  var DEBUG = true;

  function copyArray(a, b) {
    Array.prototype.splice.apply(a, [0, a.length].concat(b));
  }

  function applyBuiltIn(rules, type, components, tokens, newTokens) {
    copyArray(newTokens, tokens);
    var tempTokens = tokens.slice(0);
    switch (type) {
      case 'or':
        for (var i = 0; i < components.length; i++) {
          var component = components[i];
          if (ruleApplies(rules, component, tokens, newTokens)) {
            return true;
          }
        }
        return false;
      case 'and':
        var doubleTempTokens = [];
        for (var i = 0; i < components.length; i++) {
          var component = components[i];
          if (ruleApplies(rules, component, tempTokens, doubleTempTokens)) {
            copyArray(tempTokens, doubleTempTokens);
          } else {
            return false;
          }
        }
        copyArray(newTokens, tempTokens);
        return true;
      case 'repeat':
        if (components.length !== 3) return false;
        
        var min = components[0], max = components[1], rule = components[2];
        var doubleTempTokens = [];
        for (var counter = 0; counter < max; counter++) {
          if (ruleApplies(rules, rule, tempTokens, doubleTempTokens)) {
            copyArray(tempTokens, doubleTempTokens);
          } else {
            break;
          }
        }

        if (counter >= min) {
          copyArray(newTokens, tempTokens);
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  function ruleApplies(rules, rule, tokens, newTokens) {
    if (DEBUG) console.log('RULE', rule, tokens);

    var struct = typeof rule === 'string' ? rules[rule] : rule;

    var applies = false;
    switch (typeof struct) {
      case 'function':
        applies = struct(tokens, newTokens);
        break;
      case 'object':
        var builtIn = Object.keys(struct);
        if (builtIn.length > 0) {
          var type = builtIn[0];
          applies = applyBuiltIn(rules, type, struct[type], tokens, newTokens);
        } else {
          applies = false;
        }
        break;
      case 'string':
        applies = ruleApplies(rules, struct, tokens, newTokens);
        break;
    }

    return applies;
  }

  function parse(rules, goal, tokens) {
    var newTokens = [];
    var isRule = ruleApplies(rules, goal, tokens, newTokens);
    return isRule && newTokens.length === 0;
  }

  return {
    parse: parse,
    copyArray: copyArray
  };
})();

// parse the token list
var tokens = ['(', 9, '+', 4, ')'];
var out = Parser.parse(expressionGrammar, 'expression', tokens);
console.log('\n--- --- PARSING EXPRESSION --- ---\n');
console.log('TOKENS');
console.log(tokens);
console.log('RESULT');
console.log(out);
