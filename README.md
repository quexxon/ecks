# Overview

- A hosted language
- Everything is an expression
- No side-effects
- Strongly typed
- All types are inferred
- All types have value equality
- Emphasis on brevity
- Optional types instead of `null` - handling is enforced
- Almost no syntax. Should be learnable in ~5 minutes.
- Syntax should be familiar to users of Algol-family languages.
- Immutable data structures
- No looping constructs, only iterative methods like `map`, `fold` (i.e.
  reduce), and `keep` (i.e. filter)
- Only built-in types
- All types support methods (except Lambdas)
- Operators are syntactic sugar for methods (i.e. `1 + 2` is actually `1.+(2)`)
- All methods are implemented in the host language
- All types are implemented in the host language

# Expressions

Everything is an expression, meaning that all constructs in the language
evaluate to a value.

## Optional Types

Methods may return optional values. For example, `map<T>.at(string) => T?`, when
the map's values are of type `int` returns `int?` (i.e. optionally int) because
a map might not contain the given key. All optional types must be immediately
resolved via use of the `??` operator to provide a default value. Expressions
must ultimately return a non-optional value. Example:

```
[1 2 3].find(|x| x >= 5) ?? 5
```

## Conditional Expressions

All condition predicates must resolve to a `bool`. There is no concept of
truthy/falsy values.

### Ternary Operator (2 branches)

Syntax: `CONDITION ? IF-EXPRESSION : ELSE-EXPRESSION`

Example: `2 = 2 ? "Math works!" : "Math is broken!"`

### Condition Expression (N branches) 

Evaluates to the right-hand side of the first branch whose left-hand side
evaluates to `true`. If no branches evaluate to `true`, returns the right-hand
side of the `else` branch. The `else` branch is required to guarantee that the
expression evaluates.

Syntax:

```
cond {
  CONDITION : EXPRESSION [,]
  ...
  else : EXPRESSION
}
```

Example:

```
cond {
  x > 10 : "Too high!"
  x < 5  : "Too low!"
  else   : "Just right!"
}
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
arr.some(|x| x > 10)         // true
arr.none(|x| x > 10)         // false
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