/*!
 * Combobox Plugin for jQuery, version 0.1
 *
 * Copyright 2010, Dell Sala
 * http://dellsala.com/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2010-02-20
 */
(function () {

    jQuery.fn.combobox = function (selectOptions) {
    
        return this.each(function () {
            var newCombobox = new Combobox(this, selectOptions);
            jQuery.combobox.instances.push(newCombobox);
        });
    
    };

    jQuery.combobox = {
        instances : []
    };


    var Combobox = function (textInputElement, selectOptions) {
        this.textInputElement = jQuery(textInputElement);
        var container = this.textInputElement.wrap(
            '<span class="combobox" style="position:relative; '+
            'display:-moz-inline-box; display:inline-block;"/>'
        );
        var selector = new ComboboxSelector(this, selectOptions);
        this.selector = selector;
        var inputHeight = this.textInputElement.outerHeight();
        var buttonLeftPosition = this.textInputElement.outerWidth() + 0;
        var showSelectorButton = jQuery(
            '<a href="#" class="combobox_button" '+
            'style="position:absolute; height:'+inputHeight+'px; width:'+
            inputHeight+'px; top:0; left:'+buttonLeftPosition+'px;">&nbsp;</a>'
        ).insertAfter(this.textInputElement);
        this.textInputElement.css('margin', '0 '+showSelectorButton.outerWidth()+'px 0 0');
        showSelectorButton.click(function (e) {
            jQuery('html').trigger('click');
            selector.show();
            return false;
        })
        this.bindKeypress();
    };

    Combobox.prototype = {

        bindKeypress : function () {
            var thisCombobox = this;
            this.textInputElement.keydown(function (event) {
                if (event.keyCode == Combobox.keys.DOWNARROW) {
                    thisCombobox.textInputElement.trigger('blur');
                    thisCombobox.selector.show();
                    event.stopPropagation();
                }
            });
        },
        
        setValue : function (value) {
            this.textInputElement.val(value);
        },
        
        focus : function () {
            this.textInputElement.trigger('focus');        	
        }

    };

    Combobox.keys = {
        UPARROW : 38,
        DOWNARROW : 40,
        ENTER : 13,
        ESCAPE : 27
    };



    var ComboboxSelector = function (combobox, selectOptions) {
        this.combobox = combobox;
        this.optionCount = selectOptions.length;
        this.selectedIndex = -1;
        var selectorTop = combobox.textInputElement.outerHeight();
        var selectorWidth = combobox.textInputElement.outerWidth();
        this.selectorElement = jQuery(
            '<div class="combobox_selector" '+
            'style="display:none; width:'+selectorWidth+
            'px; position:absolute; left: 0; top: '+selectorTop+'px;"'+
            '></div>'
        ).insertAfter(this.combobox.textInputElement);
        this.setSelectOptions(selectOptions);
        var thisSelector = this;
        jQuery('html').click(function () {
            thisSelector.hide();
        });
        this.keydownHandler = function (e) {
            if (e.keyCode == Combobox.keys.DOWNARROW) {
                thisSelector.selectNext();
            } else if (e.keyCode == Combobox.keys.UPARROW) {
                thisSelector.selectPrevious();
            } else if (e.keyCode == Combobox.keys.ESCAPE) {
                thisSelector.hide();
                thisSelector.combobox.focus();
            } else if (e.keyCode == Combobox.keys.ENTER) {
                thisSelector.combobox.setValue(thisSelector.getSelectedValue());
                thisSelector.combobox.focus();
                thisSelector.hide();
            }
            return false;
        }
        
    }


    ComboboxSelector.prototype = {

        setSelectOptions : function (selectOptions) {
            this.selectorElement.empty();
            var ulElement = jQuery('<ul></ul>').appendTo(this.selectorElement);
            for (var i = 0; i < selectOptions.length; i++) {
                ulElement.append('<li>'+selectOptions[i]+'</li>');
            }
            var thisSelector = this;
            this.selectorElement.find('li').click(function (e) {
                thisSelector.hide();
                thisSelector.combobox.setValue(this.innerHTML);
            });
            this.selectorElement.mouseover(function (e) {
                thisSelector.unselect();
            });
        },

        show : function () {
            jQuery('html').keydown(this.keydownHandler);
            this.selectorElement.slideDown('fast');
            thisSelector = this;
        },

        hide : function () {
            jQuery('html').unbind('keydown', this.keydownHandler);
            this.selectorElement.unbind('click');
            this.unselect();
            this.selectorElement.hide();
        },

        selectNext : function () {
            var newSelectedIndex = this.selectedIndex + 1;
            if (newSelectedIndex > this.optionCount - 1) {
                newSelectedIndex = this.optionCount - 1;
            }
            this.select(newSelectedIndex);
        },

        selectPrevious : function () {
            var newSelectedIndex = this.selectedIndex - 1;
            if (newSelectedIndex < 0) {
                newSelectedIndex = 0;
            }
            this.select(newSelectedIndex);
        },
        
        select : function (index) {
            this.unselect();
        	this.selectorElement.find('li:eq('+index+')').addClass('selected');
        	this.selectedIndex = index;
        },

        unselect : function () {
        	this.selectorElement.find('li:eq('+this.selectedIndex+')').removeClass('selected');
        	this.selectedIndex = -1;
        },
        
        getSelectedValue : function () {
        	return this.selectorElement.find('li').get(this.selectedIndex).innerHTML;
        }

    };


})();