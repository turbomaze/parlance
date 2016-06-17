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
    ret.newTokens = tokens.slice(1);
    ret.structure = [tokens[0]];
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

# Strings
  * refers to another EBNF rule in the grammar
  * allows for more control over the syntax tree generation step
```javascript
...

'weirdNumber': 'number',

...
```

## License
MIT License: http://igliu.mit-license.org/
