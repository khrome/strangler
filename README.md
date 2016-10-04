<a name="module_strangler"></a>
strangler.js
===============

It's a string wrangler, and not nearly as dangerous as it sounds. A set of string utilities which expand those in [string-tools](https://www.npmjs.com/package/string-tools) with additional features.

Usage
-----
Often I do string parsing and I like some convenience functions to help out.

you can either retain an instance and use it that way:

    var stringTool = require('strangler');
    stringTool.contains(string, substring);
    
or you can just attach to the prototype (this can be OK in an app, but **is a bad idea in a library**):

    require('string-tools').proto();
	stringTool.contains(string, substring);

* [string-tools](https://www.npmjs.com/package/string-tools) + [strangler](#module_strangler)
  * [.proto()](#module_strangler.proto)
  * [.contains(str, target)](#module_strangler.contains) ⇒ <code>boolean</code>
  * [.beginsWith(str, target)](#module_strangler.beginsWith) ⇒ <code>boolean</code>
  * [.endsWith(str, target)](#module_strangler.endsWith) ⇒ <code>boolean</code>
  * [.splitHonoringQuotes(str, [delimiter], [quotes])](#module_strangler.splitHonoringQuotes) ⇒ <code>Array</code>
  * [.decompose(str, [delimiter], [quotes])](#module_strangler.decompose) ⇒ <code>Array</code>
  * [.multiLineAppend(str, appendStr)](#module_strangler.multiLineAppend) ⇒ <code>string</code>

<a name="module_string-tools.symbol"></a>
### proto()
assign these utilities to String.prototype and throw caution to the wind...

**Kind**: static property of <code>[strangler](#module_strangler)</code>  
<a name="module_strangler.contains"></a>
### .contains(str, candidate) ⇒ <code>boolean</code>
Tests whether the string contains a particular substring or set of substrings

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Description |
| --- | --- | --- | --- |
| input | <code>string</code> | input string to test |
| candidate | <code>string</code> or <code>Array</code> | the substring to test |


**Example**
```js
'elongated'.contains('gate'); //returns true;
'elongated'.contains(['long', 'gate']); //returns true;
'elongated'.contains(['wall']); //returns false;
```

<a name="module_strangler.beginsWith"></a>
### .beginsWith(str, candidate) ⇒ <code>boolean</code>
Tests whether the string begins with a particular substring

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Description |
| --- | --- | --- | --- |
| input | <code>string</code> | input string to test |
| candidate | <code>string</code> | the substring to test |


**Example**
```js
'max'.beginsWith('m'); //return true;
```

<a name="module_strangler.endsWith"></a>
### .endsWith(str, candidate) ⇒ <code>boolean</code>
Tests whether the string ends with a particular substring

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Description |
| --- | --- | --- | --- |
| input | <code>string</code> | input string to test |
| candidate | <code>string</code> | the substring to test |


**Example**
```js
'max'.endsWith('x'); //return true;
```

<a name="module_strangler.splitHonoringQuotes"></a>
### .splitHonoringQuotes(str, [delimiter], [quotes]) ⇒ <code>Array</code>
like String.split(), but it will honor the opening and closing of quotes, so a delimiter inside a quote won't blow it up.

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> | | input string to split |
| delimiter | <code>string</code> | ',' | the pattern to split on |
| quotes | <code>Array</code> | ["'", '""'] | the quotes to respect |


**Example**
```js
'a, b, c="r, u, d", d'.splitHonoringQuotes(',');
```
returns

```js
['a', ' b', ' c="r, u, d"', ' d']
```

<a name="module_strangler.decompose"></a>
### .decompose(str, [delimit], [quotes]) ⇒ <code>Array</code>
like String.split(), but it will honor the opening and closing of quotes, so a delimiter inside a quote won't blow it up, rather than using a fixed delimiter, you can provide a RegExp to split on. Not as fast as `splitHonoringQuotes`, but much more flexible.

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> | | input string to split |
| delimiter | <code>RegExp</code> | ',' | the pattern to split on |
| quotes | <code>Array</code> | ["'", '""'] | the quotes to respect |

<a name="module_strangler.multiLineAppend"></a>
### .multiLineAppend(str, appendStr) ⇒ <code>string</code>
returns the two strings which are appended together in a line by line fashion.

**Kind**: static method of <code>[strangler](#module_strangler)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | multiline string prefix |
| appendStr | <code>string</code> |  | multiline string suffix |

**Example**

```js
var firsts = 'this \
attaches \
the ';
var seconds = 'one \
to \
other'
firsts.multiLineAppend(seconds);
```
returns

```js
'this one\
attaches to\
the other'
```

Testing
-------
just run
    
    mocha

Enjoy,

-Abbey Hawk Sparrow