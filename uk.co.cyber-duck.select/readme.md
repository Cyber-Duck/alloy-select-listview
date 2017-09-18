## Alloy ListItem Selection Re-usable Widget (with "Other" optional support)

[![gitTio](http://gitt.io/badge.svg)](http://gitt.io/component/uk.co.cyber-duck.select)

**A Ti.UI.ListView wrapper with mighty powers for forms.**

This is a Axway Titanium Alloy Widget wrapping some standard components in order
to create a re-usable Widget for a single choice selection within a ListView with
a support for a "Other" entry.

Here we are using one `Ti.UI.ListView`, one `Ti.UI.ListSection` and multiple `Ti.UI.ListItems`.

We've tried to make the API as simple and intuitive as possible but we're opened for
pull requests too.

At the moment we only support a single selection mode but we could work on a multiple
selection mode in the future.

## Installation

Download this repository and consult the [Alloy Documentation](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_XML_Markup-section-35621528_AlloyXMLMarkup-ImportingWidgets) on how to install it, or simply use the [gitTio CLI](http://gitt.io/cli):

```
$ gittio install uk.co.cyber-duck.select
```

## Demo

![screencast](https://cdn-pro.droplr.net/files/acc_244709/qacXm2)

## Alloy implementation

```xml
<Alloy>
    <Widget id="myelement" src="uk.co.cyber-duck.select"
        options="Foo|Bar|Lorem|Ipsum"
        onOptionSelected="myOptionSelectedHandler"
        hasOther="true|false" otherTitle="Another thing" onOtherSelected="myOtherSelectedHandler" />
</Alloy>
```

`hasOther` has to be defined upon Widget instanciation but `options` and `otherTitle` can be defined at both XML View level or JS Controller level:

```js
$.myelement.setOptions(["Foo","Bar","Lorem","Ipsum"]);
$.myelement.setOtherTitle("Another thing");
```

```xml
<Alloy>
    <Widget src="uk.co.cyber-duck.select" options="Foo|Bar|Lorem|Ipsum" otherTitle="Another thing" ... />
</Alloy>
```

or using only JS:

```js
var myelement = Alloy.createWidget("uk.co.cyber-duck.select", "myelement", {
    options: "Foo|Bar|Lorem|Ipsum",
    onOptionSelected: function (e) { // ... },
    hasOther: true|false,
    otherTitle: "Another thing",
    onOtherSelected: function (e) { // ... }
});
```

## Instanciation

Upon instanciation, fro either the Alloy Controller (Javascript) or the Alloy View (XML), a couple of arguments can be accepted:

* `options` - `Mixed` - default: empty
* `hasOther` - `Boolean` - **optional** default: `false` -- Are you going to have a "Other" possible value selected?
* `otherTitle` - `String` - **optional** -- Only valid if `hasOther` is set to `true`.
* `caption` - `String` - **optional** -- Do you want a `<Label>` element renedered before the element so you can illustrate what you're asking for?

## Public Methods

### Setters

* `$.myelement.setOptions(options: Array<String>)`
    * `options` can be of **three** different forms:
        * `String`: example `"Foo|Bar|Lorem|Ipsum"`
        * `Array<String>`: example `["Foo", "Bar", "Lorem", "Ipsum"]`
    * **Important:** Similar to a HTML `<select>` element, please be aware that you can even specify a `key:value` pair for each option by using the following syntax from both the Alloy Controller (Javascript) or the Alloy View (XML):
        * `String`: example `"foo_key:Foo|bar_key:Bar|lorem_key:Lorem|ipsum_key:Ipsum"`
        * `Array<String>`: example `["foo_key:Foo", "bar_key:Bar", "lorem_key:Lorem", "ipsum_key:Ipsum"]`
        * `Array<Object>`: example `[{"foo_key": "Foo"}, {"bar_key": "Bar"}, {"lorem_key": "Lorem"}, {"ipsum_key": "Ipsum"}]`
* `$.myelement.setOtherTitle(title: String)`
* `$.myelement.setOtherSubtitle(subtitle: String)`

### Getters

* `$.myelement.getValue()` -- If no specific `key` is given for the options, the actual title string value will be returned as the key too.
* `$.myelement.getOtherValue()`
* `$.myelement.getSelectedOption()`
* `$.myelement.getOptionsLength()`

### Widget Functions

* `$.myelement.selectOptionAtIndex(index: Integer)`
    * Select an option and add a tick symbol next to it.
* `$.myelement.unselectAllOptions()`
* `$.myelement.insertOption(optionTitle: String, optionKey: String - optional)`
    * Inserts a new option at the end of the element.
    * If `optionKey` is not given, we'll fall back to using the `optionTitle` as the key by default.
* `$.myelement.removeLastOption()`
* `$.myelement.showError(message: String)` -- Renders a styled error message underneath the element of called with an error message to display.
* `$.myelement.hideError()` -- Hides any previously rendered error messages.

## Public Events

### `optionSelected(e)`

Triggered when any of the option is selected.

#### Context

Defaults [from the SDK](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListView-event-itemclick) `itemclick` event:

* `e.source` --> Ti.UI.ListView
* `e.section` --> Ti.UI.ListSection
* `e.sectionIndex`
* `e.itemIndex`
* `e.itemId`
* `e.bindId`

Added context variables from our Widget:

* `e.selectedOption` --> Ti.UI.ListItem
* `e.value` --> String

### `otherSelected(e)`

Triggered when the `hasOther` parameter is set to `true` and when the last "Other" option is selected.

#### Context

Defaults [from the SDK](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListView-event-itemclick) `itemclick` event:

* `e.source` --> Ti.UI.ListView
* `e.section` --> Ti.UI.ListSection
* `e.sectionIndex`
* `e.itemIndex`
* `e.itemId`
* `e.bindId`

Added context variables from our Widget:

* `e.otherTitle` --> String
* `e.otherSubtitle` --> String

## TSS Styling

This is following the best practises in terms of widget styling from [the official documentation](https://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Widgets).

You can overriding any TSS class by creating the following file:

`app/themes/[your_theme_name]/widgets/uk.co.cyber-duck.toast/styles/widget.tss`

Once that file created, feel free to pick and choose from our classes within the original [`widget.tss`](https://github.com/Cyber-Duck/alloy-toast-notification/blob/master/uk.co.cyber-duck.toast/styles/widget.tss) file.

## Bonus

A good implementation of `otherSelected` could be to open a new `Ti.UI.Window` in order to ask the
user more details about that "Other" entry:

Assuming you have a `controllers/textarea`:

```xml
<Alloy>
    <Window title="Please specify">
        <LeftNavButton platform="ios">
            <View>
                <Button title="Back" onClick="doBack" />
            </View>
        </LeftNavButton>
        <TextArea id="textareaElement" />
    </Window>
</Alloy>
```

```js
var args = $.args;

if (args.value) {
    $.textareaElement.setValue(args.value);
}

function doBack() {
    $.trigger("closed", {
        "value": $.textareaElement.getValue()
    });
    $.getView().close();
}
```

You could have:

```xml
<Alloy>
    <Widget id="myelement" src="uk.co.cyber-duck.select"
        hasOther="true" onOtherSelected="otherSelected" />
</Alloy>
```

```js
function otherSelected(e) {
    var controller = Alloy.createController("textarea", { "value": "Some initial copy" });
    controller.addEventListener("closed", function(param){
        $.myelement.setOtherSubtitle(param.value);
    });
    myCurrentWindow.openWindow(controller.getView());
}
```

You get the idea ;)

## License

```
Copyright 2017 Cyber-Duck Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
