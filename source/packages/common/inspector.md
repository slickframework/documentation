---
layout: base
activeMenu: documentation
title: Slick common package - Inspector
---

# Inspecting classes

Slick common package comes with a simple class inspector utility. It is used
to retrieve class information data such as methods, properties, comments and
annotations you may have in your doc block comments. It uses the PHP
`ReflectionClass` to get its data.

Lets create a simple class to inspect:

```php
use Slick\Common\Inspector;

class Car extends Base
{

    /**
     * @readwrite
     * @var string
     */
    protected $brand;
    
    private $engine;
    
    /**
     * Starts car engine
     *
     * @return Car
     */
    public function start()
    {
        $this->engine = "running";
        return $this;
    }
}

```

To create an inspector for `Car` class you can do the following:

```php
$inspector = Inspector::forClass('Car');
```

or if you already have an car object the you can do:

```php
$car = new Car(['brand' => 'Renault'])
$inspector = Inspector::forClass($car);
```

Both ways will create and reuse a single inspector class for class `Car`
where you can retrieve information from.

<div class="alert alert-info" role="alert">
    <h4>
        <i class="fa fa-info "></i>
        Note
    </h4>
    
    The factory method <code>Slick\Common\Inspector::forClass()</code> ensures
    that a single <code>Inspector</code> instance is created per class
    requested for entire PHP script life time. This way it improves performance
    and reduces the amount of memory needed for large object collections.
</div>

## Getting class members

with our inspector we now can get `Car` class information we need to work with
with some simple getters:

```php
print_r($inspector->getClassProperties());

// will output:
# Array
# (
#      [0] => brand
#      [1] => engine
# )

print_r($inspector->getClassMethods());

// will output:
# Array
# (
#      [0] => start
# )

```