#LAY.Take

LAY.Take represents an object whose objective is to provide a [monad](https://en.wikipedia.org/wiki/Monad_\(functional_programming\)) over which transformations can be committed over the base value, where the return of each method is wrapper of the LAY.Take object itself.  
The base value is decided by which of 2 ways was the (LAY.Take) object instantiated by [LAY.take()](../function/take.md)


## Methods:

### Math-related methods

- `add( val )`  
Adds (number | [LAY.Take](#)) `val` to base value.

- `plus( val )`  
alias of `add( val )`

- `subtract( val )`  
Subtracts (number | [LAY.Take](#)) `val` from base value.

- `minus( val )`  
alias of `subtract( val )`

- `divide( val )`  
Divides base value by (number | [LAY.Take](#)) `val`.

- `multiply( val )`  
Multiplies base value by (number | [LAY.Take](#)) `val`.

- `percent( val )`  
Multiplies base value with (number | [LAY.Take](#)) `val`, followed by a division by 100.

- `remainder( val )`  
Remainder from dividing the base value with (number | [LAY.Take](#)) `val`.

- `mod( val )`  
alias of `remainder( val )`

- `negative()`  
Negates the base value.

- `half()`  
Divides the base value by 2.

- `double()`  
Multiplies the base value by 2.

- `min( val )`  
Minimum value between the base value and (number | [LAY.Take](#)) `val`.

- `max( val )`  
Maximum value between the base value and (number | [LAY.Take](#)) `val`.

- `ceil()`  
Mathematical ceiling of the base value.

- `floor()`  
Mathematical floor of the base value.

- `round()`  
Mathematical rounding of the base value.

- `trunc()`  
Mathematical truncation of the base value.

- `abs()`  
Mathematical absolute value of the base value.

- `pow( val )`  
Base value by the power of (number | [LAY.Take](#)) `val`.

- `sqrt()`  
Square root value of the base value.  

<br>
### Comparator-related methods

- `eq( val )`  
Checks if the base value is equal to (===) (any | [LAY.Take](#)) `val`.

- `neq( val )`  
Checks if the base value is not equal to (!==) (any | [LAY.Take](#)) `val`.

- `gt( val )`  
Checks if the base value is greater than (>) (any | [LAY.Take](#)) `val`.

- `lt( val )`  
Checks if the base value is lesser than (<) (any | [LAY.Take](#)) `val`.

- `gte( val )`  
Checks if the base value is greater than or equal to (>=) (any | [LAY.Take](#)) `val`.

- `lte( val )`  
Checks if the base value is lesser than or equal to (<=) (any | [LAY.Take](#)) `val`.

- `identical( val )`  
Checks if the base value is identical (deep equal) to (any | [LAY.Take](#)) `val`.  

<br>
### String-related methods

- `capitalize()`  
Capitalizes the (string) base value.

- `concat( val )`  
Concatenates the (string) base value with (string | [LAY.Take](#)) `val`.

- `startsWith( val )`
Checks if the (string) base value starts with (string | [LAY.Take](#)) `val`.

- `endsWith( val )`
Checks if the (string) base value ends with (string | [LAY.Take](#)) `val`.

- `indexOf( val )`
Gets the index of (string | [LAY.Take](#)) `val`, within (string) base value. Returns -1 if not found.

- `trim()`
Strips the leading and trailing whitespace of (string) base value.

- `index( i )`  
Gets the value at index (number | [LAY.Take](#)) `i` of the (string) base value.

- `length()`  
Length of the (string) base value.

- `contains( val )`  
Checks if the (string) base value contains (string | [LAY.Take](#)) `val`.

- `format( arg1, arg2, ... argN )`  
Formats the (string) base value with the arguments (each type: any | [LAY.Take](#)) using the [printf](https://en.wikipedia.org/wiki/Printf_format_string) rules.

- `i18nFormat( arg1, arg2, ... argN )`  
Formats the (string) key-value of the (object) base value of the key specified by the "data.en" [attribute](../concept/attribute.md) of the [root level "/"](../concept/level.md#root-level), with the arguments (each type: any | [LAY.Take](#)) using the [printf](https://en.wikipedia.org/wiki/Printf_format_string) rules.

- `number()`  
Convert the (string) base value to type number.  

- `lowercase()`  
Lowercases the (string) base value.

- `uppercase()`  
Uppercases the (string) base value.


<br>
### Array-related methods

- `index( i )`  
Gets the value at index (number | [LAY.Take](#)) `i` of the (array) base value.

- `indexOf( val )`
Gets the index of (any | [LAY.Take](#)) `val`, within (array) base value. Returns -1 if not found.

- `length()`  
Length of the (array) base value.

- `slice( begin, end )`  
Slices the (array) base value using the Javascript [slice array prototype method](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) with arguments `begin` and `end` respectively.

- `contains( val )`  
Checks if the (array) base value contains (any | [LAY.Take](#)) `val`.

- `within( val )`  
Checks if the (any) base value is contained within (array | [LAY.Take](#)) `val`.


<br>
### Logic-related methods

- `and( val )`  
Logical "and" (&&) of base value with (any | [LAY.Take](#)) `val`.

- `or( val )`  
Logical "or" (||) of base value with (any | [LAY.Take](#)) `val`.

- `not()`  
Logical "negation" (!) of base value.

<br>
### Color-related methods

- `colorLighten( val )`  
Applies the [LAY.Color.lighten()](Color.md#method-lighten) method to the ([LAY.Color](Color.md)) base value with argument (number | [LAY.Take](#)) `val`.

- `colorDarken( val )`  
Applies the [LAY.Color.darken()](Color.md#method-darken) method to the ([LAY.Color](Color.md)) base value with argument (number | [LAY.Take](#)) `val`.

- `colorSaturate( val )`  
Applies the [LAY.Color.saturate()](Color.md#method-saturate) method to the ([LAY.Color](Color.md)) base value with argument (number | [LAY.Take](#)) `val`.

- `colorDesaturate( val )`  
Applies the [LAY.Color.desaturate()](Color.md#method-desaturate) method to the ([LAY.Color](Color.md)) base value with argument (number | [LAY.Take](#)) `val`.

- `colorTransparentize( val )`  
Applies the [LAY.Color.transparentize()](Color.md#method-transparentize) method to the ([LAY.Color](Color.md)) base value with argument (number | [LAY.Take](#)) `val`.

- `colorInvert()`  
Applies the [LAY.Color.invert()](Color.md#method-invert) method to the ([LAY.Color](Color.md)) base value.

- `colorMix( color )`  
Applies the [LAY.Color.mix()](Color.md#method-mix) method to the ([LAY.Color](Color.md)) base value with argument ([LAY.Color](Color.md) | [LAY.Take](#)) `color`.

- `colorStringify()`  
Applies the [LAY.Color.stringify()](Color.md#method-stringify) method to the ([LAY.Color](Color.md)) base value.

- `colorEquals( color )`  
Applies the [LAY.Color.equals()](Color.md#method-equals) method to the ([LAY.Color](Color.md)) base value with argument ([LAY.Color](Color.md) | [LAY.Take](#)) `color`.


<br>
### Regex-related methods

- `regexMatch( pattern )`  
Matches (string) base value for regex using [String.prototype.match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) method with argument (regexp | [LAY.Take](#)) `pattern`.  

- `regexSearch( pattern )`  
Matches (string) base value for regex using [String.prototype.search()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search) method with argument (regexp | [LAY.Take](#)) `pattern`.  

- `regexTest( val )`  
Tests the (regexp) base value for match on (string | [LAY.Take](#)) `val` using the [RegExp.prototype.test()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) method with argument (string | [LAY.Take](#)) `val`.  

- `regexExec( val )`  
Tests the (regexp) base value for match on (string | [LAY.Take](#)) `val` using the [RegExp.prototype.exec()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) method with argument (string | [LAY.Take](#)) `val`.  

<br>
### Filter-related methods

- `filterEq( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` equal (===) to value (any | [LAY.Take](#)) `val`.

- `filterNeq( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` not equal (!==) to value (any | [LAY.Take](#)) `val`.

- `filterGt( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` greater than (>) value (any | [LAY.Take](#)) `val`.

- `filterGte( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` greater than or equal to (>=) value (any | [LAY.Take](#)) `val`.

- `filterLt( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` lesser than (<) value (any | [LAY.Take](#)) `val`.

- `filterLte( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` lesser than or equal to (<=) value (any | [LAY.Take](#)) `val`.

- `filterGt( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` greater than (>) value (any | [LAY.Take](#)) `val`.

- `filterRegex( key, pattern )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` matching the pattern (regexp | [LAY.Take](#)) `pattern`.

- `filterContains( key, val )`  
Filters the objects of the (array of objects) base value which have the (string | array) value associated with the iterated object's key (string | [LAY.Take](#)) `key` contains the value (any | [LAY.Take](#)) `val`.

- `filterWithin( key, val )`  
Filters the objects of the (array of objects) base value which have the value associated with the iterated object's key (string | [LAY.Take](#)) `key` is contained within the value (string | array | [LAY.Take](#)) `val`.

- `filterFn( fn )`  
Filters the objects of the (array of objects) base value which return true on the application of function (function | [LAY.Take](#)) `fn` on the iterated object, with the iterated object being the argument.


<br>
### Fold-related methods

- `foldMax( key )`  
Obtains the maximum value associated with the iterated object's key (string | [LAY.Take](#)) `key` of the (array of objects) base value.

- `foldMin( key )`  
Obtains the minimum value associated with the iterated object's key (string | [LAY.Take](#)) `key` of the (array of objects) base value.

- `foldSum( key )`  
Obtains the sum of each of the values associated with the iterated object's key (string | [LAY.Take](#)) `key` of the (array of objects) base value.

- `foldFn( fn, acc )`  
Performs a [fold operation](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) on the (array of objects) base value, with the function (function | [LAY.Take](#)) `fn` (where the argument provided is the iterated object). The accumulator being (any | [LAY.Take](#)) `acc`.


<br>
### Remaining methods

- `key( name )`  
Retrieves the value associated with key (string | [LAY.Take](#)) within the (object) base value.

- `fn( arg1, arg2, ... argN )`  
Applies the (function) base value with arguments (each type: any | [LAY.Take](#)), the return of the function being the transformed base value.  
Note: the context (`this`) within the function is that of the current [Level](Level.md).
