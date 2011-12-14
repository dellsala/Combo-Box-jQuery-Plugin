/*!
 * Combobox Plugin for jQuery, version 0.4.1
 *
 * Copyright 2011, Dell Sala
 * http://dellsala.com/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2011-07-21
 *
 * modified by hSATAC(Ash Wu)
 */
(function () {

    jQuery.fn.combobox = function (selectOptions, selectValues) {

    
        return this.each(function () {
            var newCombobox = new Combobox(this, selectOptions, selectValues);
            jQuery.combobox.instances.push(newCombobox);
        });
    
    };

    jQuery.combobox = {
        instances : []
    };


    var Combobox = function (textInputElement, selectOptions, selectValues) {
        this.textInputElement = jQuery(textInputElement);
        var container = this.textInputElement.wrap(
            '<span class="combobox" style="position:relative; '+
            'display:-moz-inline-box; display:inline-block;"/>'
        );
        this.selector = new ComboboxSelector(this);
        this.setSelectOptions(selectOptions, selectValues);
        var inputHeight = this.textInputElement.outerHeight();
        var buttonLeftPosition = this.textInputElement.outerWidth() + 0;
        var showSelectorButton = jQuery(
            '<a href="#" class="combobox_button" '+
            'style="position:absolute; height:'+inputHeight+'px; width:18px; top:0; left:'+buttonLeftPosition+'px;"><b class="combobox_arrow"></b></a>'
        ).insertAfter(this.textInputElement);
        this.textInputElement.css('margin', '0 '+showSelectorButton.outerWidth()+'px 0 0');
        var thisSelector = this.selector;
        var thisCombobox = this;
        showSelectorButton.click(function (e) {
            jQuery('html').trigger('click');
            thisSelector.buildSelectOptionList();
            thisSelector.show();
            thisCombobox.focus();
            return false;
        })
        this.bindKeypress();
    };

    Combobox.prototype = {

        setSelectOptions : function (selectOptions, selectValues) {
            if(typeof(selectValues) == 'undefined') selectValues = selectOptions;
            this.selector.setSelectOptions(selectOptions, selectValues);
            this.selector.buildSelectOptionList(this.getValue());
        },

        bindKeypress : function () {
            var thisCombobox = this;
            this.textInputElement.keyup(function (event) {
                if (event.keyCode == Combobox.keys.TAB
                    || event.keyCode == Combobox.keys.SHIFT) 
                {
                    return;
                }
                if (event.keyCode != Combobox.keys.DOWNARROW
                    && event.keyCode != Combobox.keys.UPARROW
                    && event.keyCode != Combobox.keys.ESCAPE
                    && event.keyCode != Combobox.keys.ENTER)
                {
                    thisCombobox.selector.buildSelectOptionList(thisCombobox.getValue());
                }
                thisCombobox.selector.show()
            });
        },
        
        setValue : function (value) {
            this.textInputElement.val(value);
        },

        getValue : function () {
            return this.textInputElement.val();
        },
        
        focus : function () {
            this.textInputElement.trigger('focus');        	
        }
        
    };

    Combobox.keys = {
        UPARROW : 38,
        DOWNARROW : 40,
        ENTER : 13,
        ESCAPE : 27,
        TAB : 9,
        SHIFT : 16
    };



    var ComboboxSelector = function (combobox) {
        this.combobox = combobox;
        this.optionCount = 0;
        this.selectedIndex = -1;
        this.allSelectOptions = [];
        this.allSelectValues = [];
        var selectorTop = combobox.textInputElement.outerHeight();
        var selectorWidth = combobox.textInputElement.outerWidth();
        this.selectorElement = jQuery(
            '<div class="combobox_selector" '+
            'style="display:none; width:'+(selectorWidth+18)+
            'px; max-height: 350px;position:absolute; left: 0; top: '+selectorTop+'px;overflow-x:auto;overflow-y: auto;"'+
            '></div>'
        ).insertAfter(this.combobox.textInputElement);
        var thisSelector = this;
        jQuery('html').click(function () {
            thisSelector.hide();
        });
        this.keypressHandler = function (e) {
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

        setSelectOptions : function (selectOptions, selectValues) {
            this.allSelectOptions = selectOptions;
            this.allSelectValues = selectValues;
        },

        buildSelectOptionList : function (startingLetters) {
            if (! startingLetters) {
                startingLetters = "";
            }
            this.unselect();
            this.selectorElement.empty();
            var selectOptions = [];
            var selectValues  = [];
            this.selectedIndex = -1;
            for (var i=0; i < this.allSelectOptions.length; i++) {
                if (! startingLetters.length 
                    || this.allSelectOptions[i].toLowerCase().indexOf(startingLetters.toLowerCase()) === 0)
                {
                    selectOptions.push(this.allSelectOptions[i]);
                    selectValues.push(this.allSelectValues[i]);
                }
            }
            this.optionCount = selectOptions.length;
            var ulElement = jQuery('<ul></ul>').appendTo(this.selectorElement);
            for (var i = 0; i < selectOptions.length; i++) {
                ulElement.append('<li data="'+selectValues[i]+'">'+selectOptions[i]+'</li>');
            }
            var thisSelector = this;
            this.selectorElement.find('li').click(function (e) {
                alert(jQuery(this).attr('data'));
                thisSelector.hide();
                thisSelector.combobox.setValue(jQuery(this).attr('data'));
                thisSelector.combobox.focus();
                jQuery(thisSelector.combobox.textInputElement).trigger('change');
            });
            this.selectorElement.mouseover(function (e) {
                thisSelector.unselect();
            });
        },

        show : function () {
            if (this.selectorElement.find('li').length < 1
                || this.selectorElement.is(':visible'))
            {
                return false;
            }
            jQuery('html').keyup(this.keypressHandler);
            this.selectorElement.slideDown('fast');
            thisSelector = this;
            return true;
        },

        hide : function () {
            jQuery('html').unbind('keyup', this.keypressHandler);
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
        	this.selectorElement.find('li').removeClass('selected');
        	this.selectedIndex = -1;
        },
        
        getSelectedValue : function () {
        	return this.selectorElement.find('li').get(this.selectedIndex).innerHTML;
        }

    };


})();

