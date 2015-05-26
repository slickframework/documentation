---
layout: base
activeMenu: documentation
title: Slick database package
contentsMenu: database/adapter
next:
    url: /packages/database/sql
    title: Creating queries

---

<div id="adapter"></div>

# Database Adapter

---

Database adapter is a vary powerful, yet lightweight object that allows you to
connect to database drivers and abstracts all the iteration you regularly need
when working with databases.

`Slick\Common\Database` has drivers for MySql and Sqlite out of the box but it
also has a very simple interface you can use to implement you own driver. It
has a separate interface for drivers of database systems that support
transactions.
 
## Creating an adapter

The best way to create a database adapter is using the `Slick\Database\Adapter`
factory.

Lets create an adapter for MySql database server:

```php
use Slick\Database\Adapter;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_MYSQL,
        'options' => [
            'database' => 'tests',
            'username' => 'user',
            'password' => '********'
            'host'     => 'localhost'
        ]
    ]
);
```

And that's it! The code above will create a `Slick\Database\MysqlAdapter`
adapter that you can use to run your queries.

This are the options for known drivers

---
MySql adapter driver name: `Slick\Database\MysqlAdapter::DRIVER_MYSQL`
 
| *Property* | *Default* | *Description*                                    |
|------------|-----------|--------------------------------------------------|
| `host`     | null      | The server host name
| `port`     | 3306      | The server port
| `username` | null      | User with access to tah server
| `password` | null      | User correspondent password
| `database` | null      | The database name
| `charset`  | 'utf8'    | The encoding charset

---
Sqlite adapter driver name: `Slick\Database\MysqlAdapter::DRIVER_SQLITE`
 
| *Property* | *Default*  | *Description*                                    |
|------------|------------|--------------------------------------------------|
| `file`     | ':memory:' | The path to the database file

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    As a limitation of Sqlite the <code>Slick\Database\Adapter\SqliteAdapter</code>
    does not support transactions. As so you should check if the adapter you
    are working with implements <code>Slick\Database\Adapter\TransactionsAwareInterface</code>
    before you use <code>beginTransaction()</code>, <code>commit()</code>
    and <code>rollBack()</code> methods. 
</div>

<div id="query"></div>

## Querying data

---

Once you now have a database adapter it is very simple to retrieve data from a database
server.

```php

$sql = "SELECT * FROM users";

$data = $adapter->query($sql);

print_r($data[0]);

# This will output
Array (
    'id' => 1,
    'name' => 'Jon Doe',
    ...
)

```

The output form a query is always a `Slick\Database\RecordList` object. This object
implements `Countable`, `ArrayAccess` and `IteratorAggregate` so it can be used as
an array or you can iterate over the records that the query operation has returned.

If you want to use the raw array returned from query you can call the
`Slick\Database\RecordList::asArray()` method.

If in result of the query operation you got an empty record list you will have
`Slick\Database\RecordList::count()` returning a 0 (zero) count.

### Binding parameters to your queries

---

The implementations that we have made for MySql and Sqlite adapters are, more or
less, proxies for the PHP PDO and PDOStatement objects. This means that we can
bind parameters to SQL query in form of placeholders.

So if you want to do a query with parameters just do something similar
to the follow:

```php
$sql = 'SELECT name, colour, calories
        FROM fruit
        WHERE calories < ? AND colour = ?';

$red = $adapter->query($sql, [150, 'red']);
```

Every time a query is made a prepared statement is created and the passed parameters
are bind to the query upon query execution.

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    You cannot bind more values than specified; if more keys exist in parameters than
    in the specified in the SQL, then the statement will fail and an exception is thrown.
</div>

It is also possible to use a `Slick\Database\Sql\SqlInterface` object instead of a SQL
string with `Adapter::query()` method.
This interface is very simple and only has one method to
implement witch will be used by the adapter to retrieve the SQL query string.

### Changing the fetch mode

---

You can set the fetch mode for the statement that `Adapter::query()` will create
by setting it before you query your database:

```php
$sql = "SELECT * FROM users";

$data = $adapter->setFetchMode(\PDO::FETCH_NUM)
    ->query($sql);

print_r($data[0]);

# This will output
Object (
    0 => 1,
    1 => 'Jon Doe',
    ...
)

```

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    For the simplicity of this documentation we didn't use a <code>try{} catch(){}</code>
    to perform the queries. Nevertheless you should always use a  <code>try{} catch(){}</code>
    block for the eventuality of any error occurs during the query executions.<br>
    The <code>Adapter::query()</code> will throw an <code>Slick\Database\Exception\SqlQueryException</code>
    exception that you have to treat.
</div>

<div id="executing-queries"></div>

## Executing queries

If you want to execute queries without data return like deletes or inserts for
example you can use the `Adapter::execute()` method that only will return the
affected rows by the query command you provide.

```php
$sql = 'DELETE FROM fruit
        WHERE calories < ? AND colour = ?';

$affected = $adapter->execute($sql, [150, 'red']);

print $affected; // will print out 3
```

This method has an identical signature than the `Adapter::query()` method where
you can use a full string query or you can bind the parameters to placeholders
in your query string.