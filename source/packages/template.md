---
layout: base
activeMenu: documentation
title: Slick Template package - Template Engine
contentsMenu: template/template

---

<div id="create-engine"></div>

# Template Engine

---

Slick Template is a simple wrapper to a template engine of your choice. It defines
simple interfaces that allow you to create your own PHP template engines.
It comes with Twig template engine implementation, a flexible, fast, and secure
template engine for PHP.

To use the template you need to configure the locations where your template files
will live.

`Slick\Template` allows you to define multiple locations and it will search all of
them to match the one you are using or importing.

```php
use Slick\Template\Template;
Template::addPath('/path/to/twig/files');
```

By default the template factory is configured with `./` location and the
`Template::addPath()` will add the path to the top of the locations list.

Is case of template name duplication it will use the first match when iterating
trough the locations list.
 
It is also possible to add a path to the bottom of the locations list:

```php
use Slick\Template\Template;
Template::appendPath('/path/to/other/twig/files');
```

Those locations will be passed to the template engine when it is initialized.
Lets create out template engine:

```php
use Slick\Template\Template;

$twig = new Template(['engine' => Template::ENGINE_TWIG]); // This is optional for twig. If you have
$twig = $twig->initialize();                               // implemented TemplateEngineInterface then
                                                           // you have to specify your FQ class name here.
```

<div id="use-twig"></div>

## Using twig engine

---

Lets create a sample `index.html.twig` file in the folder that was
previously configured.

```twig
<h1>{% verbatim %}{{ post.title }}{% endverbatim %}</h1>
<p>{% verbatim %}{{ post.teaser|nl2br }}{% endverbatim %}</p>
```

<div class="alert alert-info" role="alert">
    <h4>
        <i class="fa fa-info "></i>
        Info
    </h4>
    
All documentation and API for twig can be accessed in the
<a href="http://twig.sensiolabs.org/">Twig project home page</a>.
</div>

Now lets grab some data and create the HTML output using the _twig_ template:

```php
$data = (object) [
    'title'  => 'Sample blog post',
    'teaser' => 'Sample teaser for the blog post.'
];

$html = $template
    ->parse('index.html.twig')      // Will search file in locations lists
    ->process($data);               // Will process the template file with data

```

Output:

```html
<h1>Sample blog post</h1>
<p>Sample teaser for the blog post.</p>
```

<div id="built-in"></div>

## Built-in extensions

---

`Slick\Template` has 2 built-in extensions: I18n and Text.
This gives you translations capabilities to your templates and `truncate` and `wordwrap`
features to text.

Lets see examples:

```twig
<h1>{% verbatim %}{{ post.title|truncate(25, '...') }}{% endverbatim %}</h1>
<p>{% verbatim %}{{ translate("Once upon a time...") }}{% endverbatim %}</p>
```

### `I18n::translate()` twig function
___

```twig
translate($message[, [$domain = null], [$locale = null]])
```

Translates provided message.

Parameters  | Type     | Description 
-------------|----------|-------------
 *`$message`*   | `string` |  Message to translate.
 *`$domain`*   | `string` |  The messages domain for translation
 *`$locale`*   | `string` |  The locale (language) code for translation
 
 

Return    | Description
--------- | -----------
`string` | Translated string

### `I18n::transPlural()` twig function
___

```twig
transPlural($singular, $plural, $count[, [$domain = null], [$locale = null]])
```

Provides plural translation.

Parameters  | Type     | Description 
-------------|----------|-------------
 *`$singular`*   | `string` |  Singular version of the message
 *`$plural`*   | `string` |  Plural version of the message
 *`$count`*   | `integer` |  The number of elements for plural definition
 *`$domain`*   | `string` |  The messages domain for translation
 *`$locale`*   | `string` |  The locale (language) code for translation
 
 

Return    | Description
--------- | -----------
`string` | Translated plural/singular string

### `Text::truncate()` twig filter
___

```twig
truncate($text[, $length = 75, $terminator = '...', $preserve = false])
```

Truncates the provide text to a given number of characters.

Injected  | Type     | Description 
-------------|----------|-------------
 *`$text`*   | `string` |  The text to truncate
 
Parameters  | Type     | Description 
-------------|----------|------------- 
 *`$length`*   | `integer` |  The number of characters where text will be truncated
 *`$terminator`*   | `string` |  Text that will be added to the end of the truncated text if the text length is higher then the values specified in the `$length` parameter.
 *`$preserve`*   | `boolean` |  If set to true the world will be preserved truncating the initial text in the next available space character.
 
Return    | Description
--------- | -----------
`string` | The initial text truncated.

### `Text::wordwrap()` twig filter
___

```twig
wordwrap($text[, $length = 75, $break = "\n", $cut = false])
```

Wraps the provide text to a given number of characters.

Injected  | Type     | Description 
-------------|----------|-------------
 *`$text`*   | `string` |  The text to wrap

Parameters  | Type     | Description 
-------------|----------|------------- 
 *`$length`*   | `integer` |  The number of characters where text will be wrapped
 *`$break`*   | `string` |  The braking line character to add. With HTML for example use the `'<br>'`.
 *`$cut`*   | `boolean` |  If set to true the words will be cut at the wrap position. The default is to cut in the space before the wrap length.

Return    | Description
--------- | -----------
`string` | The initial text wrapped.