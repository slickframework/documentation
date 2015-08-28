---
layout: base
activeMenu: documentation
title: Slick configuration package
contentsMenu: configuration/base-menu
    
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
<?php

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
# [
#      "bar" => "baz"
# ]
```

To work with a configuration driver you can use the following API:

#### `ConfigurationInterface::get()`
Returns the value store with provided key or the default value.
```php
public mixed get(string $key[, mixed $default = null])
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$key`* | `string` | The key used to store the value in configuration.
 *`$default`* | `mixed` | Default value if no value was stored.

Return   | Description  
---------| -----------
`mixed`  |  The stored value or the default value if key was not found.

---

#### `ConfigurationInterface::set()`
Set/Store the provided value with a given key.
```php
public ConfigurationInterface set(string $key, mixed $value)
``` 
Parameters      | Type     | Description 
----------------|----------|-------------
 *`$key`* | `string` | The key used to store the value in configuration.
 *`$value`* | `mixed` | The value to store under the provided key.
 
Return   | Description  
---------| -----------
`ConfigurationInterface`  |  Self instance for method call chains.