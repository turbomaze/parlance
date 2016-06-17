/******************\
|  General Parser  |
| @author Anthony  |
| @version 0.1     |
| @date 2016/06/17 |
| @edit 2016/06/17 |
\******************/

var parser = require('./parser.js');
var expressionGrammar = require('./grammars/expression-grammar.js');
var expressionStructure = require('./structures/expression-structure.js');

// evaluates parse trees
function evaluate(tree) {
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

function getResults(str) {
  // parse the token list
  var tokens = str.split('');
  var tree = parser.parse(expressionGrammar, expressionStructure, 'expression', tokens);
  
  // log stuff
  console.log('--- --- --- --- --- --- ---');
  console.log('PARSING:', '"' + str + '"'); 
  console.log(' TOKENS:', tokens);
  console.log('   TREE:', tree);
  console.log(' RESULT:', evaluate(tree), '\n');
}

getResults('4*3+1');
getResults('4*(3+1)');
getResults('1+5*(2+(4+1)*2)');
