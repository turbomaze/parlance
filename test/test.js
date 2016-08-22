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

      it('should correctly locate simple syntax errors', function() {
        var input = '42++18'.split('');
        var expected = ['+', '1', '8'];
        try {
          ExpressionParser.parse('expression', input);
          assert.deepEqual('no error', 'syntax error');
        } catch (e) {
          assert.deepEqual(e.data.tokens, expected);
        }
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

      it('should properly parse empty objects', function() {
        testJson('{}');
      });

      it('should properly parse numeric arrays', function() {
        testJson('[1,2,3]');
      });

      it('should properly parse mixed arrays', function() {
        testJson('[1,true,false,3]');
      });

      it('should properly parse simple objects', function() {
        testJson('{"foo":10,"bar":33}');
      });

      it('should properly parse nested arrays', function() {
        testJson('[[1,[2,[3]]]]');
      });

      it('should properly parse nested objects', function() {
        testJson('{"foo":{"bar":1,"cork":[2,3]},"quux":4}');
      });

      it('should correct locate complex syntax errors', function() {
        var input = '{"a":{"b":1,"c":[2,3]},"d"::4}'.split('');
        var expected = [':', '4', '}'];
        try {
          JsonParser.parse('value', input);
          assert.deepEqual('no error', 'syntax error');
        } catch (e) {
          assert.deepEqual(e.data.tokens, expected);
        }
      });
    });
  });
});
