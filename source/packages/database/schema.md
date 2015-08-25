---
layout: base
activeMenu: documentation
title: Slick database package - Schema creation
contentsMenu: database/schema
previous:
    url: /packages/database/ddl
    title: DDL statements

---
<div id="adding-tables"></div>

# Schema creation

---

`Slick\Database` package comes with a simple _Schema_ feature that allows you to
define a database schema and use it for example on application's database
bootstrap.

## Adding tables

---

In a more simple way a schema is a collection of tables so basically you need to
add `Table`s to your schema definition using the DDL concepts from [previous chapter](/packages/database/ddl#column-types).

So lest begin with a simple table:

```php
use Slick\Database\Schema;
use Slick\Database\Sql\Ddl\Column;
use Slick\Database\Sql\Ddl\Constraint;

$people = new Schema\Table(
    [
        'name' => 'people',
        'columns' => [
            new Column\Integer('id', [
                'autoIncrement' => true,
                'size' => Column\Size::big()
            ]),
            new Column\Text('name', ['size' => Column\Size::tiny()]),
            new Column\Varchar('email', 255),
            new Column\Blob('picture', 1024),
            new Column\Boolean('active')
        ],
        'constraints' => [
            new Constraint\Primary('peoplePrimary', ['columnNames' => ['id']]),
            new Constraint\Unique('peopleUniqueEmail', ['column' => 'email'])
        ]
    ]
);
```

A table have a `name`, a collection of `columns` and `constraints`. You can pass an
associative array with the values you want to define or you can use the setters
described bellow.

#### `Table::setName()`
Set the database table name.
```php
public Table setName(string $name)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$name`* | `string` | The table name to set.
 
Return   | Description  
---------| -----------
`Table` | Current `Table` instance, useful for method chaining.

---

#### `Table::addColumn()`
Adds a column to the table.
```php
public Table addColumn(ColumnInterface $column)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$column`* | `ColumnInterface` | The column you want to add to the table.
 
Return   | Description  
---------| -----------
`Table` | Current `Table` instance, useful for method chaining.

---

#### `Table::addConstraint()`
Adds a constraint to the table.
```php
public Table addConstraint(ConstraintInterface $constraint)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$constraint`* | `ConstraintInterface` | The constraint you want to add to the table.
 
Return   | Description  
---------| -----------
`Table` | Current `Table` instance, useful for method chaining.

<div id="create-schema"></div>

## Schema definition

---

Now that we have our tables lets create the Schema with them:

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

$schema = new Schema(['name' => 'myDb']);
$schema->addTable($people);

# Execute the creation query:
$adapter->execute($schema->setAdapter($adapter)->getCreateStatement());
```

As you can see you use the adapter to generate the SQL statement and to execute it.
You can also use the following API to set your schema definition:


#### `Schema::setName()`
Sets the database schema name.
```php
public Schema setName(string $name)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$name`* | `string` | The name for the database schema.
 
Return   | Description  
---------| -----------
`Schema` | Current `Schema` instance, useful for method chaining.

---

#### `Schema::addTable()`
Adds a table to the database schema.
```php
public Schema addTable(TableInterface $table)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$table`* | `TableInterface` | The table to add to database schema.
 
Return   | Description  
---------| -----------
`Schema` | Current `Schema` instance, useful for method chaining.

---

#### `Schema::setTables()`
Sets the collection of tables for current schema.
```php
public Schema setTables(TableInterface[] $tables)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$tables`* | `TableInterfaces` | The tables collection for current database schema.
 
Return   | Description  
---------| -----------
`Schema` | Current `Schema` instance, useful for method chaining.