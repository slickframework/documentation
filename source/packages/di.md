---
layout: base
activeMenu: documentation
title: Slick dependency Injection/Container package - Container
contentsMenu: di/container

---

<div id="container"></div>

# Dependency injection

---

Dependency injection (DI) is a concept that has been talked about all over the web.
You probably have done it without knowing that is called _dependency injection_. Simply put
the next line of code can describe what it is:

```php
$volvo = new Car(new Engine());
```

Above, `Engine` is a dependency of `Car`, and `Engine` was injected into `Car`. If you are
not familiar with _Dependency Injection_ please read this [Fabien Pontencier's great series
about on DI](http://fabien.potencier.org/what-is-dependency-injection.html).

## Dependency Injection Container

---

Dependency injection and dependency injection containers are tow different things.
Dependency injection is a design pattern that implements
[inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) for
resolving dependencies. On the other hand _Dependency Injection Container_ (DiC) is a tool
that will help you create, reuse and inject dependencies.

DiC can also be used to store object instances that you create and values that you may
need to use repeatedly like configuration settings.

Lets look at a very simple example:

```php
use Slick\Di\ContainerBuilder;

$definitions = [
    'config.environment' => 'develop'
];

$container = (new ContainerBuilder($definitions))->getContainer();

print $container->get('config.environment'); // Will print 'develop'
```

In this code example we create a DiC with a single definition under the `config.environment` key/name
and retrieve it latter. For that we use the `ContainerBuilder` factory that need an array or a file
name with an array of definitions that can be use to create our dependencies.

This is not a big deal so far as you are probably saying that you can achieve the same result with a 
global variable. In fact storing values or object instances in a container is the simplest feature
of a DiC and a _side effect_ as the main goal is to store definitions that can be used to create
the real objects when we need them.

But lets first understand what a definition is and how to set them in your container.

## Definitions

---

