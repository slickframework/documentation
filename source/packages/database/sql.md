---
layout: base
activeMenu: documentation
title: Slick database package - SQL queries
contentsMenu: database/sql
next:
    url: /packages/database/crud
    title: Insert, update and delete
previous:
    url: /packages/database
    title: Database Adapter

---

<div id="intro"></div>

# Creating queries

---

`Slick\Database` package comes with a very handy feature that allows you to
create and encapsulate database queries. The main goal here is to have a 
structure that you can use to represent a database query and, most important,
have an abstraction of a query that can easily be used with other adapter for
other SQL flavor without the need to change the _real_ query string.


## Encapsulating a query

---

All the queries that you can find in `Slick\Database\Sql` namespace implement
the `Slick\Database\Sql\SqlInterface` and you can also create your query
objects defining classes that implement this interface.

Lets check a very simple SQL query object usage:

```php
use Slick\Database\Sql\SqlInterface;

class ChildrenQuery implements SqlInterface
{
    public function getQueryString()
    {
        return "SELECT * FROM users WHERE age < 12";
    }
    
    public function getParameters()
    {
        return [];
    }
}
```

Now we can use the `Children` class to create a query object and retrieve data:

```php
use Slick\Database\Adapter;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$childrenQuery = new ChildrenQuery();
$children = $adapter->query($childrenQuery);

```

Of course this is a very simple example but it is sufficient to understand the
potential benefits of using this approach. You can isolate your business logic
in your query, setting parameters that latter will be bound to the sql query
and even unit test your query without the need of a real database connection.

In the next section you will see how we manage to use the query object
encapsulation to abstract the form and driver specific SQL dialect while
making it easy to create database queries.

<div id="select"></div>

## Select query

---

The `SELECT` SQL query is probably one of the most used queries in an application
and if you are familiar with MySQL or MsSQL it should by easy for you to understand
the way we use to create a query object.

There are two ways of creating a SQL query object:

```php
use Slick\Database\Sql\Select;

# Instantiating an object
$select = new Select('users', ['id', 'name', 'mail']);
```
or

```php
use Slick\Database\Sql;

# Using the SQL factory
$select = Sql::create($adapter)
    ->select('users', ['id', 'name', 'mail']);
```

The main difference between the two options is that the `Slick\Database\Sql`
factory will ask for a database adapter and the object instantiation will not.
The first option is suitable to be passed to other object that will perform the
database query while with the last (factory) you can query the database from the
query when you're done.

Lets continue with the `$select` object created with the factory:

```php
$results = $select
    ->where(
        ['name LIKE :pattern' => [':pattern' => '%Fil%']]
    )
    ->all();
```

The above code will query the database with
`'SELECT id, name, mail FROM users WHERE name LIKE "%Fil%"'`
and the `$results` should be a `Slick\Database\RecordList` object.

### `Sql::select()`

---

```php
public Select select(string $tableName, string[]|string $fields = ['*'])
```
Creates a `Select` SQL query object for a given table name and field list.

In the field list you can use a string with the field list you want to
retrieve as you would do in a normal SQL `SELECT` or an array with the
field names.

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$tableName`* | `string` | The table name you wan to query.
 *`$fields`*    | `string[]|string` | The fields to retrieve in query.
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object

<div id="where"></div>

## Defining where conditions

Some SQL query objects like `Select` can have `WHERE` clause conditions.
`Select::where()` is a simple yet powerful method that can be used to set almost
any `WHERE` clause on your queries 

### Defining simple conditions

The easiest way to set a condition is to pass the condition as a string:

```php
$select->where('status = 1');
```

As this is the simplest way of setting conditions it should only be used
without dynamic values as they will not be scape by the adapter when the query
is performed. In such cases you should scape the values before concatenating
them to the condition string.

### Conditions with placeholders

As I mentioned before, the `Slick\Database\Adapter` uses the `PDOStatement`
to perform the the database queries and it is possible to use the parameter
bind feature with the `Select::where()` method. 

The example below uses simple question marks for placeholders:

```php
$select->where(['status = ?' => true]);
```

It is also possible to add multiple conditions with one call:
```php
$select->where(
    [
        'status = ?' => true,
        'name LIKE ?' => '%Fil%'
    ]
);
```
You use an associative array where the keys are the condition strings with
the placeholders and the values are the ones used in the placeholders when
query is executed. All array elements will be join with a `AND` operation.

```php
$select->where(
    [
        'status = ? AND name LIKE ?' => [true, '%Fil%']
    ]
);
```

In the code above I have set a unique condition string with two placeholders and
the value as an array of values to be bind.
 
### Conditions with named placeholders

You can also use the `:named` placeholder in the same way as above.

```php
$select->where(
    [
        'status = :status AND (name LIKE :pattern OR mail LIKE :pattern)' => [
            ':status' => true,
            ':pattern' => '%Fil%'
        ]
    ]
  );
