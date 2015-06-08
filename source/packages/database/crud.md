---
layout: base
activeMenu: documentation
title: Slick database package - Insert, update and delete
contentsMenu: database/crud
next:
    url: /packages/database/ddl
    title: DDL queries
previous:
    url: /packages/database/sql
    title: Creating queries

---

<div id="insert"></div>

# Insert, update and delete

---

Has you saw in the previous chapter, the main goal of `Slick\Database\Sql` package
is to abstract the database driver specific SQL dialect and create the basic queries
regardless the way the final SQL statement should be.
  
In this chapter I will show you how to change data in your tables using the built
in `Slick\Database\Sql` query classes.

## Insert

---

To insert data to your database table you only need an associative array that
maps the tables fields you want to set with the correspondent data values.

Lets create our query object using the `Slick\Database\Sql` factory class. Keep in
mind that you can also create the query object without the factory class, but I
thing using it its more verbose when you read your code. Its just a personal preference.


```php
use Slick\Database\Adapter;
use Slick\Database\Sql;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$insert = Sql::create($adapter)
    ->insert('users')
    ->set(
        [
            'username' => 'joe',
            'mail' => 'joe@example.com'
        ]
    )
    ->execute();
```

The code above will create the following SQL:

```sql
INSERT INTO uses (username, mail)
VALUES ('joe', 'joe@example.com');
```

The `Insert::execute()` will execute the query and return the affected (inserted) rows.

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    For the simplicity of the read of this manual I haven't put the query execution
    inside a <code>try/catch</code> block, as it may trow exceptions you should always
    run your queries inside a <code>try/catch</code> block.
</div>

### `Sql::insert()`

---

```php
public Insert insert(string $tableName)
```
Creates an `Insert` SQL query object for a given table name.


Parameters      | Type     | Description 
----------------|----------|-------------
 *`$tableName`* | `string` | The table name you wan to insert data.
 
Return   | Description  
---------| -----------
`Insert` | An `Insert` SQL query object


### `Insert::set()`

---

```php
public Insert set(array $data)
```

Sets the data for current SQL query

Parameters      | Type     | Description 
----------------|----------|-------------
 *`$data`* | `array` | An associative array that maps the field names to correspondent data values.
 
Return   | Description  
---------| -----------
`Insert` | An `Insert` SQL query object.

### `Insert::execute()`

---

```php
public int execute()
```

Executes an SQL or DDL query and returns the number of affected rows
 
Return   | Description  
---------| -----------
`int` | The number of affected rows by the insert query.

<div id="update"></div>

## Update

---

Updating a table record is vey similar to the insert query you saw above except that
you can (and almost will) use a where clause.

Check it out:

```php
$update = Sql::create($adapter)
    ->update('users')
    ->set(
        [
            'username' => 'joe',
            'mail' => 'joe@example.com'
        ]
    )
    ->where(['id = :id' => [':id' => 23]])
    ->execute();
```

<div class="alert alert-warning" role="alert">
    <h4>
        <i class="fa fa-exclamation "></i>
        Careful
    </h4>
    
    When you deal with conditions in the <code>Update</code> object you have to use
    the named parameters in your conditions as the <code>Insert::set()</code> method
    will used named parameter binding for all elements in the provided associative
    data array and <code>PDOStatement</code> does not accept the mix of placeholder
    question marks and named parameters.
</div>

The code above will create the following SQL:

```sql
UPDATE user SET username = 'joe', mail = 'joe@example.com'
WHERE id = 23;
```

The `Update::execute()` will execute the query and return the affected (updated) rows.

You can check how to set the `WHERE` clause that is the same as the one used in the
[Defining simple conditions](/packages/database/sql#where) section of `Slick\Database\Sql\Select`
manual.

### `Sql::update()`

---

```php
public Update update(string $tableName)
```
Creates an `Update` SQL query object for a given table name.


Parameters      | Type     | Description 
----------------|----------|-------------
 *`$tableName`* | `string` | The table name you wan to update data.
 
Return   | Description  
---------| -----------
`Update` | An `Update` SQL query object.

<div id="delete"></div>

## Delete

---

The `Delete` query object follows the same simplicity from the other SQL query objects
we have seen so far. You just need to provide the table name and a delete condition or
group of conditions.

```php
$delete = Sql::create($adapter)
    ->delete('users')
    ->where(['id = ?' => 23])
    ->execute();
```

The code above will create the following SQL:

```sql
DELETE FROM users
WHERE id = 23;
```

The `Delete::execute()` will execute the query and return the affected (updated) rows.

You can check how to set the `WHERE` clause that is the same as the one used in the
[Defining simple conditions](/packages/database/sql#where) section of `Slick\Database\Sql\Select`
manual.

### `Sql::delete()`

---

```php
public Delete delete(string $tableName)
```
Creates a `Delete` SQL query object for a given table name.


Parameters      | Type     | Description 
----------------|----------|-------------
 *`$tableName`* | `string` | The table name you wan to delete data.
 
Return   | Description  
---------| -----------
`Delete` | A `Delete` SQL query object.
