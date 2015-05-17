---
layout: base
activeMenu: documentation
title: Slick common package - Utilities
contentsMenu: common/utilities-menu
previous:
    url: /packages/common/custom-annotations
    title: Annotations
    
---

# Utilities

`Slick\Common` package comes with a set of handy utility classes that are normally
use on almost every application you may develop.
We have decided to include in the common package so that you don't have to include
them one by one in your composer file.

<div id="log"></div>

## Log

All important things your application do should be logged. If you don't log your
application activity, specially that one you cannot know in any other way, you
will sooner or later be on a situation where your users are reporting errors
and you can't understand why and when they appended. So you should log every
important activity so that you can measure your application when its in the
real use and trace those strange errors.

In the `Slick\Common` package we create a simple proxy class that uses the
[*Monolog*](https://github.com/Seldaek/monolog) library.

```php

use Monolog\Handler\StreamHandler;
use Slick\Common\Log;

// create a log channel
$logger = Log::getLogger('name');
$logger->pushHandler(new StreamHandler('path/to/your.log', Logger::WARNING));

// add records to the log
$log->addWarning('Foo');
$log->addError('Bar');

```

Every Logger instance has a channel (name) and a stack of handlers. Whenever
you add a record to the logger, it traverses the handler stack. Each handler
decides whether it fully handled the record, and if so, the propagation of
the record ends there.

`Slick\Common\Log` acts like a factory that will create or reuse the logger
set with the specified chanel name.

Please refer to the [*Monolog*](https://github.com/Seldaek/monolog) documentation
site for more information on logs.