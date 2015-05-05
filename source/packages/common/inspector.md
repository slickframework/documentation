---
layout: base
activeMenu: documentation
title: Slick common package - Inspector
---

# The class inspector

`slick/Common` package comes with a simple class inspector utility. It is used
to retrieve class information data such as methods, properties, comments and
annotations you may have in your doc block comments. It uses the PHP
`ReflectionClass` to get its data.

Lets create a simple class to inspect:

```php
use Slick\Common\Base;
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

## Getting class elements

### `Inspector::getClassProperties()`
___

```php
public string[] getClassProperties() 
```

Retrieves the list of class property names

Return     | Description
---------- | -----------
`string[]` | An array of strings containing the class property names

### `Inspector::getClassMethods()`
___

```php
public string[] getClassMethods() 
```

Retrieves the list of class method names

Return     | Description
---------- | -----------
`string[]` | An array of strings containing the class method names

## Checking class elements

### `Inspector::hasMethod()`
___

```php
public boolean hasMethod(string $name) 
```

Checks if the method is defined in the inspected class

 Parameters  | Type     | Description 
-------------|----------|-------------
 *`$name`*   | `string` | The method name to check.

Return    | Description
--------- | -----------
`boolean` | True if method is defined in the inspected class

### `Inspector::hasProperty()` 
___

```php
public boolean hasProperty(string $name) 
```

Checks if the property is defined in the inspected class

 Parameters  | Type     | Description 
-------------|----------|-------------
 *`$name`*   | `string` | The property name to check.

Return    | Description
--------- | -----------
`boolean` | True if property is defined in the inspected class

## Retrieving class annotations

On of the main goals of `Slick\Common\Inspector` class it to retrieve
annotations from tags that you may write in the dock block comments.

Take a look on the following example:

```php
use Slick\Common\Base;
use Slick\Common\Inspector;

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
    
    private $engine;
    
    /**
     * Starts car engine
     *
     * @return Car
     */
    public function start()
    {
        $this->engine = "running";
        $this->running = true;
        return $this;
    }
}
```

Now lets check and retrieve some annotations

```php
$inspector = Inspector::forClass('Car');
$annotations = $inspector->getPropertyAnnotations('brand');

$annotation = null;

if ($annotations->hasAnnotation('@readwrite') {
    $annotation = $annotation->getAnnotation('@readwrite');
}
```

First we create an inspector for class `Car` then we call the
`Inspector::getPropertyAnnotations()` for `$brand` property to retrieve the
list of all annotations from `Inspector::$brand` doc block.

At this point we have a `Slick\Common\Annotation\AnnotationList` object
with is a collection of `Slick\Common\AnnotationInterface` objects that were
created from the tags present in comment block.

With `$annotations` we then check if there is an annotation from `@readwrite`
tag and retrieve it.

### `Inspector::getClassAnnotations()`
___

Retrieves the list of annotations from class comment block

```php
public AnnotationList getClassAnnotations() 
```
Return                                   | Description
---------------------------------------- | -----------
`Slick\Common\Annotation\AnnotationList` | A collection of all available annotations created from tags in class comment block.

### `Inspector::getPropertyAnnotations()`
___

Retrieves the list of annotations from a property comment block

```php
public AnnotationList getPropertyAnnotations(string $property) 
```

 Parameters  | Type     | Description 
-------------|----------|-------------
 *`$property`*   | `string` | The property name to where to look for comment annotation tags.

Return                                   | Description
---------------------------------------- | -----------
`Slick\Common\Annotation\AnnotationList` | A collection of all available annotations created from tags in property comment block.

|Throws ||
|-----------------------------------------||
| `Slick\Common\Exception\InvalidArgumentException` | If you trie to retrieve annotations of an property that was not defined. |  


### `Inspector::getMethodAnnotations()`
___

Retrieves the list of annotations from method comment block

```php
public AnnotationList getMethodAnnotations(string $method) 
```

 Parameters  | Type     | Description 
-------------|----------|-------------
 *`$method`*   | `string` | The method name to where to look for comment annotation tags.

Return                                   | Description
---------------------------------------- | -----------
`Slick\Common\Annotation\AnnotationList` | A collection of all available annotations created from tags in method comment block.

|Throws ||
|-----------------------------------------||
| `Slick\Common\Exception\InvalidArgumentException` | If you trie to retrieve annotations of an method that was not defined. |  

## Getting the class reflection

As I said before, `Slick\Common\Inspector` uses PHP `ReflectionClass` to
retrieve comments from were it creates the annotations. You can (re)use that
`reflectionClass` instance to do reflection related operations without the need
to create a new instance of it, improving your script performance.

### `Inspector::getReflection()`
___

Returns the PHP `ReflectionClass` used with provided class

```php
public ReflectionClass getReflection() 
```

Return            | Description
------------------|-------------
`ReflectionClass` | The reflection class used by inspector to retrieve class information.


{% include 'disqus' %}