```

The difference here is that the value of your condition string is an associative
array where the keys are the placeholder names. This is useful when you have to
reuse a value in your condition string.

### Using the `OR` operation

As mentioned before, all elements in the associative array passed to `Select::where()`
method are joined with the `AND` operation. If you want to perform a `OR` operation
you use the special method `Select::orWhere()`:

```php
$select->where(
    [
        'name LIKE :pattern' => [':pattern' => '%Fil%']
    ]
  )
  ->orWhere('mail LIKE :pattern');
  
```

In the code above the resulting condition string is
`name LIKE :pattern OR mail LIKE :pattern` and the `[':pattern' => '%Fil%']` array
will be used to bind the parameter in query execution. As the named placeholder is
the same, we don't need to reenter the associative array mapping the `':pattern'`
placeholder again.

### `Select::where()`

---

```php
public Select where(string[]|string $conditions)
```

Sets a `WHERE` condition clause to current SQL query object joining the
condition predicates with an `AND` operation.

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$conditions`* | `string[]|string` | The conditions as shown in examples above.
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object

### `Select::andWhere()`

---

```php
public Select andWhere(string[]|string $conditions)
```
Sets a `WHERE` condition clause to current SQL query object joining the
condition predicates with an `AND` operation.
This is an alias to `Select::where()`, useful for a more verbose code.

---

### `Select::orWhere()`

---

```php
public Select orWhere(string[]|string $conditions)
```

Sets a `WHERE` condition clause to current SQL query object joining the
condition predicates with an `OR` operation.

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$conditions`* | `string[]|string` | The conditions as shown in examples above.
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object

<div id="join"></div>

## Joining tables

To join tables to you `SELECT` SQL object query is very simple:

```php
$select->join(
    'profiles',                 // The table name to join
    'prf.user_id = users.id',   // The join condition
    ['age', 'role', 'points'],  // The tables files to include in
    'prf',                      // The alias used in join condition and in field list
    Join::JOIN_LEFT             // The join type
);
```

The above code will result in the following SQL:

```sql
SELECT users.id, users.name, users.mail, prf.age, prf.role, prf.points
FROM users
LEFT JOIN profiles AS prf ON prf.user_id = users.id;
```

Note that when you use a join the field list is prefixed with the
table alias or name in order to avoid the redundant or ambiguous naming on
your query.

<div class="alert alert-info" role="alert">
    <h4>
        <i class="fa fa-info "></i>
        Note
    </h4>
    
    Whatever you set in the alias parameter it must be used in the join condition
    parameter otherwise it will fail with 'Unknown table name' type of errors. 
</div>

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    If you are using where clauses with joins you should provide the alias or table
    name as prefixes in your conditions when referring to fields.
</div>

### Setting the fields to retrieve

---

In the fields parameter you have 3 options:

 Type    | behavior |
---------|----------|
`null`   | No fields will be retrieved from this table.
`string` | The fields will be appended to the fields list without prefixing them with the table name or alias.
`string[]` | The field list will be prefixed and appended to the SELECT field list.
 
### Join types

---

The join types supported are the following ones

Constant          | Description |
------------------|-------------|
`Join::JOIN_FULL` | A full outer join
`Join::JOIN_INNER`| An inner join
`Join::JOIN_LEFT` | A left join
`Join::JOIN_RIGHT`| A right join

### `Select::join()`

---

```php
public Select join(string $table, string $on[, string|null|string[] $fields=['*'],
    string $alias=null, string $type = Join::JOIN_LEFT])
