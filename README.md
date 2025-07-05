> [!IMPORTANT]
> Migrated to [quexxon/ecks](https://codeberg.org/quexxon/ecks) on Codeberg.

# Introduction

Ecks is an embedded expression language that can add limited scripting
capability to applications written in a host language. This reference
implementation targets JavaScript runtimes.

## Features

- A hosted language
- Everything is an expression
- No side-effects
- Strongly typed
- All types are inferred
- All types have value equality
- Emphasis on brevity
- Case insensitive
- Optional types instead of a null value - handling is enforced
- Almost no syntax - should be learnable in just a few minutes
- All data structures are immutable
- No looping constructs, only iterative methods like `map`, `fold` (i.e.
  reduce), and `keep` (i.e. filter)
- The printable representation of all data types is identical to the literal
  representation. This means, among other things, that all (valid) examples in
  this documentation can be copied as-is into the provided REPL and evaluated.

# Overview

Everything is an expression, meaning that all constructs in the language
evaluate to a value.

## Data Types

### Integers

Ecks supports integers in decimal (e.g. `16`), octal (e.g. `020`), and
hexadecimal (e.g. `#10`) notations. The minimum integer value is 0, but the
maximum value depends on the host language.

### Floats

Ecks also supports floating point numbers. There must be at least one digit
following the decimal point (e.g. `1.0` is valid, but `1.` is not). E notation
is supported (e.g. `1.2e3 = 1200.0`). Floating point precision is dependent on
the host language.

### Booleans

The boolean type contains two values: `true` and `false`. These are keywords.

### Strings

Ecks strings are surrounded by either single quotes, double quotes, or backticks
(template strings). Character encoding is dependent on the host language.

Examples:

```
'this is a string'
"this is also a string"
```

#### Escape Sequences

The following special escape sequences are provided. When present in a string,
the escape sequence will be substituted with the indicated character.

```
\n - newline
\t - tab
\\ - backspace
```

Any other character escaped with a backslash will be preserved verbatim. Most
significantly, this means that a backslash can be used to include a literal `'`
in a single quote delimited string, a `"` in a double quote delimited string,
and a backtick or `{` in a template string.

Examples:

```
'\t This string contains \n two lines and begins with a tab character.'
'C:\\Users'
'This contraction can\'t work without the escaped single quote.'
```

#### Template Strings

String interpolation is provided via template strings. Within a backtick
delimited string, an expression may be embedded between an unescaped `{` and a
`}`. During an expansion step, any embedded expressions will be evaluated and
replaced with the result of calling the `str` method on the expression (all
types support the `str` method). Template strings may be nested to any depth.

Examples:
```
`1 + 1 = {1 + 1}` = '1 + 1 = 2'
`cats and {`d{'OG'.lower}s`}` = 'cats and dogs'
```

## Control Flow

Ecks only provides very basic control flow in the form of two conditional
expressions and a case analysis expression.

### Conditional Expressions

All condition predicates must resolve to a `bool`. There is no concept of
truthy/falsy values.

#### Ternary Operator (2 branches)

The ternary operator is a two branch conditional expression. It is analogous to
an `if` expression in some other languages. If the `CONDITION` is true, then the
`CONSEQUENT` is evaluated. Otherwise, the `ALTERNATIVE` is evaluated.

Syntax: `CONDITION ? CONSEQUENT : ALTERNATIVE`

Example: `2 = 2 ? 'Math works!' : 'Math is broken!'`

#### Condition Expression (N branches) 

Evaluates to the right-hand side of the first branch whose left-hand side
evaluates to `true`. If no branch evaluates to `true`, returns the right-hand
side of the `else` branch (or return `none` when the `else` branch is omitted).
All expressions must evaluate to the same type. The `else` branch is optional.
When present, the result will have the same type as the expressions. When
omitted, the result will be an optional type. To avoid ambiguity in the grammar,
the `:` is required between the antecedent and consequent - this is a departure
from the map syntax.

Syntax:

```
cond {
  CONDITION : EXPRESSION [,]
  ...
  [else : EXPRESSION]
}
```

Examples (where `n = 7` and `word = 'fish'`):

```
cond {
  n > 10 : "Too high!"
  n < 5  : "Too low!"
  else   : "Just right!"
} = "Just right!"

cond {
  word.starts('f') : 'f word'
} = some('f word')
```

## Optional Types

Methods may return optional values. For example, `map<T>.at(string) => T?`, when
the map's values are of type `int` returns `int?` (i.e. optionally int) because
a map might not contain the given key. All optional types must be immediately
resolved via use of the `??` operator to provide a default value. Expressions
must ultimately return a non-optional value. Example:

```
[1 2 3].find(|x| x >= 5) ?? 5
```




### Case Expression

Evaluates to the right-hand side of the first branch whose left-hand side is
equal to the value of the given expression. If no branch is equal to the value
of the given expression, returns the right-hand side of the `else` branch. The
`else` branch is required to guarantee that the expression evaluates.

Syntax:

```
case EXPRESSION {
  EXPRESSION : EXPRESSION [,]
  ...
  else : EXPRESSION
}
```

Example:

```
case user.role.trim.lower {
  "Owner" : 30
  "Admin" : 20
  else    : 10
}
```

# Data Types

## Lambdas

Lambdas are a special value type that doesn't have methods. It is only
permissible to use a lambda as a method argument. The body of a lambda is an
expression.

Syntax: `| ARGUMENT* | EXPRESSION`

Commas between arguments are optional.

Example: `[1 2 3].fold(0, |sum x| sum + x)`

## Primitives

- int (32) - Supports `012` for octal and `#12` for hexadecimal
- float (64)
- string (UTF-8)
- bool (`true` or `false`)

### Examples

```
(1 + 2) * 3         // 9 - syntactic sugar for the following example
1.+(2).*(3)         // 9 - same as above, but weird
-1.abs              // 1 - no parens required for methods without params
256.clamp(0, 255)   // 255
25.6.floor          // 25.0
25.6.ifloor         // 25 - int conversion
25.6.ceil           // 26.0
25.6.iceil          // 26 - int conversion
(25.6).round        // 26.0 - parens if it helps you sleep at night
25.6.iround         // 26 - int conversion
25.pow(2)           // 625
25.sqrt             // 5
```

## Collection Types

Note: For brevity, commas between compound data structure members are optional.
Prefer no commas.

### Array

An indexed data structure where all members must have the same type.

#### Syntax

`[1 2 3]` or `[1, 2, 3]`

#### Examples

Where `arr = [1 4 3 11]`:

```
arr.all(|x| x > 10)          // false
arr.any(|x| x > 10)          // true
arr.nany(|x| x > 10)         // false  i.e., not any
arr.keep(|x| x < 10)         // [1 4 3]
arr.drop(|x| x < 10)         // [11]
arr[0] ?? 0                  // 1 - syntactic sugar for .at
arr.at(0) ?? 0               // 1
arr.set(0, 10)               // [10 4 3 11]
arr.map(|x| x * x)           // [1 16 9 121]
arr.slice(0, 3)              // [1 4 3]
arr.rev                      // [11 3 4 1]
arr.sort                     // [1 3 4 11]
arr.rsort                    // [11 4 3 1]
arr.sortby(|x y| y - x)      // [11 4 3 1]
arr.len                      // 4
arr.find(|x| x < 10) ?? 0    // 1
arr.rfind(|x| x < 10) ?? 0   // 3
arr.findi(|x| x < 10) ?? 0   // 0  i.e., find index of matching element
arr.rfindi(|x| x < 10) ?? 0  // 2  i.e., same thing, but start at the end
arr + [3 2 1]                // [1 4 3 11 3 4 1]
arr = [3 2 1]                // false
arr.join("-")                // "1-4-3-11"
[myArray, myArray].flat      // [1 4 3 11 1 4 3 11]
[1 2 2 2 3].uniq             // [1 2 3]
[1 2 2 2 3].toset            // {1 2 3}
```

### Tuple

A statically-typed, heterogenous, indexed data structure. Provides a lightweight
form of user-defined data structure. A tuple must have, at minimum, 2 fields and
may have, at most, 5 fields.

#### Syntax

`|1.25 true "cat"|` or `|1.25, true, "cat"|`

#### Examples

Where `tpl = |"example.txt", 0755, "will"|`:

```
tpl.0    // "example.txt"
tpl.1    // 493
tpl.len  // 3
```

### Set

A homogenous, unordered collection of unique values.

#### Syntax

`{0 1 3}` or `{0, 1, 3}`

#### Examples

Where `a = {"A" "B" "C"}` and `b = {"C" "D" "E"}`:

```
a.union(b)   // {"A" "B" "C" "D" "E"}
a.diff(b)    // {"A" "B"}
a.sdiff(b)   // {"A" "B" "D" "E"} i.e. the symmetric difference
a.inter(b)   // {"C"}
a.has("C")   // true
a.has("D")   // false
a.add("D")   // {"A" "B" "C" "D"}
a.del("C")   // {"A" "B"}
a.array      // ["A" "B" "C"]
a.len        // 3
```

### Map

A homogenous key/value collection where value is always a string.

#### Syntax

`{a: 0 b: 2}` or `{a: 0, b: 2}`

#### Examples

Where `map = {red: #FF0000 green: #FF00 blue: #FF}`:

```
map.keys             // ["red" "green" "blue"]
map.vals             // [16711680 65280 255]
map.pairs            // [{"red" 16711680} {"green" 65280} {"blue" 255}]
map.len              // 3
map["red"]           // 16711680 - syntactic sugar for .at
map.at("red")        // 16711680
map.set("black", 0)  // {red: 16811680 green: 65280 blue: 255 black: 0}
map.del("red")       // {green: 65280 blue: 255}
map.has("green")     // true
```

## Other Compound Types ???

- buffer (array of bytes)
- point
