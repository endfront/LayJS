# LAY.Level  

`LAY.Level` represents an object within a LAY application which encapsulates
the ["level"](../concept/level.md) concept.  
It can be instantiated by any of the below LAY methods:

  - [`LAY.level`](../function/level.md)
  - [`LAY.Level.level()` method](#method-level)

### Methods:

#### attr( attr )

Returns the value of the [attribute](../concept/attribute.md) by the name of **attr** of the level.  

**attr**: (string) name of the attribute.

#### children()

Returns a list of [LAY.Level](#) objects representing the children levels of
the level.

#### data( key, val )

Changes the value of the data of key name **key** to value **val**.  

**key**: (string) name of the key of the data requiring change.  
**val**: (any type) value to which it is required to change to.

#### level( relativePath )

Returns the [LAY.Level](#) object relative to the current level.  

**relativePath**: (string) [relative path](../concept/relative-path.md)

#### path()

Returns the (string) [path](../concept/level.md#path) of the level.

#### parent()

Returns a [LAY.Level](#) object representing the current level's parent level.  
For the [root level](../concept/level.md#root-level) the return value is undefined.

#### remove()

Removes the current level from it's parent level.  
*Note*: the [root level](../concept/level.md#root-level) cannot be removed. An attempt to do so will throw an error.



**Method pertaining to [many-type levels](../concept/many-type-level.md)**  

#### rowAdd( row )

Adds a single [row](../LSON/many.md#rows) **row** to the current [many-type level](../concept/many-type-level.md).  
The new row will subsequently add a new [many-derived levels](../concept/many-derived-level.md).  

**row**: ([rows](../LSON/many.md#rows)) row to be added

#### rowDeleteByID( id )

Removes the level derived from the current [many-type level](../concept/many-type-level.md) associated with the id value **id**.  

**id**: (any) value of **id** associated with the level to be removed.

#### rowsMore( list )

Adds an array of [rows](../LSON/many.md#rows) **list** to the current [many-type level](../concept/many-type-level.md).  
The new rows will subsequently add new [many-derived levels](../concept/many-derived-level.md).  

**list**: ([rows](../LSON/many.md#rows)) list of new rows to be added

#### rowsCommit( list )

Changes the [rows](../LSON/many.md#rows) of the current [many-type level](../concept/many-type-level.md) to the rows specified in **list**.  

**list**: ([rows](../LSON/many.md#rows)) rows to be changed to


#### rowsUpdate( key, val, query )

Changes the value of the key **key** of every row matching the [LAY.Query](Query.md) **query** to value **val**, of the current [many-type level](../concept/many-type-level.md).  
If **query** is `undefined`, the query will be applied to every row.  

**key**: (string) name of the key of the row requiring change.  
**val**: (any type) value to which it is required to change to.  
**query**: ([LAY.Query](Query.md) | undefined) query of rows for the rows requiring update. If value is `undefined` the query will be applied to every row.  

#### rowsDelete( query )

Deletes every row matching the [LAY.Query](Query.md) **query**, of the current [many-type level](../concept/many-type-level.md).  
If **query** is `undefined`, the query will be applied to every row.  

**query**: ([LAY.Query](Query.md) | undefined) query of rows for the rows requiring deletion. If value is `undefined` the query will be applied to every row.  

#### rowsLevels( query )

Returns a list of [LAY.Level](#) objects representing the levels derived from
the current [many-type level](../concept/many-type-level.md), which match every row in the [LAY.Query](Query.md).  
If **query** is `undefined`, the query will be applied to every row (implying that all derived levels will be returned).  

**query**: ([LAY.Query](Query.md) | undefined) query of rows for the rows required. If value is `undefined` the query will be applied to every row.  


#### queryFilter()

Returns a [LAY.Query](Query.md) object containing the rows of [many-derived levels](../concept/many-derived-level.md) of the current [many-type level](../concept/many-type-level.md) which passes the [many filter](../LSON/many.md#filter).  

#### queryRows()

Returns a [LAY.Query](Query.md) object containing the rows of [many-derived levels](../concept/many-derived-level.md) of the current [many-type level](../concept/many-type-level.md).  


**Method pertaining to [many-derived levels](../concept/many-derived-level.md)**  

#### many()

Returns the [many-type level](../concept/many-type-level.md) from which the
current [many-derived level](../concept/many-derived-level.md) was derived from.  

#### row( key, val )

Changes the value of the row of current [many-derived level](../concept/many-derived-level.md) of key name **key** to value **val**.

**key**: (string) name of the key of the row requiring change.  
**val**: (any type) value to which it is required to change to.

**Method pertaining to all levels except [many-type levels](../concept/many-type-level.md) and [many-derived levels](../concept/many-derived-level.md)**  

#### addChildren( lson )

Adds new children to the level.  
*Note*: Ensure that the children within the new LSON do not already exist (i.e
they have a unique path)

**lson**: (object) this argument refers to [LSON](../LSON/LSON.md).  