```

Adds a join table to the select query.

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$table`*     | `string` | The table name to join.
 *`$on`*        | `string` | The join condition.
 *`$fields`*    | `string|null|string[]` | The tables files to include in. Defaults to `['*']`.
 *`$alias`*     | `string` | The alias used in join condition and in field list. Defaults to `null` and the table name will be prefixed to field names
 *`$type`*      | `string` | The join type. Defaults to `Join::JOIN_LEFT`.
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object

<div id="order"></div>

## Ordering results

---

To order the query results you just add an order clause to the query:

```php
$select->order('name ASC');
```
The above code will produce the following SQL query:

```sql
SELECT id, name, mail
FROM users
ORDER BY name ASC;
```

### `Select::order()`

---

```php
public Select order(string $order)
```

Sets an order by clause to the select query.

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$table`*     | `string` | The order by clause to set
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object


<div id="limit"></div>

## Limited results

---

Limit your query results is very simple, just add the total rows and the offset
to the query:

```php
$select->limit(12, 24);
```
The above code will produce the following SQL query:

```sql
## MySQL example
SELECT id, name, mail
FROM users
LIMIT 24, 12;
```

### `Select::limit()`

---

```php
public Select limit(int $rows[, int $offset = 0])
```

Sets query limit and offset values.

Parameters     | Type     | Description 
---------------|----------|-------------
 *`$rows`*     | `int` | The number of rows to retrieve
 *`$offset`*   | `int` | The offset value for start retrieving
 
Return   | Description  
---------| -----------
`Select` | A `Select` SQL query object


<div id="count"></div>

## Counting rows

---

Now is time to retrieve rows from database and the `Slick\Database\Sql\Select` has
3 methods to retrieve the rows for current set SQL clauses: `count`, `first` and `all`.
I will start by the `Select::Count()` witch is often used to paginate database results.

Check out this code:

```php
use Slick\Database\Sql;

$totalRows = Sql::create($adapter)
    ->select('users')
    ->count();
```

The above code will produce the following SQL query:

```sql
SELECT COUNT(*) AS total
FROM users;
```

The `Select::count()` will execute the query and return the total rows count.

### `Select::count()`

---

```php
public int count()
```

Counts all records matching this select query

Return   | Description  
---------| -----------
`int` | The total rows count for current query.


<div id="all"></div>

## Get all records

---

Now that we know how to count the records in a given select query it is time
to retrieve the matching records for it. Similarly to the `Select::count()`
method you just call the `Select::all()` method to retrieve _all_ records.

Take a look:

```php
use Slick\Database\Sql;

$users = Sql::create($adapter)
    ->select('users')
    ->limit(15)
    ->all();
```

The above code will produce the following SQL query:

```sql
## MySQL example
SELECT * AS total
FROM users
LIMIT 15;
```

The `Select::all()` will execute the query and return the matching rows
as a `Slick\Database\RecordList` object that you can traverse to rich your data.

### `Select::all()`

---

```php
public RecordList all()
```

Retrieve all records matching this select query

Return   | Description  
---------| -----------
`Slick\Database\RecordList` | The traversable list of records matching the query


<div id="first"></div>

## Get first record

---

Times are that you only need the first matching record of your query. This can be
done with the `Select::first()` method that is similar to `Select::all()` method
except that the first one has a forced `LIMIT 1` clause before query is executed.

```php
use Slick\Database\Sql;

$user = Sql::create($adapter)
    ->select('users')
    ->first();
```

The above code will produce the following SQL query:

```sql
## MySQL example
SELECT * AS total
FROM users
LIMIT 1;
```

The `Select::first()` will execute the query and return the first matching row.

### `Select::first()`

---

```php
public array|object first()
```

Retrieve first record matching this select query

Return   | Description  
---------| -----------
`array|object` | The first matching record