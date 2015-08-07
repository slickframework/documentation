---
layout: base
activeMenu: documentation
title: Slick common package - Enumerations
contentsMenu: common/enumerations-menu
previous:
    url: /packages/common/utilities
    title: Utilities
---

# Enumerations

---

`Slick\Common` package comes with a basic implementation of `Enumerations` that gives
you the ability to emulate and create enumeration objects natively in PHP. It uses the
[`myclabs/php-enum`](https://github.com/myclabs/php-enum) package created
by [Matthieu Napoli](https://github.com/mnapoli).
[`myclabs/php-enum`](https://github.com/myclabs/php-enum)
is a "_PHP Enum implementation inspired from SplEnum_".

The main reason for this implementation is that `SplEnum` is not integrated to PHP, 
you have to install it separately, so by installing `Slick\Common` package you
have enumerations in your project without the need to install the SPL extension.

<div id="enumerations"></div>
## Declaration

---

Creating a `Enum` object is ver simple: if you used to create class constants you
already now every thing.

```php
use Slick\Common\Utils\Enum;

/**
 * Size enum
 */
class Size extends Enum
{
    const SMALL  = 'small';
    const MEDIUM = 'medium';
    const BIG    = 'big';
}

```

<div id="usage"></div>

## Usage

---

```php
$size = new Size(Size::MEDIUM);

// or

$size = Size::Medium();

```

As you can see, static methods are automatically implemented to provide
quick access to an enum value.

<div class="alert alert-info" role="alert">
    <h4>
        <i class="fa fa-info "></i>
        Note
    </h4>
    
    The static method names use a convention so that you can call <code>Size::Medium()</code>
    and it returns the <code>Size</code> with <code>Size::MEDIUM</code> value.<br>
    As you know the PSR-1 says that
    <a href="http://www.php-fig.org/psr/psr-1/#4-1-constants">constants</a>
    <i>MUST be declared in all upper case with underscore separators.</i> The <code>Enum</code>
    class uses that convention to match the constant names to methods names.
    For example <code>MY_CONST</code> can be mapped from <code>MyConst</code> or
    <code>myConst</code>.
</div>

One advantage over using class constants is to be able to type-hint enum values:

```php
function setSize(Size $size)
{
    // ...
}

```
Static method helpers are implemented using 
[__callStatic()](http://www.php.net/manual/en/language.oop5.overloading.php#object.callstatic).

If you care about IDE autocompletion, you can either implement the static methods yourself:

```php
use Slick\Common\Utils\Enum;

/**
 * Size enum
 */
class Size extends Enum
{
    const SMALL  = 'small';
    
    /**
     * @return Size
     */
    public static function small()
    {
        return new Size(self::SMALL);
    }
}
```

or you can use phpdoc (this is supported in PhpStorm for example):

```php
use Slick\Common\Utils\Enum;

/**
 * Size enum
 *
 * @method static Size small()
 * @method static Size medium()
 * @method static Size big()
 */
class Size extends Enum
{
    const SMALL  = 'small';
    const MEDIUM = 'medium';
    const BIG    = 'big';
}
```

<div id="methods"></div>

## Methods

---

### `Enum::getValue()`

Gets the actual enumeration value

```php
public mixed getValue()
```
Return       | Description
------------ | -----------
`mixed` | The enumeration value.

---
### `Enum::getKey()`
Returns the enum key (i.e. the constant name).

```php
public mixed getKey()
```

Return       | Description
------------ | -----------
`mixed` | The enum key (i.e. the constant name).

---
### `Enum::keys()`

Returns the names (keys) of all constants in the Enum class

```php
public static array keys()
```

Return       | Description
------------ | -----------
`mixed` | The names (keys) of all constants in the Enum class.

---
### `Enum::values()`

Returns instances of the Enum class of all Enum constants

```php
public static array values()
```
Return       | Description
------------ | -----------
`mixed` | Constant name in key, Enum instance in value

---
### `Enum::toArray()`

Returns all possible values as an array

```php
public static array toArray()
```

Return       | Description
------------ | -----------
`mixed` | Constant name in key, constant value in value

---
### `Enum::isValid()`

Check if is valid enum value

```php
public static boolean isValid(mixed $value)
```
 Parameters   | Type     | Description 
--------------|----------|-------------
 *`$value`*  | `mixed` | The value to evaluate.
 
Return       | Description
------------ | -----------
`boolean` | True if it has a defined constant with provided value, false otherwise.

---
### `Enum::isValidKey()`

Check if is valid enum key

```php
public static boolean isValidKey(string $key)
```
 Parameters   | Type     | Description 
--------------|----------|-------------
 *`$key`*  | `string` | The key to check.
 
Return       | Description
------------ | -----------
`boolean` | True if it has a defined constant name with provided key, false otherwise.

---
### `Enum::search()`

Return the key (constant) for provided value

```php
public static string search(mixed $value)
```
 Parameters   | Type     | Description 
--------------|----------|-------------
 *`$value`*  | `mixed` | The value to evaluate.
 
Return       | Description
------------ | -----------
`string` | The Enum key (constant) name.