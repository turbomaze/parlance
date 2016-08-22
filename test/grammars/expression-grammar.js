// this file contains the EBNF for the expression grammar
// @author Anthony Liu
// @date 2016/06/17

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
  'expression': 'term, { plusTerm }',
  'term': 'group, { timesGroup }',
  'plusTerm': 'plus, term',
  'group': 'number | left, expression, right',
  'timesGroup': 'times, group',
  'number': 'digit+',
  'plus': getCharFunc('+'),
  'times': getCharFunc('*'),
  'left': getCharFunc('('),
  'right': getCharFunc(')'),
  'digit': function(tokens, ret) {
    var isNumber = tokens.length >= 1 && !isNaN(tokens[0]);
    if (isNumber) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isNumber;
  }
};
