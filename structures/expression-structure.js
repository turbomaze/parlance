// this file contains the structural information behind the expression grammar
// @author Anthony Liu
// @date 2016-06-17

function identity(a) {
  return a;
}

module.exports = {
  'expression': function(args) {
    var struct = args[0];
    var plusExpressions = args[1];
    plusExpressions.forEach(function(plusExpression) {
      var unit = [];
      unit.push(plusExpression[0]);
      unit.push(struct);
      unit.push(plusExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'term': function(args) {
    var struct = args[0];
    var timesExpressions = args[1];
    timesExpressions.forEach(function(timesExpression) {
      var unit = [];
      unit.push(timesExpression[0]);
      unit.push(struct);
      unit.push(timesExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'plusTerm': identity,

  'group': [
    identity,

    function(args) {
      return args[1];
    }
  ],

  'timesGroup': identity,

  'number': function(digits) {
    var sum = 0;
    for (var i = 0; i < digits.length; i++) {
      var place = digits.length - i - 1;
      sum += digits[i] * Math.pow(10, place);
    }
    return sum;
  },

  'plus': identity,
  'times': identity,
  'left': identity,
  'right': identity,
  'digit': function(number) {return parseInt(number);}
};
