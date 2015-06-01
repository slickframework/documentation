---
layout: base
activeMenu: documentation
title: Slick database package - SQL queries
contentsMenu: database/sql
next:
    url: /packages/database/ddl
    title: DDL queries
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
objects from classes that implement this interface.

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

Now we can use the `Children` class to create a query object abd retrieve data:

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
making easy to create database queries.

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
The first option is suitable to pass it to other object that will perform the
database query while the last (factory) you can query the database from the
query when you're done.

Lets continue with the `$select` object created with the factory:

```php
$results = $select
    ->where(
        ['name LIKE :pattern' => [':pattern' => '%Fil%']]
    )
    ->all();

# the above code will query the database with
# 'SELECT id, name, mail FROM users WHERE name LIKE "%Fil%"'
# and the $results should be a Slick\Database\RecordList object
```