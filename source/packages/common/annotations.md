---
layout: base
activeMenu: documentation
title: Slick common package - Annotations
---

# Annotations

`slick/Common` package has a very simple annotations system that is used to
handle the `@read`, `@write` and `@readwrite` annotations used by
`slick\Common\BaseMethods` trait to define the access mode to protected 
properties.

It is also possible to use any comment tag and retrieve it from your classes
without the need to create any additional code.

See how easy is to use a basic annotation in you class:

```php
use Slick\Common\Base;

class Car extends Base
{
    /**
     * @readwrite
     * @var string
     */
    protected $brand;
    
    /**
     * @read
     * @var boolean Car engine state
     */
    protected $running = false;
    
    /**
     * @var string
     * @defaultState stopped, available=[idle, running, stopped]
     */
    private $engine;
}
```

Take a closer look to `Car::$engine` comment block to the `@default` tag that
we have just added.

## Anatomy of an Annotation

An annotation is a simple doc block tag tar will be converted to an
`Slick\Common\AnnotationInterface` when you run 
`Slick\Common\Inspector` on it.

The following table will describe each part of an annotation:

| @defaultState | stopped,      | available=[idle, running, stopped] |
|---------------|---------------|------------------------------------|
| name          | default value | other parameters you may set       |

When you use `Slick\Common\Inspector` to retrieve an annotation it will return
a `Slick\Common\Annotation\Basic` instance from where you can retrieve all the
values you write on the comment tag.

### `Basic::getName()`
___

Returns the annotation tag name

```php
public string getName() 
```
Return   | Description
-------- | -----------
`string` | The tag name without the leading "@" character

### `Basic::getValue()`
___

Returns the annotation main value

```php
public string|boolean getValue() 
```
Return        | Description
--------------|------------
`string|true` | Returns the annotation value or the boolean true if no value was present in the tag

```php

$inspector = Inspector::forClass('Car');

$annotations = $inspector->getPropertyAnnotations('running');
var_dump($annotations->getAnnotation('@read')->getValue()):
# output will be (Boolean) true

$annotations = $inspector->getPropertyAnnotations('engine');
print $annotations->getAnnotation('@defaultState')->getValue()
# output will be "stopped"

```

### `Basic::getParameter()`
___

Returns the value of a specific parameter

```php
public mixed|null getParameter(string $name) 
```

 Parameters  | Type     | Description 
-------------|----------|-------------
 *`$name`*   | `string` | The parameter name as it is in the comment tag


Return       | Description
-------------|------------
`mixed|null` | Returns the parameter value or the NULL value if the parameter is not set

```php

$inspector = Inspector::forClass('Car');

$annotations = $inspector->getPropertyAnnotations('engine');
print_r($annotations->getAnnotation('@defaultState')->getParameter('available'));
# output will be
# Array
# (
#      "idle",
#      "running",
#      "stopped"
# )
```

The annotations parser can parse several formats and return its real values. In
the example above, you see a way of defining an array os strings within the 
comment tag (`... , available=[idle, running, stopped]`).

In the following table you can see all possible values for a given parameter:

| Type        | Description          | Example
|-------------|----------------------|----------
| *`string`*  | Plain text string    | parameter=value
| *`string[]`*| Array of strings     | name=[foo, bar, baz]
| *`object`*  | JSON notation object | name={"a":1, "b": "baz"} `*`
| *`boolean`* | Boolean value        | parameter=false | parameter `**`
| *`integer`* | Integer number       | parameter=300
| *`float`*   | Float number         | parameter=25.25
| *`null`*    | Null value           | parameter=null

&nbsp;`*`: Must be a valid JSON formatted string<br>
`**`: No value will default to boolean true

## Using an Annotation

Now that you have a better understanding of an Annotation and how to set it in
your class, lets create a basic usage to make it clear on how to use
annotations.

`Slick\Common\Base` class uses an inspector to do its job and we will reuse
it to retrieve our annotation to create a more interesting engine state
getter and setter in our `Car` class.
 
```php
use Slick\Common\Base;

class Car extends Base
{
    // Other class properties
    
    /**
     * @read
     * @var string
     * @defaultState stopped, available=[idle, running, stopped]
     */
    protected $engine;
    
    public function getEngineState()
    {
        if (is_null($this->engine) {
            $this->engine = $this->getInspector()
                ->getPropertyAnnotations('engine')
                ->getAnnotation('@defaultState')
                ->getValue();
        }
        return $this->engine;
    }
    
    public function setEngineState($state)
    {
        $states = $this->getInspector()
            ->getPropertyAnnotations('engine')
            ->getAnnotation('@defaultState')
            ->getParameter('available');
        
        if (!in_array($state, $states) {
            throw new \Exception("Invalid state");
        }
        
        $this->engine = $state;
        return $this;
        
    }
}

// Lets define an electric car that has one more state: charging

class ElectricCar extends Car
{

    /**
     * @read
     * @var string
     * @defaultState stopped, available=[idle, running, stopped, charging]
     */
    protected $engine;
}

$myCar = new Car();
$futureCar = new ElectricCar();

# this will work just fine
$futureCar->setEngineState('charging');

# this will throw an exception
$myCar->setEngineState('charging');

```

{% include 'disqus' %}