JavaScript General Parser
===

This node.js project lets you 1) specify EBNF-style grammars in JSON, 2) parse tokens according to that grammar, and 3) recover the underlying syntax tree of those tokens.

It doesn't make any assumptions about what your tokens look like (they can be strings or arrays or trees or custom objects), and it makes it easy for you to specify what your resulting syntax trees will look like.

## Grammar format
Grammars are JSON objects, whose properties are EBNF rule names and whose values are EBNF rule expansions. Rule expansions take three forms:

1. a function
  * a user defined function that accepts tokens and returns true if those tokens satisfy the rule
  * consumes one or more of the tokens, and specifies to the return object which tokens were consumed

Example function in a rule in which tokens are represented as lists of strings:
```
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

## License
MIT License: http://igliu.mit-license.org/
