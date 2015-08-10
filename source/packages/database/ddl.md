---
layout: base
activeMenu: documentation
title: Slick database package - DDL statements
contentsMenu: database/ddl
previous:
    url: /packages/database/crud
    title: Insert, update and delete

---

<div id="create-table"></div>

# Data Definition Language (DDL) statements

---

With `Slick\Database\Sql` it is also possible to create DDL queries for database structure
manipulation.

## Create table

---

Lets start by creating a simple table.

```php
use Slick\Database\Adapter;
use Slick\Database\Sql\Ddl\Column;
use Slick\Database\Sql\Ddl\Constraint;
use Slick\Database\Sql\Ddl\CreateTable;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$usersTable = new CreateTable('users');
$users->setAdapter($adapter);

$usersTable
    ->addColumn(new Column\Integer('id', ['autoIncrement' => true, 'size' => Size::big()]))
    ->addColumn(new Column\Text('name', ['size' => Size::tiny()]))
    ->addColumn(new Column\Varchar('username', 255))
    ->addColumn(new Column\Varchar('password', 128))
    ->addColumn(new Column\Boolean('active'));
```

To execute this query you need to do the following:

```php
$usersTable->execute();
// Or
$adapter->execute($usersTable);
```

The code above will create and execute the following SQL:

```sql
## MySQL example
CREATE TABLE uses (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(128) NOT NULL,
    active BOOLEAN
);    
```
As you can see creating a table is in fact very similar to writing a SQL CREATE TABLE statement:
You set the tables name ans add the columns you need.

### Column definition

---
You can use a very basic set of column definitions when creating/changing your tables with
DDL statements. The following table shows the available `Slick\Database\Sql\Ddl` column definitions:

Column type                                                     | MySql    | SQLIte
----------------------------------------------------------------|----------|--------
Integer(name, [nullable, size, autoIncrement, length, default]) | INT      | INTEGER
Text(name, [nullable, size])                                    | TEXT     | TEXT
Varchar(name, length)                                           | VARCHAR  | VARCHAR
Boolean(name)                                                   | BOOL     | INTEGER
Decimal(name, precision)                                        | FLOAT    | FLOAT
DateTime(name, [nullable])                                      | DATETIME | TEXT
Blob(name, length, [nullable, default])                         | BLOB     | BLOB

### Constraints

---
It is also possible to add constraints to your `CreateTable` statement object. Lets recap the
users create table statement we have been working with and add some constraints:

```php
// ...
$usersTable
    ->addColumn(new Column\Integer('id', ['autoIncrement' => true, 'size' => Size::big()]))
    ->addColumn(new Column\Text('name', ['size' => Size::tiny()]))
    ->addColumn(new Column\Varchar('username', 255))
    ->addColumn(new Column\Varchar('password', 128))
    ->addColumn(new Column\Boolean('active'))
    
    ->addConstraint(new Constraint\Primary('pkUsers', ['columnNames' => ['id']]))
    ->addConstraint(new Constraint\Unique('usernameUnique', ['column' => 'username']));
```

Now you have a more realistic table definition with a primary key and a unique index.

`Slick\Database\Sql\Ddl` has the following constraints defined:

#### `PrimaryKey`
Creates a Primary Key constraint
```php
public PrimaryKey __construct($name[, array $options=[]])
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$name`* | `string` | Primary key index name.
 *`$options`* | `array` | Constraint options.
 
Option      | Type              | Description
------------|-------------------|------------------------------------------------
columnNames | `string|string[]` | The column or columns in the primary key index.

#### `Unique`
Creates a Unique constraint
```php
public Unique __construct($name[, array $options=[]])
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$name`* | `string` | Primary key index name.
 *`$options`* | `array` | Constraint options.
 
Option | Type     | Description
-------|----------|------------------------------------------------
column | `string` | The column name that will have unique values.

#### `ForeignKey`
Creates a foreign key constraint
```php
public ForeignKey __construct($name, $column, $referenceTable, $referenceColumn[, array $options=[]])
``` 
Parameters            | Type     | Description 
----------------------|----------|-------------
 *`$name`*            | `string` | Primary key index name.
 *`$column`*          | `string` | The column name that stores the foreign key.
 *`$referenceTable`*  | `string` | Reference table name.
 *`$referenceColumn`* | `string` | Reference column name.
 *`$options`*         | `array`  | Constraint options.
 
