// This file contains the "semantic", structural information behind this grammar.
// @author Anthony Liu
// @date 2016-06-17

module.exports = {
  'expression': function(term, plusExpressions) {
    var struct = term;
    plusExpressions.forEach(function(plusExpression) {
      var unit = [];
      unit.push(plusExpression[0]);
      unit.push(struct);
      unit.push(plusExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'term': function(group, timesExpressions) {
    var struct = group;
    timesExpressions.forEach(function(timesExpression) {
      var unit = [];
      unit.push(timesExpression[0]);
      unit.push(struct);
      unit.push(timesExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'group': [
    function(number) {
      return number;
    },
    function(left, expression, right) {
      return expression;
    }
  ],

  'left': function(left) {return left;},
  'right': function(right) {return right;},
  'plus': function(plus) {return plus;},
  'times': function(times) {return times;},
  'number': function(number) {return parseInt(number);}
};
