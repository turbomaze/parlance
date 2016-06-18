JavaScript General Parser
===

This node.js project lets you 1) specify EBNF-style grammars in JSON, 2) parse tokens according to that grammar, and 3) recover the underlying syntax tree of those tokens.

It doesn't make any assumptions about what your tokens look like (they can be strings or arrays or trees or custom objects), and it makes it easy for you to specify what your resulting syntax trees will look like.

## Grammar format
Grammars are JSON objects, whose properties are EBNF rule names and whose values are EBNF rule expansions. Rule expansions take three forms:

### Functions
  * a user defined function that accepts tokens and returns true if those tokens satisfy the rule
  * consumes one or more of the tokens, and specifies to the return object which tokens were consumed

Example function in a rule in which tokens are represented as lists of strings:
```javascript
...

'plus': function(tokens, ret) {
  var isPlus = tokens.length >= 1 && tokens[0] === '+';
  if (isPlus) {
    ret.newTokens = tokens.slice(1); // the remaining tokens to process
    ret.structure = [tokens[0]]; // the tokens that were just processed
  }
  return isPlus;
},

...
```
The `ret` parameter is used to send more information back to the caller, such as the consumed tokens (in `ret.structure`).

### Objects (built-in functions)
  * refers to EBNF concepts like "and", "or", and "repeat"
  * rule returns true if the tokens satisfy the rule

`and` and `or` use the following syntax: the object rule expansion has a single property, either `and` or `or`, and that property's value is an array of rules. The syntax allows for anonymous rules (nested objects). `repeat` is slightly different; instead of a list of rules, it's a list of 3 elements, the first of which is the minimum number of times the pattern can be repeated to satisfy the rule, the second is the maximum, and the third is the pattern to repeat.
```javascript
...

'number': {
  'repeat': [1, 10, 'digit']
},

'enclosedNumber': {
  'and': ['leftParen', 'number', 'rightParen']
},

'twoNormalsOrEnclosed': {
  'or': [
    {
      'and': ['number', 'number'],
    },
    'enclosedNumber'
  ]
},

...
```

### Strings
  * refers to another EBNF rule in the grammar
  * allows for more control over the syntax tree generation step
```javascript
...

'weirdNumber': 'number',

...
```

## Structure format
The structural component of this project allows you to specify how rules relate to components in the final syntax tree. There's a one-to-one relationship between the properties in the grammar specification and the properties in the structural specification. Whereas in the grammar those properties can have function, object, or string values, in the structural spec, they are either functions or arrays of functions. 

See the `structures/expression-structure.js` file for examples. There are four cases:

1) If the corresponding grammar property is a function, that is, it's handled by you, the user, then the arguments are the tokens your function consumes in its processing. In the expressions example for single characters, the arguments are those single characters. 

2) If the corresponding property is instead a built-in `repeat` or `and`, then one argument is supplied for each component of that `repeat` or `and`. The arguments are themselves processed, structural components.

3) If the corresponding property is an `or`, then the value of that structural property must be an array of functions, which correspond to the components of the `or`, one-to-one, in order.

4) If the corresponding property is a string, that is, it simply refers to another rule, then the argument supplied to the corresponding structural function is that other rule's structural representation.

## Usage
Having defined two JSON objects, one for the grammar and one for the structure, you would use this project as follows:

```javascript
var parser = require('parser');
var grammar = ... // your grammar JSON object
var structure = ... // your structure JSON object
var goal = ... // the 'outermost' rule; the rule you're parsing for
var tokens = ... // your tokens; can take any form, e.g. a list of strings

// false if tokens are nonconformant; otherwise, the resulting 'structure'
var syntaxTree = parser.parse(grammar, structure, goal, tokens);
```

## License
MIT License: http://igliu.mit-license.org/
