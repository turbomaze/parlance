// this file contains the structural information behind the json grammar
// @author Anthony Liu
// @date 2016-06-17

module.exports = {
  'value': [
    function(obj) {return obj;},
    function(arr) {return arr;},
    function(num) {return num;},
    function(bool) {return bool;}
  ],

  'boolean': [
    function(args) {return args;},
    function(args) {return args;}
  ],

  'array': function(args) {
    var optionalValues = args[1];
    var arr = [];
    if (optionalValues.length > 0) {
      optionalValues = optionalValues[0];
      var firstValue = optionalValues[0];
      arr.push(firstValue);
      optionalValues[1].forEach(function(commaValue) {
        var value = commaValue[1];
        arr.push(value);
      });
    }
    return arr;
  },

  'object': function(args) {
    var optionalKeyValuePairs = args[1];
    var obj = {};
    if (optionalKeyValuePairs.length > 0) {
      optionalKeyValuePairs = optionalKeyValuePairs[0];
      var firstKeyValue = optionalKeyValuePairs[0];
      obj[firstKeyValue[0]] = firstKeyValue[1];
      optionalKeyValuePairs[1].forEach(function(commaKeyValue) {
        var keyValue = commaKeyValue[1];
        obj[keyValue[0]] = keyValue[1];
      });
    }
    return obj;
  },

  'keyValuePair': function(args) {
    return [args[0], args[2]];
  },

  'property': function(args) {
    return args[1] + args[2].join('');
  },

  'number': function(digits) {
    var sum = 0;
    for (var i = 0; i < digits.length; i++) {
      var place = digits.length - i - 1;
      sum += digits[i] * Math.pow(10, place);
    }
    return sum;
  },

  'true': function(bool) {return true;},
  'false': function(bool) {return false;},
  'digit': function(number) {return parseInt(number);},
  'letter': function(letter) {return letter;},
  'leftBracket': function(left) {return left;},
  'rightBracket': function(right) {return right;},
  'leftBrace': function(left) {return left;},
  'rightBrace': function(right) {return right;},
  'colon': function(colon) {return colon;},
  'double': function(quote) {return quote;},
  'comma': function(comma) {return comma;}
};
