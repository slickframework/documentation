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