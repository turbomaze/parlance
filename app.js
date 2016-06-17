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


// parse the token list
var expression = '(1+4)*3+(4+5)*2';
var tokens = expression.split('');
var out = parser.parse(expressionGrammar, expressionStructure, 'expression', tokens);

// log stuff
console.log('EXPRESSION');
console.log(expression);
console.log('\nTOKENS');
console.log(tokens);
console.log('\nPARSE TREE');
console.log(out);
console.log('\nRESULT');
console.log(evaluate(out));
