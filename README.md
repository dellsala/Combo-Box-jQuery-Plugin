jQuery Combo Box Plugin
=======================

What is it?
----------
Turns a `<input type="text">` into a [combo box](http://en.wikipedia.org/wiki/Combo_box).

* autocomplete
* keyboard controls
* most styles can be customized via css
* list of values can be changed dynamically

This is __not intended__ for extending `<select>` elements. Many other jquery "combo box"
plugins out there behave more like searchable select elements with disctinct labels and 
values for each option. This plugin simply allows the user to choose from existing _text_
values or supply their own.

How to Use it
-------------

###HTML
    <input id="combobox1" type="text" name="fruit" />

###JavaScript

    jQuery(function () {
     
        jQuery('#combobox1').combobox([
            'Apples',
            'Oranges',
            'Bananas'
        ]);
     
    });



