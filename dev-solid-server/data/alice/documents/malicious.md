# XSS Attack Examples

This document showcases various XSS (Cross-Site Scripting) attack vectors for security testing purposes.

If you see an alert box at any point, the client application is vulnerable to XSS attacks through Markdown documents.


### Basic Script Injection

```html
<script>alert('Basic XSS')</script>
```

<script>alert('Basic XSS')</script>

### Event Handler Injection

#### Image with onerror script

```html
<img src="x" onerror="alert('Image onerror XSS')">
```

<img src="x" onerror="alert('Image onerror XSS')">

#### Input with onmouseover script

```html
<input type="text" onmouseover="alert('Mouseover XSS')">
```
<input type="text" onmouseover="alert('Mouseover XSS')">

#### Div with onload script

```html
<div onload="alert('onload XSS')">
```

<div onload="alert('onload XSS')">

### Filter Evasion Techniques

#### Case Variation

```html
<ScRiPt>alert('Case Variation XSS')</ScRiPt>
<SCRIPT>alert('Case Variation XSS')</SCRIPT> 
```

<ScRiPt>alert('Case Variation XSS')</ScRiPt>
<SCRIPT>alert('Case Variation XSS')</SCRIPT> 

#### HTML Encoding Bypass

<script>alert(&#x27;xss&#x27;)</script>
<script>alert(&apos;xss&apos;)</script>

```html
<script>alert(&#x27;xss&#x27;)</script>
<script>alert(&apos;xss&apos;)</script>
```

#### JavaScript String Encoding

```html
<script>alert(String.fromCharCode(120,115,115))</script>
```

<script>alert(String.fromCharCode(120,115,115))</script>

#### Alternative Tags

```html
<svg onload="alert('Alternative Tags XSS')">
<iframe src="javascript:alert('Alternative Tags XSS')">
<embed src="javascript:alert('Alternative Tags XSS')">
<object data="javascript:alert('Alternative Tags XSS')">
```

<svg onload="alert('Alternative Tags XSS')">
<iframe src="javascript:alert('Alternative Tags XSS')">
<embed src="javascript:alert('Alternative Tags XSS')">
<object data="javascript:alert('Alternative Tags XSS')">

### Event Handler Variations

```html
<body onload="alert('Event handler XSS')"></body>
<input type="image" src="x" onerror="alert('Event handler XSS')">
<isindex type="image" src="x" onerror="alert('Event handler XSS')">
<marquee onstart="alert('xss')"></marquee>
<select onfocus="alert('Event handler XSS')" autofocus></select>
<textarea onfocus="alert('Event handler XSS')" autofocus></textarea>
<keygen onfocus="alert('Event handler XSS')" autofocus></keygen>
```

<body onload="alert('Event handler XSS')"></body>
<input type="image" src="x" onerror="alert('Event handler XSS')">
<isindex type="image" src="x" onerror="alert('Event handler XSS')">
<marquee onstart="alert('xss')"></marquee>
<select onfocus="alert('Event handler XSS')" autofocus></select>
<textarea onfocus="alert('Event handler XSS')" autofocus></textarea>
<keygen onfocus="alert('Event handler XSS')" autofocus></keygen>

### CSS-Based XSS

```html
<style>
@import 'javascript:alert("CSS-Based XSS")';
</style>

<div style="background-image: url(javascript:alert('CSS-Based XSS'))">

<link rel="stylesheet" href="javascript:alert('CSS-Based XSS')">
```

<style>
@import 'javascript:alert("CSS-Based XSS")';
</style>

<div style="background-image: url(javascript:alert('CSS-Based XSS'))">

<link rel="stylesheet" href="javascript:alert('CSS-Based XSS')">

### Protocol Handler XSS

```html
<a href="javascript:alert('Protocol Handler XSS')">Click me</a>
<a href="data:text/html,<script>alert('Protocol Handler XSS')</script>">Click me</a>
<a href="vbscript:msgbox('Protocol Handler XSS')">Click me</a>
```

<a href="javascript:alert('Protocol Handler XSS')">Click me</a>
<a href="data:text/html,<script>alert('Protocol Handler XSS')</script>">Click me</a>
<a href="vbscript:msgbox('Protocol Handler XSS')">Click me</a>

```markdown
[click me](javascript:alert('Protocol Handler XSS'))
![](javascript:alert('Protocol Handler XSS'))
```
[click me](javascript:alert('ProtocolHandlerXSS'))
![](javascript:alert('ProtocolHandlerXSS'))


