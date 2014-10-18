

Hi.


## Style Guide

I might have broken some of the rules below, if you find such cases then let me know.


### Spacing

I completely understand when people get upset about inconsistent spacing in their code.

But I am very against postprocessing code to check for style, a single space off shouldn't need
to slap the developer with an error. The developer no matter where must be focused on producing good
code and not good looking code.

That being said, there is only one requirement I would put forward when it comes to spacing, and
that can be summarized as "the more the merrier"

for example:

  function foo(){
    for(var i=0;i<10;i++){
        console.log("number is: " + i);
    }
  }

would be lesser preferable to:

  function foo() {

    for( var i = 0; i < 10; i++ ) {

        console.log( "number is: " + i );

    }

  }



### Variable Names:

**Strings & Numbers**

snake_case

  var first_name = "Tyrion";
  var age = 50;


**Boolean**

is_<snake_case>

  var is_number = typeof x === 'number';


**Arrays**

< case of array component >S

  var odd_integerS = [ 1, 3, 5, 7 ];
  var randomFunctionS = [ morePizza, moreCoke, morePepperoni ];

The 'S' stacks up on multiple nesting of arrays:


  var randomFunctionSS = [ [ morePizza, moreCoke, morePepperoni ], [ moreCooking, moreMoney, morePets ] ];



In case the number items of array is predetermined and small,
then the variable name can be listed referring to all the componenets of the array separated by 'and', in this case:

  var movie_and_year = [ 'Her', 2014 ];

If this array were to be nested along with other movies, then the 'S' would stack as usual:

  var movie_and_yearS = [ [ 'The Shawshank Redemption', 1994 ], [ 'Toy Story 3', 2010 ], [ 'Her', 2014 ] ];


**Objects**

- as Hashmaps:

< name of key >2< name of value >

  var country2continent = { 'USA': 'North America', 'Germany': 'Europe', 'Chile': 'South America' };

- as class instances (or class-like hashmaps)

camelCase

  var newCar = new Car();

(class-like hashmaps refer to intricate objects with multiple properties of different types,
  example: the lson object)

**Functions**

camelCase  

Try your best to keep the first word in the function name to be a verb.

Functions can also be snake_case, as long as its prefixed with fn_: fn_snake_case
