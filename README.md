Parlance
===

Parlance lets you 1) specify EBNF-style grammars in text, 2) parse tokens according to that grammar, and 3) recover the underlying syntax tree of those tokens with minimal extra work.

It doesn't make any assumptions about what your tokens look like (they can be strings or arrays or trees or custom objects), and it makes it easy for you to specify what your resulting syntax trees will look like.

## Usage
Parlance requires that you define two JSON objects, one for the grammar you're trying to parse and another for the structure you're trying to create. For details on what Parlance requires, see the sections below.

```javascript
var parlance = require('parlance');
var grammar = ... // your grammar JSON object
var structure = ... // your structure JSON object
var parser = parlance(grammar, structure);

var goal = ... // the 'outermost' rule; the rule you're parsing for
var tokens = ... // your tokens; can take any form, e.g. a list of strings

// false if tokens are nonconformant; otherwise, the resulting 'structure'
var syntaxTree = parser.parse(goal, tokens);
```

For more details see the `test` directory of this repository for a couple examples.

## Grammar format
Grammars are JSON objects, whose properties are EBNF rule names and whose values are EBNF rule expansions. Rule expansions take three forms:

### Functions
  * a user defined function that accepts tokens and returns true if those tokens satisfy the rule
  * consumes one or more of the tokens, and specifies to the return object which tokens were consumed
  * these should be simple terminal rules, like rules for letters or numbers

Example function for a parsing problem in which the input tokens are lists of strings:
```javascript
...
'digit': function(tokens, ret) {
  var isNumber = tokens.length >= 1 && !isNaN(tokens[0]);
  if (isNumber) {
    // terminal function rules must update the token stream
    ret.newTokens = tokens.slice(1);
    // function rules must also pass the tokens they processed in ret.structure
    ret.structure = tokens[0];
  }
  // finally, they must return whether or not the rule was satisfied
  return isNumber;
},
...
```
The `ret` parameter is used to send more information back to the caller, such as the consumed tokens (in `ret.structure`).

### Strings (built-in EBNF rule-composition operators)
  * refers to EBNF concepts like "and", "or", and "repeat"
  * rule returns true if the tokens satisfy the rule

The following EBNF syntax is supported:
  * and: `ruleOne, ruleTwo, ruleThree`
  * or: `ruleOne | ruleTwo | ruleThree`
  * repeat zero or more times: `{ruleOne, ruleTwo}`
  * repeat one or more times: `rule+`
  * optional: `[ruleOne, ruleTwo]`

You can combine multiple rules into a single string as follows:

`ruleOne, ruleTwo | ruleThree, [ruleFour]`

When processed by the simple EBNF parser, this yields:

`or(and(ruleOne, ruleTwo), and(ruleThree, optional(ruleFour)))`

Be careful though, since currently, nesting rules isn't actually supported. There's no way for you to group rules together with parentheses, and for simplicity, there's no actual check to make sure parentheses/braces match, etc. This is due to the fact that this achieves 80% of the benefit with minimal implementation overhead. Maybe in the future Parlance will have a proper EBNF parser.

```javascript
// example EBNF rules; terminal function rules not shown
{
  'expression': 'term, { plusTerm }',
  'term': 'group, { timesGroup }',
  'plusTerm': 'plus, term',
  'group': 'number | left, expression, right',
  'timesGroup': 'times, group',
  'number': 'digit+'
  ...
}
```

## Structure format
The structural component of this project allows you to specify how rules relate to components in the final syntax tree. There's a one-to-one relationship between the properties in the grammar specification and the properties in the structural specification. Whereas in the grammar those properties can have function, object, or string values, in the structural spec, they are either functions or arrays of functions. 

See the `test/structures/expression-structure.js` file for examples. There are four cases:

1) If the corresponding grammar property is a function, that is, it's handled by you, the user, then the arguments are the tokens your function consumes in its processing. In the expressions example for single characters, the arguments are those single characters. 

2) If the corresponding property is instead a built-in `repeat` or `and`, then one argument is supplied, and it's an array of the components of that `repeat` or `and`. The arguments are themselves processed, structural components.

3) If the corresponding property is an `or`, then the value of that structural property must be an array of functions, which correspond to the components of the `or`, one-to-one, in order.

4) If the corresponding property is a string, that is, it simply refers to another rule, then the argument supplied to the corresponding structural function is that other rule's structural representation.

## License
MIT License: http://igliu.mit-license.org/