Option   | Type     | Description
---------|----------|------------------------------------------------
onDelete | `string` | On delete referential action.
onUpdate | `string` | On update referential action.

<div id="alter-table"></div>
## Alter table

---

Changing a table structure is done in a similar way:

```php
use Slick\Database\Adapter;
use Slick\Database\Sql\Ddl\Column;
use Slick\Database\Sql\Ddl\Constraint;
use Slick\Database\Sql\Ddl\AlterTable;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$alterUsers = new AlterTable('users');
$alterUsers->setAdapter($adapter);

$alterUsers
    ->addColumn(new Column\DateTime('created'))             // Adds a column
    ->changeColumn(new Column\Varchar('username', '128'))   // Changes existing column
    ->dropColumn(new Column\Boolean('active'));              // Drops a column
    
```

`AlterTable::addColumn()`, `AlterTable::changeColumn()` and `AlterTable::dropColumn()` accept
a column interface definition to do its job. You can refer to the Column definitions above
for a full list of definitions.

You can also add or drop a constraint.
 
```php
$alterUsers
    ->addColumn(new Column\Integer('profile_id', ['size' => Size::big()])) // Adds a column
    ->changeColumn(new Column\Varchar('username', '128'))   // Changes existing column
    ->dropColumn(new Column\Boolean('active'));             // Drops a column
    
    ->dropConstraint(new Constraint\Unique('usernameUnique')) // Drops a constraint
    // Add a new constraint
    ->addConstraint(
        new Constraint\ForeignKey(
            'profile_fk',
            'profile_id',
            'profiles',
            'id',
            [
                'onDelete' => Constraint\ForeignKey::CASCADE
            ]
        )
    );
    
```

Note that `AlterTable::addConstraint()` and `AlterTable::dropConstraint()` accepts a 
constraint interface to do its job. Please refer to the constraint definitions above
for a complete constraint creation reference.

To execute this query you need to do the following:

```php
$alterUsers->execute();
// Or
$adapter->execute($alterUsers);
```

The code above will create and execute the following SQL:

```sql
## MySQL example
ALTER TABLE users
    ALTER COLUMN (name VARCHAR(255) NOT NULL, username VARCHAR(128) NOT NULL);
ALTER TABLE users DROP COLUMN (active); 
ALTER TABLE users ADD (profile_id BIGINT NOT NULL);
ALTER TABLE users DROP CONSTRAINT (uniqueName);
ALTER TABLE users
    ADD CONSTRAINT profile_fk FOREIGN KEY (profile_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE;
```

Note that the SQL is not a single sentence. Changes are done multiple times according to
the nature of the operation. A foreign key for example will only be added after a column.
This way it tries to avoid the constraint creation error of missing fields when you define
those fields in the same alter table object. 

<div id="drop-table"></div>
## Drop table

---
To drop a table you only need to specify the table name and run the SQL query:

```php
use Slick\Database\Adapter;
use Slick\Database\Sql\Ddl\DropTable;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$dropUsers = new DropTable('users');
$dropUsers->setAdapter($adapter);

$dropUsers->execute();

// Or

$adapter->execute($dropUsers);

```

The code above will create and execute the following SQL:

```sql
## MySQL example
DROP TABLE users;
```

<div id="create-index"></div>
## Create index

---

Times are you need to create an index on an existing table. `CreateIndex` will
help you with this task:

```php
use Slick\Database\Adapter;
use Slick\Database\Sql\Ddl\CreateIndex;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$index = new CreateIndex('usernameIdx', 'users');
$index->setColumns('username');

$index->setAdapter($adapter);

$index->execute();

// Or

$adapter->execute($index);

```
The code above will create and execute the following SQL:

```sql
## MySQL example
CREATE INDEX usernameIdx ON users (username);
```

<div id="drop-index"></div>
## Drop index

---

Drop an index on a given table is also simple. Use the `DropIndex` to do it:
```php
use Slick\Database\Adapter;
use Slick\Database\Sql\Ddl\DropIndex;

$adapter = Adapter::create(
    [
        'driver'  => Adapter::DRIVER_SQLITE,
        'options' => [
            'file' => 'my.db'
        ]
    ]
);

$dropIndex = new DropIndex('usernameIdx', 'users');

$dropIndex->setAdapter($adapter);

$dropIndex->execute();

// Or

$adapter->execute($dropIndex);

```

The code above will create and execute the following SQL:

```sql
## MySQL example
DROP INDEX test ON tasks;
```
