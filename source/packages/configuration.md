---
layout: base
activeMenu: documentation
title: Slick configuration package
contentsMenu: configuration/base-menu
previous:
    url: /packages/common/enumerations
    title: Enumerations
next:
    url: /packages/database
    title: Database Adapter   
---

<div id="load-config"></div>

# Configuration Package

---

`Slick/Configuration` is a simple package that deals with configuration files. It has a very simple
interface that you can use to set your own configuration drivers. By default it uses the PHP arrays
for configuration as it does not need any parser and therefore is more performance friendly.

## Working with configuration files

---

First lets create a configuration file:

```php
return [
    'foo' => [
        'bar' => 'baz'
    ]
];
```

we save this file as `./config.php`.
 
Now all you have to do is to use the `Slick\Configuration\Configuration` factory class to create
your configuration driver object.

```php
use Slick\Configuration\Configuration;

$configuration = Configuration::get('config');
``` 

Its really simple. Now lets use it.

```php
print_r($configuration->get('foo', false));

# this will output
# Array (
#     [bar] => baz
# )
```

To work with a configuration driver you can use the following API:

#### `ConfigurationInterface::get()`
Returns the value store with provided key or the default value.
```php
public mixed get(string $key[, mixed $default = null])
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$key`*       | `string` | The key used to store the value in configuration.
 *`$default`*   | `mixed`  | Default value if no value was stored.

Return   | Description  
---------|-----------
`mixed`  | The stored value or the default value if key was not found.

---

#### `ConfigurationInterface::set()`
Set/Store the provided value with a given key.
```php
public ConfigurationInterface set(string $key, mixed $value)
``` 
Parameters  | Type     | Description 
------------|----------|-------------
 *`$key`*   | `string` | The key used to store the value in configuration.
 *`$value`* | `mixed`  | The value to store under the provided key.
 
Return                    | Description  
--------------------------|-----------
`ConfigurationInterface`  | Self instance for method call chains.

Lets add another entry to the configuration file above:
```php
return [
    'foo' => [
        'bar' => 'baz',
        'other' => [
            'level' => 'value'
        ]     
    ]
];
```
You can set any level of nesting in your configuration array but as you on
adding another level to the array it becomes harder to use.
```php
$value = $configuration->get('foo')['other']['level'];
// OR
$foo = $configuration->get('foo');
$value = $foo['other']['level'];
```
To simplify you ca use a "dot notation" to rich a deeper level.
```php
$value = $configuration->get('foo.other.level');
```

<br>&nbsp;
#### Other configuration drivers

---

`Slick\Configuration` comes with support for PHP arrays and _ini_ files. To set the
driver type you want to use just add it as a parameter to the factory method:


```php
use Slick\Configuration\Configuration;

$configuration = Configuration::get('config', Configuration::DRIVER_INI);
```

The above code will search for a file called `./config.ini` in the
current working directory and will parse it.

You can also create your own driver and use the `Slick\Configuration\Configuration`
factory to create it:

```php
use Slick\Configuration\Configuration;

$configuration = new Configuration(
    [
        'type' => 'My\Custom\Driver',
        'file' => 'Some/path/to/file.cfg'
    ]
);
$driver = $configuration->initialize();

// Or

$configuration = Configuration::get(
    '/Some/path/to/file.cfg',
    'My\Custom\Driver'
);
```

<br>&nbsp;
#### Configuration files path

By default the configuration factory will look into current working directory (`./`)
for configuration files. It is possible to add other paths to the factory and the
factory will look in those paths. For example:

```php
use Slick\Configuration\Configuration;

Configuration::addPath('/Some/path/to');

$configuration = Configuration::get(
    'file.cfg',
    'My\Custom\Driver'
);
```

The factory will try to load `./file.cfg` and `/Some/path/to/file.cfg`.