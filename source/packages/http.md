---
layout: base
activeMenu: documentation
title: Slick HTTP package
contentsMenu: http/session

---

<div id="session"></div>

# HTTP

---

`Slick/Http` package is a set of HTTP protocol related libraries for web application
development. It implements the PSR-7 message interface, for dealing with HTTP requests
and responses, Session and HTML Forms.

## Session drivers

---

Working with session is very simple. The `SessionDriverInterface` defines methods to
set, get and erase session values and the `Session` factory class makes it easy to
create them.

Lets start by creating a session driver using the `Session` factory:

```php
use Slick/Http/Session;

$session = Session::Create();
```

As you can see, it is very easy to have a session driver to work with. But what is the driver
we have just created?

Well `Slick/Http/Session` by default creates the `Server` driver witch is a wrapper to
the PHP default session handling. We may change some settings to the driver, for example
the session cookie name, the domain, etc. This options can be passed to the 
`Session::create()` method as an associative array.

```php
use Slick/Http/Session;

$session = Session::Create(
    Session::DRIVER_SERVER,
    [
        'prefix' => '_MyApp_',
        'name' => 'my-app-session'
    ]
);
```

Available options are:

 Option   | Type   | Description
----------|--------|-----------------------------------------
 prefix   | string | A prefix string used with session keys.
 name     | string | The name of the session cookie.
 domain   | string | Domain for the session cookie.
 lifetime | int    | The session cookie lifetime in seconds.
 
<div id="driver"></div>

## Session Driver API

---

### `SessionDriverInterface::get()`
___

```php
public mixed get(string $key[, mixed $default = null]) 
```

Returns the value store with provided key or the default value.

 Parameters   | Type     | Description 
--------------|----------|---------------------------------------------
 *`$key`*     | `string` | The key used to store the value in session.
 *`$default`* | `mixed`  | The default value if no value was stored.
 
Return  | Description
--------|------------------------------------------------------------
`mixed` | The stored value or the default value if key was not found.


### `SessionDriverInterface::set()`
___

```php
public SessionDriverInterface set(string $key, mixed $value) 
```

Set/Stores a provided values with a given key.

 Parameters | Type     | Description 
------------|----------|---------------------------------------------
 *`$key`*   | `string` | The key used to store the value in session.
 *`$value`* | `mixed`  | The value to be stored under the provided key.
 
Return  | Description
--------|------------------------------------------------------------
`SessionDriverInterface` | Self instance for method call chains.

### `SessionDriverInterface::erase()`
___

```php
public SessionDriverInterface erase(string $key) 
```

Erases the values stored with the given key.

 Parameters   | Type     | Description 
--------------|----------|---------------------------------------------
 *`$key`*     | `string` | The key used to store the value in session.
 
Return  | Description
--------|------------------------------------------------------------
`SessionDriverInterface` | Self instance for method call chains.
