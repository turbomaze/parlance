// Parlance tests
// @author Anthony Liu
// @date 2016/08/21

var assert = require('assert');
var parlance = require('../src/parlance.js');
var ExpressionParser = parlance(
  require('./grammars/expression-grammar.js'),
  require('./structures/expression-structure.js')
);
var JsonParser = parlance(
  require('./grammars/json-grammar.js'),
  require('./structures/json-structure.js')
);

function testExpression(input, expected) {
  var actual = ExpressionParser.parse(
    'expression', input.split('')
  );
  assert.deepEqual(actual, expected);
}

function testJson(input) {
  var actual = JsonParser.parse(
    'value', input.split('')
  );
  var expected = JSON.parse(input);
  assert.deepEqual(actual, expected);
}

describe('Parlance', function() {
  describe('ExpressionParser', function() {
    describe('#parse()', function() {
      it('should properly parse numbers', function() {
        testExpression('42', 42);
      });
  
      it('should properly parse a single addition', function() {
        testExpression('42+18', ['+', 42, 18]);
      });
  
      it('should parse consecutive additions', function() {
        testExpression('42+18+10', ['+', ['+', 42, 18], 10]);
      });

      it('should group multiplications first', function() {
        testExpression('42+18*10', ['+', 42, ['*', 18, 10]]);
      });
    });
  });

  describe('JsonParser', function() {
    describe('#parse()', function() {
      it('should properly parse numbers', function() {
        testJson('42', 42);
      });

      it('should properly parse booleans', function() {
        testJson('true');
      });

      it('should properly parse empty arrays', function() {
        testJson('[]');
      });

      it('should properly parse numeric arrays', function() {
        testJson('[1,2,3]');
      });

      it('should properly parse mixed arrays', function() {
        testJson('[1,true,false,3]');
      });

      it('should properly parse nested arrays', function() {
        testJson('[[1,[2,[3]]]]');
      });
    });
  });
});
