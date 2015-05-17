---
layout: base
activeMenu: documentation
title: Slick common package - Custom Annotations
contentsMenu: common/custom-annotations
previous:
    url: /packages/common/annotations
    title: Annotations
next:
    url: /packages/common/utilities
    title: Utilities
---

# Custom annotations

Despite the basic annotations that you can use out of the box from `Slick\Common`
package you can also create your own annotations to implement a specific need.
`Slick\Common\AnnotationInterface` is a very simple interface that can work with
`Slick\Common\Inspector` to retrieve your annotations.

You can also extend the `Slick\Common\Annotation\Basic` class to just implement
what you what you want.

<div id="simple-example"></div>

## A simple example

One common use case for creating custom annotations is to define the default
values for the annotation parameters. Lets create an example.

```php
namespace Models;

use DateTime;
use Filters/Annotation/Date;

class Event
{

    /**
     * @Date default=now
     * @var string|DateTime
     */
    protected $date;
    
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }
    
}
```

Now if you look to the `Event::$date` property comment you will see that we used a
`@Date` annotation and we include our custom annotation in the `use` statement.

So our custom annotation `Filters/Annotation/Date` will look like this:


```php
namespace Filters/Annotation;

use DateTime;
use Slick\Common\Annotation\Basic;

class Date extends Basic
{

    /**
     * Override the parameters to set the defaults
     * @var array
     */
    protected $parameters = [
        'timeZone' => UTC,
        'default' => 'now'
    ];
    
}
```

This is a basic annotation that we will use to retrieve a `DateTime` object form the string
that we use to set the `Event::$date` property.

The getter implementations will look something like this:

```php
use DateTime;
use Filters/Annotation/Date;
use Slick\Common\Inspector;

class Event
{

    ...
    
    public function getDate()
    {
        $annotation = Inspector::forClass($this)
            ->getPropertyAnnotations('date')
            ->getAnnotation('@Date');
            
        $val = $this->date;    
        if (is_null($this->date)) {
            $val = $annotations->getParameter('default');
        }
        
        $tz = new \DateTimeZone($annotation->getParameter['timeZone']);
        
        return new DateTime($val, $tz);
    }

}
```

Very simple right!? We first get the annotations witch is an instance of
`Filters/Annotation/Date`, then we check the `Event::$date` value and if its
not set yet we use the annotation default parameter.

Finally we create the timezone object from the timeZone parameter in the
annotation and return a new `DateTime` object.

Of course that this is not so useful if you only use the `Models\Event` and you
are probably saying that "I can do this without this _annotations_ thing!", and yes
you are right. But check the next example:

```php
namespace models;

use DateTime;
use Filters/Annotation/Date;

class RockInRioLisbon extends Event
{
    /**
     * @Date timeZone=Europe/Lisbon
     * @var string|DateTime
     */
    protected $date;
}
```

This is a very simple example on how to create a custom annotation and used it
in your class.

The use of annotations makes sense when you have classes that extends from a base
class and you want to modulate the behavior on those child classes. It can be useful
also if you have a filter class tha will change the a given object based on the
annotations you have in its class definition.
Either way, `Slick\Common` package offers a very lightweight API where you can
implement annotations in your code. 