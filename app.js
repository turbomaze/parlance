/******************\
|  General Parser  |
| @author Anthony  |
| @version 1.1     |
| @date 2016/06/17 |
| @edit 2016/06/17 |
\******************/

var parser = require('./parser.js');
var expressionGrammar = require('./grammars/expression-grammar.js');
var expressionStructure = require('./structures/expression-structure.js');
var jsonGrammar = require('./grammars/json-grammar.js');
var jsonStructure = require('./structures/json-structure.js');

// helper functions
function evaluate(tree) { // evaluates parse trees
  if (typeof tree !== 'object') {
    return tree;
  } else {
    switch (tree[0]) {
      case '+':
        return evaluate(tree[1]) + evaluate(tree[2]);
      case '*':
        return evaluate(tree[1]) * evaluate(tree[2]);
      default:
        throw new Exception('unknown operator');
    }
  }
}

function getResults(grammar, structure, goal, str) {
  // parse the token list
  var tokens = str.split('');
  var tree = parser.parse(grammar, structure, goal, tokens);
  
  // log stuff
  console.log('--- --- --- --- --- --- ---');
  console.log('PARSING:', '"' + str + '"'); 
  console.log(' TOKENS:', JSON.stringify(tokens));
  console.log('   TREE:', tree);
  return tree;
}

function getExpressionResults(str) {
  var tree = getResults(
    expressionGrammar, expressionStructure, 'expression', str
  );
  console.log(' RESULT:', evaluate(tree), '\n');
  return tree;
}

function getJSONResults(str) {
  var tree = getResults(
    jsonGrammar, jsonStructure, 'value', str
  );
  return tree;
}

// actual work
// getExpressionResults('10+5*(2+(4+1)*2)');
var str = JSON.stringify({"a":true,"foo":{"bar":[3,1,5]}});
getJSONResults(str);
console.log('        ',JSON.parse(str));
