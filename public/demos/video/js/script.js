/*jslint
this,for,white: true
*/
/*global
window, navigator, document, console, setTimeout, clearTimeout, jQuery, brightcove, dataWelcomeData
*/
var Site = {
    canTouch: window.Modernizr.touch,
    isMobile: function() {
        'use strict';
        return window.Modernizr.mq('(max-width: 767px)');
    },
    isTablet : function() {
        'use strict';
        return window.Modernizr.touch && !this.isMobile();
    },
    setCookie: function(cname, cvalue, exdays) {
        'use strict';
        var d = new Date();
        if(!cname) {
            return;
        }
        exdays = exdays ? parseInt(exdays) : 1;
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = 'expires='+d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
    },
    getCookie: function(cname) {
        'use strict';
        if(!cname) {
            return '';
        }

        var name = cname + '=';
        var ca = document.cookie.split(';');
        var i;
        var c;
        for(i = 0; i < ca.length; i = i + 1) {
            c = ca[i];
            while (c.charAt(0) === ' '){
                c = c.substring(1);
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length,c.length);
                }
            }
        }
        return '';
    }
};

jQuery(document).ready(function($){
    'use strict';

    var loader = $('.loader-overlay');
    Site.showLoading = function() {
        loader.stop().show();
    };

    Site.hideLoading = function() {
        loader.stop().fadeOut();
    };

    if(window.Detectizr.browser.userAgent.indexOf('windows phone') !== -1){
        jQuery('html').addClass('window-phone');
    }

    if(window.Detectizr.browser.userAgent.indexOf('samsung') !== -1){
        jQuery('html').addClass('samsung');
    }
});

(function($, window, Site) {
    'use strict';

    var pluginName = 'accordion';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this,
                element = that.element,
                options = that.options;
            that.handle = element.find(options.classHandle);
            that.content = element.find(options.classContent);
            that.containItem = element.find(options.classContainItem);
            that.initItemOpen();
            that.handle
                .off('click.' + pluginName)
                .on('click.' + pluginName, function(e) {
                    e.preventDefault();
                    that.toggle($(this));
                });
        },
        initItemOpen: function() {
            var that = this,
                options = that.options,
                arrIdx = options.arrItemOpenDefault;
            if (options.isMultiOpen) {
                if (!arrIdx) {
                    return;
                }
                var i;
                var l = arrIdx.length;
                for (i = 0; i < l; i = i + 1) {
                    that.containItem.eq(arrIdx[i] - 1)
                        .addClass(options.classActiveItem);
                }
            } else {
                if (!options.itemOpenDefault) {
                    return;
                }
                that.containItem.eq(options.itemOpenDefault - 1).addClass(options.classActiveItem);
            }
        },
        show: function(content) {
            var that = this,
                options = that.options;
            if (options.isMultiOpen) {
                content.slideDown(options.duration, function() {
                    $(this)
                        .closest(options.classContainItem)
                        .addClass(options.classActiveItem);
                });
            } else {

                that.content.not(content)
                    .slideUp(options.duration, function () {
                        $(this)
                            .closest(options.classContainItem)
                            .removeClass(options.classActiveItem).end()
                            .removeAttr('style');
                    });

                content.hide()
                    .closest(options.classContainItem)
                    .addClass(options.classActiveItem).end()
                    .slideDown(options.duration, function () {
                        content.removeAttr('style');
                        that.element.trigger('afterShow', content);
                    });
            }
        },
        hide: function(content) {
            var that = this;
            that.element.trigger('beforeHide', content);
            content.slideUp(that.options.duration, function() {
                $(this)
                    .closest(that.options.classContainItem)
                    .removeClass(that.options.classActiveItem).end()
                    .removeAttr('style');
            });
        },
        toggle: function(handle) {
            if (!Site.isMobile()) {
                return;
            }
            var that = this,
                options = that.options,
                parent = handle.closest(options.classContainItem),
                content = parent.find(options.classContent);
            that[parent.hasClass(options.classActiveItem) ? 'hide' : 'show'](content);
        },
        destroy: function() {
            this.handle.off('click.' + pluginName);
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        isMultiOpen: false,
        arrItemOpenDefault: [1, 2],
        itemOpenDefault: 1,
        duration: 400,
        classHandle: '.handle',
        classContent: '.content',
        classContainItem: '.item',
        classActiveItem: 'active'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
        var filterControl = $('#filtering-coltrols');
        filterControl.on('afterShow', function(e, content){

            if($(e.target).is(filterControl) && content.hasClass('states-group')){
                content.addClass('states');
            }
        }).on('beforeHide', function(e, content){
            if($(e.target).is(filterControl) && content.hasClass('states-group')){
                content.removeClass('states');
            }
        });
    });

}(jQuery, window, Site));

/**
 *  @name anchorLink
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
(function($, window) {
    'use strict';

    var pluginName = 'anchorLink',
        win = $(window);

    var activeWithScrollTop = function() {
        if (win.scrollTop() >= $(this.element.attr('href')).offset().top) {
            this.element.parent().addClass(this.options.classActive)
                .siblings().removeClass(this.options.classActive);
        }
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            this.vars = {
                headerEle: $('header'),
                bodyPage: $('body'),
                winHeight: win.height(),
                arrOffsetContent: []
            };

            this.element.on('click.' + pluginName, function(e) {
                e.preventDefault();
                that.goTo($(this).attr('href'));
            });

            win.on('resize.' + pluginName, function() {
                    that.vars.winHeight = win.height();
                })
                .on('scroll.' + pluginName, function() {
                    activeWithScrollTop.call(that);
                });
        },
        goTo: function(hrefId) {
            this.vars.bodyPage.animate({
                scrollTop: $(hrefId).offset().top
            }, this.options.duration);
        },
        destroy: function() {
            this.element.off('click.' + pluginName);
            win.off('resize.' + pluginName).off('scroll.' + pluginName);
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        duration: 500,
        contentItems: '.content',
        classActive: 'active-anchor'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]({});

        // trigger next or prev link via button
        $('#nextTo, #prevTo').on('click', function() {
            var links = $('[data-' + pluginName + ']'),
                idxCurrentLink;

            idxCurrentLink = links.parent().filter('.active-anchor').index();

            if ($(this).attr('id') === 'nextTo') {
                links.eq(idxCurrentLink + 1 > links.length - 1 ? links.length - 1 : idxCurrentLink + 1)
                    .trigger('click.anchorLink');
            } else {
                links.eq((idxCurrentLink - 1) < 0 ? 0 : (idxCurrentLink - 1))
                    .trigger('click.anchorLink');
            }
        });
    });

}(jQuery, window));

(function($, window) {
    'use strict';

    var pluginName = 'calendar',
        monthsShort = window.L10n.text.monthsShort;

    var getDate = function(date){
        var month = date.getMonth(),
            year = date.getFullYear(),
            day = new Date();
        if(month === day.getMonth() && year ===  day.getFullYear()){
            return window.L10n.text.today;
        }
        return monthsShort[date.getMonth()] + '-' + date.getFullYear();
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            this.vars = {
                calendar: $('[data-init-calendar]', this.element),
                todayBtn: $('[data-today]', this.element),
                target: $(this.element.data(pluginName))
            };

            this.vars.calendar.datepicker(this.options).on('changeMonth', function(e){
                that.vars.target.val(getDate(e.date));

                // trigger to catch filter in filter form;
                that.vars.target.trigger('change');
            });

            this.vars.todayBtn
                .off('click.' + pluginName)
                .on('click.' + pluginName, function(){
                    that.vars.target.val(window.L10n.text.today);
                    that.vars.calendar.datepicker('update');
                });

        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        minViewMode: 1,
        format: 'M-yyyy',
        startDate : 'today'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

(function($, window) {
    'use strict';

    var pluginName = 'carousel';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.element.off('init.' + pluginName).on('init.' + pluginName, function() {
                var control = $(this).next('.control');
                $('.slick-next', control).appendTo(control);
            });

            this.options.appendDots = this.element.next('.control');
            this.options.appendArrows = this.options.appendDots;
            this.element.slick(this.options);
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        dots: true,
        speed: 200,
        fade: true,
        autoplay: false,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        cssEase: 'ease'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

/**
 *  @name customSelectBox
 *  @description description
 *  @version 1.0
 *  @options
 *    effect
 *  @events
 *    keyUp, keyDown, click, focusout, hover
 *  @methods
 *    init
 *    createSelect, nextIndexEle, prevIndexEle, showList, hideList, setValue
 *    determineCharKeyDown, determineNavigationKey
 *    destroy
 */
(function($, window) {
    'use strict';

    var pluginName = 'customSelectBox',
        doc = $(document);
    var KEYCODE = {
            UP: 38,
            DOWN: 40,
            CHARFIRST: 65,
            CHARLAST: 90,
            NUMFIRST: 48,
            NUMLAST: 57,
            ESC: 27,
            ENTER: 13,
            TAB: 9
        },
        effectSelect = {
            SLIDE: 'slide',
            FADE: 'fade'
        },
        nameNode = {
            OPTION: 'OPTION',
            SELECT: 'SELECT',
            OPTGRP: 'OPTGROUP'
        };

    var createSelect = function() {
        var row = [],
            tempDataChar = [],
            options = this.options,
            ele = this.select,
            classForStyle = ele.attr('class'),
            selectCustom = '<div class="' + options.classWrapSelect + '" ></div>',
            labelSelect = '<div class="' + options.labelEle + '">' +
                                '<span class="visible-value"></span>' +
                                '<a href="javascript:void(0);" class="' + options.btnSelect + '"></a>' +
                          '</div>',
            listItem = '<ul class="' + options.listEle + '"></ul>';

        this.vars.newSelect = $(selectCustom);
        this.vars.labelSelect = $(labelSelect);
        this.vars.listItem = $(listItem);

        if(classForStyle) {
            this.vars.newSelect.addClass(classForStyle);
        }

        ele.find('*').each(function() {
            var childEle = $(this),
                currentNodeName = childEle.prop('nodeName');

            if (currentNodeName === nameNode.OPTION) {
                if (childEle.parent().prop('nodeName') === nameNode.SELECT) {
                    row.push('<li class="' + options.classOptSelect +
                                '" data-val="' + childEle.val() + '">' + childEle.text() + '</li>');
                }
                if (childEle.parent().prop('nodeName') === nameNode.OPTGRP) {
                    row.push('<li class="' + options.classOptGroup +
                                '" data-val="' + childEle.val() + '">' + childEle.text() + '</li>');
                }
                tempDataChar.push(childEle.text().toUpperCase().charCodeAt(0));
            }
            if (currentNodeName === nameNode.OPTGRP) {
                row.push('<li class="' + options.classOptGrpSelect + '">' +
                            childEle.attr('label') + '</li>');
            }
        });

        this.vars.newSelect
            .append(this.vars.labelSelect)
            .append(this.vars.listItem.append(row.join('')));

        this.vars.labelSelect.children('span.visible-value')
            .text(ele.find('option:selected').text())
            .data('val', ele.val());
        this.vars.listItem
            .find('[data-val="' + ele.val() + '"]')
            .addClass(options.classSelectedItem);
        ele.after(this.vars.newSelect).hide();
        this.vars.newSelect.append(ele);

        this.vars.liItems = this.vars.listItem.find('li').not('.' + options.classOptGrpSelect);
        this.vars.previousIndex = this.vars.liItems.filter('.' + options.classSelectedItem).index();
        this.vars.dataChar = tempDataChar;
    };

    var nextIndexEle = function(curIndex, len) {
        if(curIndex + 1 > len - 1){
            return 0;
        }
        else{
            return curIndex + 1;
        }
    };

    var prevIndexEle = function(curIndex, len) {
        if(curIndex - 1 < 0){
            return len - 1;
        }
        else{
            return curIndex - 1;
        }
    };

    var setValue = function(value, text) {
        this.vars.labelSelect.children('span.visible-value').text(text).data('val', value);
        this.select.val(value);
        // trigger to catch filter in filter form;
        this.select.trigger('change');
    };

    var setDropdownSelected = function() {
        var newSelect = this.vars.newSelect,
            classSelectedValue = this.options.classSelectedValue;

        if (!this.vars.labelSelect.children('span.visible-value').data('val')) {
            newSelect.removeClass(classSelectedValue);
        }
        else {
            newSelect.addClass(classSelectedValue);
        }
    };

    var setItemSelected = function(idx) {
        var options = this.options,
            liItems = this.vars.liItems;

        liItems.eq(idx).addClass(options.classSelectedItem)
            .siblings().removeClass(options.classSelectedItem);
    };

    var setScroll = function() {
        var listItem = this.vars.listItem;
        // scroll list Item when key up or down
        listItem.scrollTop(0);
        listItem
            .scrollTop(this.vars.liItems.filter('.' + this.options.classSelectedItem).offset().top - listItem.height());
    };

    var offAllEvent = function() {
        this.vars.labelSelect
            .off('click.' + pluginName);
        this.vars.listItem
            .off('mouseleave.' + pluginName)
            .find('li').not('.' + this.options.classOptGrpSelect)
            .off('click.' + pluginName)
            .off('mouseenter.' + pluginName);
        doc
            .off('keydown.' + pluginName)
            .off('click.' + pluginName);
    };

    var setDisableState = function() {
        if (this.select.prop('disabled')) {
            this.newSelect.addClass(this.options.classDisableSelect);
            offAllEvent.call(this);
        }
    };

    var showList = function() {
        var listItem = this.vars.listItem;
        switch (this.options.effect) {
            case effectSelect.FADE:
                listItem.fadeIn();
                break;
            case effectSelect.SLIDE:
                listItem.slideDown();
                break;
            default:
                listItem.show();
        }
        this.vars.isShow = true;
        this.vars.newSelect.addClass(this.options.classSelectedValue);
        this.vars.prevVal = this.vars.labelSelect.children('span.visible-value').data('val');
    };

    var hideList = function() {
        var listItem = this.vars.listItem;
        switch (this.options.effect) {
            case effectSelect.FADE:
                listItem.fadeOut();
                break;
            case effectSelect.SLIDE:
                listItem.slideUp();
                break;
            default:
                listItem.hide();
        }
        this.vars.isShow = false;
        setDropdownSelected.call(this);
        if (this.vars.prevVal !== this.vars.labelSelect.children('span.visible-value').data('val')) {
            this.select.trigger('changeValue.customSelectBox');
        }
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.select = this.element.children('select');
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this,
                options = this.options;
            // initialize
            this.vars = {
                previousIndex: -1,          // prev index value
                lastIndexOfDuplicate: -1,   // last index in duplicateKeyCodeIndex
                duplicateKeyCodeIndex: [],  // contain index of duplicate key code
                isShow: false,
                dataChar: [],
                prevVal: ''
            };

            createSelect.call(this);
            setDropdownSelected.call(this);

            this.vars.labelSelect.on('click.' + pluginName, function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (that.vars.isShow) {
                    hideList.call(that);
                } else {
                    showList.call(that);
                }
            });

            this.vars.listItem
                .on('mouseleave.' + pluginName, function() {
                    setItemSelected.call(that, that.vars.previousIndex);
                })
                .find('li').not('.' + options.classOptGrpSelect)
                .on('click.' + pluginName, function() {
                    var itSelf = $(this);
                    that.vars.previousIndex = itSelf.index() - itSelf.prevAll().filter('.' + options.classOptGrpSelect).length;

                    itSelf.addClass(options.classSelectedItem);
                    setValue.call(that, itSelf.attr('data-val'), itSelf.text());
                    hideList.call(that);
                })
                .on('mouseenter.' + pluginName, function() {
                    $(this)
                        .addClass(options.classSelectedItem)
                        .siblings().removeClass(options.classSelectedItem);
                });

            doc
                .on('keydown.' + pluginName, function(e) {
                    if (that.vars.isShow) {
                        e.preventDefault();

                        switch (true) {
                            case e.keyCode >= KEYCODE.NUMFIRST && e.keyCode <= KEYCODE.NUMLAST:
                            case e.keyCode >= KEYCODE.CHARFIRST && e.keyCode <= KEYCODE.CHARLAST:
                                if (that.vars.dataChar.indexOf(e.keyCode) !== -1) {
                                    that.determineCharKeyDown(e.keyCode);
                                }
                                break;
                            case e.keyCode === KEYCODE.UP:
                            case e.keyCode === KEYCODE.DOWN:
                                that.determineNavigationKey(e.keyCode);
                                break;
                            case e.keyCode === KEYCODE.ESC:
                            case e.keyCode === KEYCODE.TAB:
                            case e.keyCode === KEYCODE.ENTER:
                                that.vars.labelSelect.triggerHandler('click.' + pluginName);
                                break;
                        }
                    }
                })
                .on('click.' + pluginName, function() {
                    if (that.vars.isShow) {
                        hideList.call(that);
                    }
                });

            setDisableState.call(this);
        },
        determineCharKeyDown: function(keyCode) {
            var that = this,
                lastIndexOfDuplicate = that.vars.lastIndexOfDuplicate,
                duplicateKeyCodeIndex = that.vars.duplicateKeyCodeIndex,
                liItems = that.vars.liItems;

            if (that.vars.previousKeyCode === keyCode) {
                lastIndexOfDuplicate = nextIndexEle(lastIndexOfDuplicate, duplicateKeyCodeIndex.length);
                that.vars.previousIndex = duplicateKeyCodeIndex[lastIndexOfDuplicate];
            } else {

                if (duplicateKeyCodeIndex) {
                    duplicateKeyCodeIndex = [];
                }

                var i;
                var len = that.vars.dataChar.length;
                for (i = 0; i < len; i = i + 1) {
                    if (that.vars.dataChar[i] === keyCode) {
                        duplicateKeyCodeIndex.push(i);
                    }
                }

                lastIndexOfDuplicate = 0;
                that.vars.previousIndex = duplicateKeyCodeIndex[lastIndexOfDuplicate];
            }

            setItemSelected.call(that, that.vars.previousIndex);
            setScroll.call(that);
            setValue.call(that, liItems.eq(that.vars.previousIndex).attr('data-val'),
                            liItems.eq(that.vars.previousIndex).text());

            that.vars.previousKeyCode = keyCode;
            that.vars.lastIndexOfDuplicate = lastIndexOfDuplicate;
            that.vars.duplicateKeyCodeIndex = duplicateKeyCodeIndex;
        },
        determineNavigationKey: function(keyCode) {
            var that = this,
                idx = that.vars.previousIndex,
                liItems = that.vars.liItems;

            switch (keyCode) {
                case KEYCODE.UP:
                    idx = prevIndexEle(idx, liItems.length);
                    break;
                case KEYCODE.DOWN:
                    idx = nextIndexEle(idx, liItems.length);
                    break;
            }

            setItemSelected.call(that, idx);
            setScroll.call(that);
            setValue.call(that, liItems.eq(idx).attr('data-val'), liItems.eq(idx).text());

            that.vars.previousKeyCode = keyCode;
            that.vars.previousIndex = idx;
        },
        destroy: function() {
            // deinitialize
            $.removeData(this.element[0], pluginName);
            this.vars.newSelect
                .before(this.select.removeAttr('style'))
                .remove();
            offAllEvent.call(this);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        effect: 'show',
        btnSelect: 'btn-select',
        labelEle: 'select-box',
        listEle: 'list-unstyled',
        classOptSelect: 'option-of-select',
        classOptGroup: 'option-of-optgroup',
        classOptGrpSelect: 'optgroup-of-select',
        classSelectedItem: 'selected-item',
        classWrapSelect: 'custom-select-box',
        classSelectedValue: 'selected',
        classDisableSelect: 'disabled-select',
        diffWidth: 0
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

function main() {
  return 'Hello, World!';
}

main();/**
*  @name event calendar
*  @description Displaying event-cards with register form and filters (date, month, type, ....)
*  @version 1.0
*  @options
*    option
*  @events
*    event
*  @methods
*    init
*
*    destroy
*/
(function($, window) {
    'use strict';

    var pluginName = 'event-calendar';

    var showRegisterPopup = function(eIndex){
      var opt = this.options,
          item = this.vars.fmData.eventResults[eIndex],
          popup = $(opt.registerPopup);

      popup
        .find('.modal-header .wrap-error').addClass('hidden').end()
        .find('[data-validation] .error').removeClass('error').end()
        .find('[data-validation] .wrap-error').remove().end();

      popup
        .find('.modal-title').html('Register for ' + item.name).end()
        .find('.desc p:first').html(item.time);
      popup['popin']('show');
    };

    var hideRegisterPoup = function(){
      $(this.options.registerPopup)['popin']('hide');
    };

    // Converting json received from server to formated data which can be rendered to DOM
    var parseEvents = function(data){
      var fmData = data,
          params = this.vars.fmDataParams,
          eResults = fmData.eventResults,
          monthlyIndex = 0,
          curMonthID = null;

      $.extend(fmData, params);

      fmData.total = eResults.length;
      fmData.remain = eResults.length;

      curMonthID = (eResults[0] != null) ?
                   (eResults[0].startMonth + '-' + eResults[0].startYear) :
                   null;

      for (var i = 0, len = fmData.total; i < len; i++) {
        var monthID = eResults[i].startMonth + '-' + eResults[i].startYear;
        if (curMonthID !== monthID) {
          // To other month (exactly the next month)
          monthlyIndex = 1;
          curMonthID = monthID;
        } else {
          // Still in current month
          monthlyIndex++;
        }
        eResults[i].monthlyIndex = monthlyIndex;
        eResults[i].eIndex = i;
      }

      return fmData;
    };

    // Setting events for event-cards
    var setCardEvents = function(){
      var that = this,
          elm = this.element,
          eCard = elm.find('.event-content');
      eCard.each(function(){
        $(this).find('.btn-group .btn-register').on('click.' + pluginName, function(e){
          e.preventDefault();
          showRegisterPopup.call(that, $(this).data('eindex'));
        });
      });
    };

    /**
    **  Event calendar Navigation (anchor and scrolling)
    **/

    // Scroll to an month anchor by monthID or index
    var goToMonthIndex = function(navItem, index){
      var elm = this.element,
          paddingTop = 10,
          header = $('#header'),
          targetAnchor =  null,
          top = null;

      if (navItem != null) {
        if (navItem.attr('href') === 'feature') {
          targetAnchor = elm.find('.feature-event');
        } else {
          targetAnchor = elm.find('.item.month-' + navItem.attr('href'));
        }
      } else if (index != null) {
        targetAnchor = (index > 0) ?
                        elm.find('.item:nth-child(' + index +')') :
                        elm.find('.feature-event');
      }

      top = targetAnchor.offset().top -
            header.height() -
            parseInt(header.css('top')) -
            paddingTop;

      $('body').animate({
        scrollTop: top
      });
    };

    var navScrollEvent = function(){
      var that = this,
          elm = this.element,
          win = $(window),
          header = $('#header');
      win.on('scroll.' + pluginName + '-fornav', function(){
        var topLine = win.scrollTop() + header.height(),
            viewportH = win.outerHeight() - header.height(),
            focusItem = {
              id: null,
              d: viewportH
            };

        elm.find('.feature-event, .event-card-block .item').each(function(){
          var d = Math.abs($(this).offset().top - topLine);
          if (d < focusItem.d && d < viewportH) {
            focusItem = {
              id: ($(this).hasClass('feature-event')) ? 'feature' : $(this).data('id'),
              d: d
            };
          }
        });

        if (focusItem.id != null && focusItem.id.length > 0) {
          setActiveNavItem.call(that ,focusItem.id);
        }
      });

    };

    var setActiveNavItem = function(activeId) {
      var nav = this.vars.navControl,
          navList = nav.find('.list-control li'),
          text = '';
      navList.removeClass('active');
      text = navList
              .find('a[href="' + activeId + '"]')
                .closest('li').addClass('active')
                .find('.text-1').html();
      nav.find('.main-control button').html(text);

    };
    // Setting events for events navigation
    var setNavEvents = function(){
      var that = this,
          vars = this.vars,
          nav = vars.navControl,
          listControl = nav.find('.list-control'),
          navList = listControl.find('li'),
          mainControl = nav.find('.main-control'),
          switchButton = mainControl.find('button'),
          nextBtn = nav.find('button.next'),
          prevBtn = nav.find('button.prev');

       navList.find('a').on('click.' + pluginName, function(e){
        e.preventDefault();

        setActiveNavItem.call(that, $(this).attr('href'));
        switchButton.html($(this).attr('title'));

        goToMonthIndex.call(that, $(this));
        return false;
      });

      // Toggle month selector on mobile
      function toggleListControl() {
        mainControl.find('.list-control').slideToggle();
      }
      switchButton
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(){
          toggleListControl();
        });
      nextBtn
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(){
          var activeItem = listControl.find('li.active'),
              nextItem = activeItem.next('li');
          if (nextItem.length > 0) {
            nextItem.find('a').click();
          }
        });
      prevBtn
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(){
          var activeItem = listControl.find('li.active'),
              prevItem = activeItem.prev('li');
          if (prevItem.length > 0) {
            prevItem.find('a').click();
          }

        });
      navScrollEvent.call(this);
    };

    // Rendering the navigation control
    var renderNavControl = function(){
      var vars = this.vars,
          nav = vars.navControl,
          feature = vars.feature,
          events = vars.cardWrap,
          eventItems = events.find('.item'),
          navListHTML = '',
          curActive = nav.find('.main-control li.active a').attr('href');
      nav.data('origin-offset-top', nav.offset().top);
      function getNavItem(id, label) {
        return '<li>' +
                  '<a href="' + id + '" title="' + label + '">' +
                    '<span class="text-1">' +
                      label +
                    '</span>' +
                  '</a>' +
                '</li>';
      }

      // Checking feature
      if (!feature.hasClass('hide')) {
        navListHTML += getNavItem('feature', vars.fmData.featureEventsLabel);
      }

      eventItems.each(function(){
        navListHTML += getNavItem($(this).data('id'), $(this).data('label'));
      });

      nav.find('.list-control').html(navListHTML);

      if (curActive != null) {
        nav.find('a[href="' + curActive + '"]').closest('li').addClass('active');
      } else {
        nav.find('a[href="feature"]').closest('li').addClass('active')  ;
      }
      setNavEvents.call(this);
    };

    var getMonthString = function(month) {
      switch (month) {
        case 1: return 'January';
        case 2: return 'Febuary';
        case 3: return 'March';
        case 4: return 'April';
        case 5: return 'May';
        case 6: return 'June';
        case 7: return 'July';
        case 8: return 'August';
        case 9: return 'September';
        case 10: return 'October';
        case 11: return 'November';
        case 12: return 'December';
        default: return null;
      }
    };

    var getFeatureItemHTML = function(itemData) {
      var fmData = this.vars.fmData,
          itemHTML = '';

      itemHTML = '<div class="detail">' +
                    '<div class="thumb-image hidden-xs">' +
                      '<img src="' + itemData.image + '" alt="event details" class="img-responsive"/>' +
                    '</div>' +
                    '<div class="event-content">' +
                      '<div class="event-box">' +
                        '<div class="icon-box"><img src="' + itemData.icon + '" alt="" class="img-responsive"/>' +
                        '</div><a href="' + itemData.moreDetailLink + '" title="' + itemData.name + '" class="text-box title">' + itemData.name + '</a>' +
                      '</div>' +
                      '<div class="date-time">' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + itemData.time + '" class="link-1">' +
                          '<span aria-hidden="true" class="wi-icon icon-date-time"></span>' +
                          '<span class="blue-text">' + itemData.time + '</span></a>' +
                      '</div>' +
                      '<div class="location">' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + itemData.location + '" class="link-1">' +
                          '<span aria-hidden="true" class="wi-icon icon-location"></span>' +
                          '<span class="blue-text">' + itemData.location + '</span></a>' +
                      '</div>' +
                      '<div class="desc hidden-xs">' +
                        '<p>' + itemData.desc + '</p>' +
                      '</div>' +
                      '<div class="btn-group">' +
                        '<div class="item">' +
                          '<a href="' + itemData.moreDetailLink + '" title="' + fmData.moreDetailText + '" class="btn btn-default">' +
                            '<span>' + fmData.moreDetailText + '</span>' +
                            '<span aria-hidden="true" class="wi-icon icon-arrow"></span>' +
                          '</a>' +
                        '</div>' +
                        '<div class="item">' +
                          '<a href="#" title="Find out more" data-eindex="' + itemData.eIndex + '" class="btn btn-primary btn-register">' +
                            '<span>' + fmData.registerLabel + '</span>' +
                            '<span aria-hidden="true" class="wi-icon icon-arrow"></span>' +
                          '</a>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</div>';

      return itemHTML;
    };

    var getItemHTML = function(itemData) {
      var fmData = this.vars.fmData,
          itemHTML = '';

      itemHTML = '<div class="col-sm-6 col-md-4">' +
                    '<div class="event-content">' +
                      '<div class="event-box">' +
                        '<div class="icon-box">' +
                          '<img src="' + itemData.icon +'" alt="" class="img-responsive"/>' +
                        '</div>' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + itemData.name + '" class="text-box title">' +
                          itemData.name +
                        '</a>' +
                      '</div>' +
                      '<div class="date-time">' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + itemData.time + '" class="link-1">' +
                          '<span aria-hidden="true" class="wi-icon icon-date-time"></span><span class="blue-text">' +
                            itemData.time +
                          '</span>' +
                        '</a>' +
                      '</div>' +
                      '<div class="location">' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + itemData.location + '" class="link-1">' +
                          '<span aria-hidden="true" class="wi-icon icon-location"></span>' +
                          '<span class="blue-text">' + itemData.location + '</span></a>' +
                      '</div>' +
                      '<div class="btn-group">' +
                        '<a href="' + itemData.moreDetailLink + '" title="' + fmData.moreDetailText + '" class="btn btn-default">' +
                          '<span>' + fmData.moreDetailText + '</span>' +
                          '<span aria-hidden="true" class="wi-icon icon-arrow"></span>' +
                        '</a>' +
                        '<a href="#" title="Find out more" data-eindex="' + itemData.eIndex + '" class="btn btn-primary btn-register hidden-xs">' +
                          '<span>' + fmData.registerLabel + '</span>' +
                            '<span aria-hidden="true" class="wi-icon icon-arrow"></span></a>' +
                      '</div>' +
                      ((itemData.isFeature) ?
                      ('<div class="pin-item">' +
                          '<span class="wi-icon icon-pin"></span>' +
                      '</div>') :
                      '') +
                    '</div>' +
                  '</div>';
      return itemHTML;
    };

    var renderQuantityDom = function(){
      var elm = this.element;
      elm.find('h3.static-title').each(function(){
        var _this = $(this),
            numItem = $(this).closest('.item');

        if(_this.parents('.feature-event').length > 0) {
          numItem = _this.next('.events').find('.detail').length;
        } else {
          numItem = _this.closest('.item').find('.event-content').length;
        }

        if(_this.find('.num').length > 0) {
          _this.find('.num').html(' (' + numItem + ')');
        } else {
          _this.append('<span class="num"> (' + numItem + ')</span>');
        }
      });
    };

    var renderCalendarDom = function(fmList, start) {
      var cardsHTML = '',
          featureHTML = '',
          fmData = this.vars.fmData,
          featureTitle = this.vars.feature.find('h3.static-title'),
          featureElm = this.vars.feature.find('.events'),
          cardWrap = this.vars.cardWrap.find('.events');

      //setting feature title
      featureTitle.html(fmData.featureEventsLabel);

      for (var month in fmList){
        var monthEvents = fmList[month].events,
            curColumn = 1,
            startIndex = 0,
            rowInProcess = null,
            isMonthInProcess = fmData.lastestMonth != null && fmData.lastestMonth === month;

        if (isMonthInProcess) {
          var lastShowedMonth = cardWrap.find('.item.month-' + month),
              showedEvents = null;
        rowInProcess = lastShowedMonth.find('.row:last');
        showedEvents = rowInProcess.find('.col-sm-6').length;
        curColumn = showedEvents + 1;
        } else {
          cardsHTML += '<div class="item month-' + month + '" data-id="' + month + '" data-label="' + fmList[month].label + '">' +
                       '<h3 class="static-title">' + fmList[month].label + '</h3>' +
                       '<div class="row">';
          startIndex = 0;
        }

        for (var i = startIndex, len = monthEvents.length; i < len; i++) {
          var eItem = monthEvents[i];
          // check for render row

          // render item
          cardsHTML += getItemHTML.call(this, eItem);

          if (curColumn % 2 === 0) cardsHTML += '<div class="visible-sm-block clearfix"></div>';
          if (curColumn % 3 === 0) cardsHTML += '<div class="visible-lg-block visible-md-block clearfix"></div>';
          curColumn++;

          if (eItem.isFeature) {
            featureHTML += getFeatureItemHTML.call(this, eItem);
          }
        }

        if (!isMonthInProcess) {
          cardsHTML += '</div></div>'; // Closing .row and .item
        } else {
          rowInProcess.append(cardsHTML);
          cardsHTML = '';
        }
      }

      if (typeof start !== 'undefined' && start === 0) {
        cardWrap.html(cardsHTML);
        featureElm.html(featureHTML);
      } else {
        cardWrap.append(cardsHTML);
        featureElm.append(featureHTML);
      }

      checkVisualElement.call(this);

      // console.log(cardsHTML);
      fmData.lastestMonth = month;

      renderQuantityDom.call(this);
    };

    var checkVisualElement = function(){
      var feature = this.vars.feature,
          featureEvents = feature.find('.events').html();
      if (featureEvents.length === 0) {
        feature.addClass('hide');
      } else {
        feature.removeClass('hide');
      }
    };

    var checkLoadMoreResult = function() {
      var vars = this.vars,
          elm = this.element,
          loadMoreCardWrap = vars.cardWrap.find('.event-result'),
          fmData = vars.fmData;
      // hide all result card
      loadMoreCardWrap.find('.control-result').addClass('hide');

      if (fmData.total === 0) {
        loadMoreCardWrap
            .find('.zero-result').removeClass('hide');
      } else {
        if (fmData.remain > 0) {
          // There are more results
          var eventText = ((fmData.remain > 1) ? elm.data('result-type-plural') : elm.data('result-type')) + ' ';
          loadMoreCardWrap
            .find('.load-more')
              .removeClass('hide')
              .find('.desc .num').html(' ' + fmData.remain + ' ').end()
              .find('.desc .result').html(eventText).end()
              .find('.load-more .result').html(eventText);
        } else {
          // There is no more result
          loadMoreCardWrap
            .find('.no-more-result').removeClass('hide');
        }
      }
    };

    // Render condensed view of event calendar
    var renderCondensedEventCalendar = function(){

    };

    // Render normal view of event calendar
    var renderEventCalendar = function(data){
      var fmData = null,
          limit = null,
          renderMonth = null,
          renderMonthlyEvent = {},
          d = new Date(),
          curMonth = (d.getUTCMonth() + 1) + '-' + d.getUTCFullYear(),
          eList = null,
          start = 0,
          total = 0;

      if (typeof data !== 'undefined') {
        fmData = parseEvents.call(this, data);
        this.vars.fmData = fmData;
      } else {
        fmData = this.vars.fmData;
        start = fmData.showToEvent;
      }
      total = fmData.total;

      limit = start + fmData.numberOfResultPerPage;
      eList = fmData.eventResults;
      for (var i = start, len = total; i < len; i++) {
        var monthID = eList[i].startMonth + '-' + eList[i].startYear;
        if (monthID !== renderMonth) {
          renderMonth = monthID;
          renderMonthlyEvent[monthID] = {
            label: (curMonth === renderMonth) ?
                    'This month' :
                    getMonthString(eList[i].startMonth) + ' ' + eList[i].startYear ,
            events: []
          };
        }
        renderMonthlyEvent[monthID].events.push(eList[i]);
        if (i === (limit -1)) {
          fmData.start = limit;
          fmData.remain = total - limit;
          fmData.showToEvent = limit;
          break;
        } else if (i === (total-1)) {
          fmData.showToEvent = total;
          fmData.remain = 0;
        }
      }

      renderCalendarDom.call(this, renderMonthlyEvent, start);
      checkLoadMoreResult.call(this, start);

      // Setting events for event-cards
      setCardEvents.call(this);

      // setting control navigation
      renderNavControl.call(this);
    };

    var setCommonEvent = function(){
      var that = this,
          loadMoreResults = this.vars.cardWrap.find('.event-result');

      loadMoreResults
        .find('.control-result.load-more a.load-more').on('click.' + pluginName, function(){
          renderEventCalendar.call(that);
          return false;
        }).end()
        .find('.control-result.no-more-result a.back-top').on('click.' + pluginName, function(){
          goToMonthIndex.call(that, null, 0);
        }).end()
        .find('.control-result.zero-result a').on('click.' + pluginName, function(){
          $(window).trigger('resetFilter');
        });
    };

    var setGlobalEvents = function(){
      var that = this,
          opt = this.options,
          vars = this.vars,
          nav = vars.navControl,
          elm = this.element,
          cardWrap = vars.cardWrap,
          registerPopup = $(opt.registerPopup),
          headerH = $('#header').outerHeight(),
          navMargin = 50,
          win = $(window),
          rand = Math.random() * 100;
      // Getting data when filtering event
      win.on('filterEventCalendar.id' + rand, function(e, data){
        if (data.condensedView != null && data.condensedView) {
          renderCondensedEventCalendar.call(that, data);
        } else {
          renderEventCalendar.call(that, data);
        }
        if (!data.resultBasedInUrlParameter) {
          win.off('filterEventCalendar.id' + rand);
        }
      });

      // closing register popup
      registerPopup
        .find('button.close')
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(){
            hideRegisterPoup.call(that);
          });

      function reposNav(){
        var topPin = elm.offset().top,
            topLine = win.scrollTop() + headerH;

        if (!nav.find('.main-control button').is(':visible')) {
          var marTop = 0;
          if (topPin < topLine) {
            marTop = topLine - topPin;
            if ((marTop + navMargin) < elm.outerHeight()) {
              nav.stop().animate({
                'margin-top': marTop
              });
              return;
            }
          }
        } else {
          var bottomLine = win.scrollTop() + win.outerHeight();
          if ((topPin + navMargin) < bottomLine && nav.data('origin-offset-top') > bottomLine) {
            nav.css({
              'position': 'fixed',
              'bottom': '0px',
              'left': '0px',
              'width': '100%'
            });
            return;
          }
        }
        nav.attr('style', '');
        return;
      }
      // Pinning navigation control when scroll
      win
        .off('scroll.navControl-' + pluginName)
        .on('scroll.navControl-' + pluginName, function(){
          reposNav();
        })
        .off('touchmove.navControl-' + pluginName)
        .on('touchmove.navControl-' + pluginName, function(){
          reposNav();
        });
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
          var opt = this.options,
              elm = this.element;
          this.vars = {
            navControl: elm.find('.' + opt.navClass),
            feature: elm.find('.' + opt.featureClass),
            cardWrap: elm.find('.' + opt.cardsWrapClass),
            fmData: null,
            fmDataParams: {
              showToEvent: 0,
              total: 0,
              remain: 0,
              lastestMonth: null
            }
          };

          // loadEvents.call(this);
          setGlobalEvents.call(this);
          setCommonEvent.call(this);
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        view: 'normal', //the view-mode normal or condensed
        cardNum: 5,
        navClass: 'control-nav',
        featureClass: 'feature-event',
        cardsWrapClass: 'event-card-block',
        registerPopup: '.popup.register-popup'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

(function($, window) {
    'use strict';

    var pluginName = 'expandContent';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.handle = $('[data-expand-handle][href="#' + this.element.attr('id') + '"],' + '[data-expand-handle][data-target="#' + this.element.attr('id') + '"]');
            this.title = this.handle.find('[data-expand-title]');
            this.default = this.element.hasClass(this.options.expandedClass) ? 'show' : 'hide';
            this.isTransitioning = false;
            this.close = $(this.options.close, this.element);
            this.handle
                .off('click.' + pluginName)
                .on('click.' + pluginName, $.proxy(function (e) {
                    if (!$(e.target).attr('data-target')) {
                        e.preventDefault();
                    }
                    this.toggle();
                }, this));

            this.close
                .off('click.' + pluginName)
                .on('click.' + pluginName, $.proxy(function (e) {
                    e.preventDefault();
                    this.toggle();
                }, this));
        },
        toggle: function() {
            this[this.element.hasClass(this.options.expandedClass) ? 'hide' : 'show']();
        },
        show: function() {
            if (this.isTransitioning || this.element.hasClass(this.options.expandedClass)) {
                return;
            }

            this.isTransitioning = true;

            var options = this.options,
                element = this.element,
                complete;

            if(options.hidehandler){
                this.handle.hide();
            }

            this.handle.addClass(options.activeHandle);

            this.title.slideUp(options.transitionTitle);

            complete = function () {
                element.addClass(options.expandedClass).removeAttr('style');
                this.isTransitioning = false;
            };

            element.slideDown(options.transitionContent, $.proxy(complete, this));
        },
        hide: function() {
            if (this.isTransitioning || !this.element.hasClass(this.options.expandedClass)) {
                return;
            }

            this.isTransitioning = true;

            var options = this.options,
                element = this.element,
                complete;



            this.handle.removeClass(options.activeHandle);

            this.title.slideDown(options.transitionTitle);

            complete = function () {
                element.removeClass(options.expandedClass).removeAttr('style');
                this.isTransitioning = false;
                if(options.hidehandler){
                    this.handle.fadeIn(options.transitionTitle, function(){
                        $(this).removeAttr('style');
                    });
                }
            };

            element.slideUp(options.transitionContent, $.proxy(complete, this));
        },
        destroy: function() {
            this[this.default]();
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        expandedClass: 'in',
        activeHandle: 'active',
        close:'',
        hidehandler: false,
        transitionContent: 400,
        transitionTitle: 200
    };

    $(function() {
        $('[data-expand-content]')[pluginName]();
        $('.result-card-cmp').first().find('[data-expand-content]')[pluginName]('show');
    });
}(jQuery, window));

(function($, window) {
    'use strict';

    $(function() {

        var filterForm = $('[data-filters]'),
            searchContainer = $('#search-result-ajax'),
            pagination = searchContainer.children('nav'),
            title = searchContainer.children('h3'),
            list = searchContainer.children('ul'),
            eventContainer = $('.event-calendar[data-event-calendar]'),
            handlers = filterForm.find(':checkbox, :radio, :text, select'),
            types = filterForm.find('[data-type]'),
            searchPage = $('#search-page'),
            term = $('#search-term'),
            numberFilters = $('.num-filters');

        function buildParams(pageNumber, reinit){
            var url = '',
                numOfGroup = 0;
            pageNumber = pageNumber || 1;
            types.each(function(){
                var current = $(this),
                    items = current.find(':checkbox:checked, :radio:checked, :text, select'),
                    type = current.data('type');
                url += '&' + type + '=';
                if(items.length){
                    var values = [],
                        hasValue = false;

                    items.each(function(){
                        var val = $(this).val();
                        if(val){
                            hasValue = true;
                        }
                        values.push(val);
                    });

                    url += values.join('|');

                    if(hasValue){
                        numOfGroup += 1;
                    }
                }
            });
            url = 'search-page=' + searchPage.val() + '&search-term=' + term.val() + url;

            if(pageNumber){
                url += '&page-number=' + pageNumber;
            }

            // Add URL for loading event calendar first data
            if (eventContainer.length > 0) {
                var ecUrl = eventContainer.data('event-calendar-path');
                if (ecUrl != null && ecUrl !== '') {
                    url += '&event-calendar-path=' + ecUrl;
                }
            }

            numberFilters.text(numOfGroup);
            loadAjax(url, reinit);
        }

        function paging(items, itemsOnPage, currentPage){
            if(itemsOnPage > items || items === 0){
                pagination.empty();
            }
            else{
                pagination.pagination({
                    items: items,
                    itemsOnPage: itemsOnPage,
                    currentPage: currentPage,
                    prevText: window.L10n.text.prev,
                    nextText: window.L10n.text.next,
                    ellipseText: '...',
                    listStyle: 'pagination',
                    preventClick: true,
                    onPageClick: function(pageNumber) {
                        buildParams(pageNumber, false);
                    }
                });
            }
        }

        function loadAjax(url, reinit){
            $.ajax({
                url: filterForm.attr('action') + '?' + url,
                type: filterForm.attr('method'),
                success: function(data){
                    if (searchContainer.length > 0) {
                        renderSearchResult(data);
                    } else if (eventContainer.length > 0) {
                        renderEventCalendar(data);
                    }

                }
            });
        }

        function renderEventCalendar(data) {
            $(window).trigger('filterEventCalendar', data);
        }

        function renderSearchResult(data) {
            list.empty();
            title.text(data.resultslabel);

            if(typeof data === 'string'){
                data = $.parseJSON(data);
            }

            if(data && data.searchResultBeans){
                var len = data.searchResultBeans.length;
                if(len && data.resultCount){
                    var template = [];
                    var i;
                    var item;
                    var breadCrumbLength;
                    var j;
                    var breadCrumb;
                    for(i = 0; i < len; i = i + 1){
                        item = data.searchResultBeans[i];
                        breadCrumbLength = item.breadcrumbItems.length;
                        template.push('<li><div class="result-container-block">');
                        if(item.iconPath){
                            template.push('<div class="icon-box"><img src="' + item.iconPath + '" alt="" class="img-responsive" /></div>');
                        }
                        template.push('<div class="text-box">');
                        if (breadCrumbLength) {
                            template.push('<ol class="breadcrumb">');
                            for (j = 0; j < breadCrumbLength; j = j + 1) {
                                breadCrumb = item.breadcrumbItems[j];
                                if (breadCrumb) {
                                    template.push('<li><a href="' + breadCrumb.link + '" title="' + breadCrumb.heading + '"><span>' + breadCrumb.heading + '</span><span class="wi-icon icon-arrow"></span></a></li>');
                                }
                            }
                            template.push('</ol>');
                        }

                        template.push('<a href="' + item.url + '" class="text">' + item.title + '</a>');

                        if (item.description) {
                            template.push('<p class="hidden-xs desc">' + item.description + '</p>');
                        }

                        template.push('</div>');
                        template.push('</div></li>');
                    }
                    list.html(template.join(''));
                    if(reinit){
                        paging(data.resultCount, data.numberToDisplay, data.currentPage);
                    }
                }
                else{
                    pagination.empty();
                }
            }
            else{
                pagination.empty();
            }
        }

        function setText(el){
            el = $(el);
            if(el.is(':radio')){
                var desc = el.closest('fieldset').find('.decs');
                if(desc.length){
                    desc.text(el.next().text());
                }
            }
        }

        function resetFilter() {
            filterForm[0].reset();
            handlers.filter(':radio:checked').each(function(){
                setText(this);
            });
            handlers.filter('select').each(function(){
                var select = $(this);
                select.parent().find('.visible-value').text(select.children('option:eq(0)').text());
            });
            buildParams(1, true);
        }

        handlers.on('change.filters', function(){
            setText(this);
            buildParams(1, true);
        });

        paging(searchContainer.data('result-count'), searchContainer.data('number-to-display'), searchContainer.data('current-page'));

        $('.btn-reset-filters').on('click', resetFilter);
        $(window).on('resetFilter', resetFilter);

        $('[data-check-all]').on('change.checkall', function(){
            var el = $(this);
            if(el.prop('checked')){
                var siblings = el.parent().siblings();
                siblings.addClass('hidden');
                siblings.find(':checkbox').prop('checked', false);
            }
            else{
                el.parent().siblings().removeClass('hidden');
            }
        });

        if (eventContainer.length > 0) {
            buildParams(1, true);
        }
    });

}(jQuery, window));

(function($, window) {
    'use strict';

    var pluginName = 'gallery';

    var win = $(window),
        body = $('body'),
        bkgOverlay = '<div class="background-overlay"></div>',
        sliderItemTemplate = '<div><div class="image">' +
                                    '<a href="#" title="photo gallery"><img src="" alt="gallery"></a>' +
                                    '<div class="message-to-landscape">Tilt your phone for a larger version</div></div>' +
                                '<div class="social-gallery">' +
                                    '<div class="clearfix">' +
                                        '<div class="pull-left">2 of 12</div>' +
                                        '<div class="pull-right">' +
                                            '<div class="social-sharing">' +
                                                '<div data-share-button="" class="share-button sharer-0" style="display: block;"><label class="entypo-export"><span>Share</span></label><div class="social load top center networks-5"><ul><li class="entypo-pinterest" data-network="pinterest"></li><li class="entypo-twitter" data-network="twitter"></li><li class="entypo-facebook" data-network="facebook"></li><li class="entypo-gplus" data-network="google_plus"></li><li class="entypo-paper-plane" data-network="email"></li></ul></div></div>' +
                                            '</div><a href="#" title="Download" class="download-button" target="_blank"><span aria-hidden="true" class="icon-download"></span><span class="text hidden-xs">Download</span></a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<p class="content"></p>' +
                            '</div></div>',

        thumbItemTemplate = '<div><div class="image">' +
                                '<a href="#" title="photo gallery"><img src="" alt="gallery"></a>' +
                            '</div></div>';

    var resizeDelay = 200,
        timer = null;

    var loadGallery = function(index) {
        var that = this;

        Site.showLoading();
        getDataSuccessHandler.call(that, $('[data-gallery-source]').data('gallery-source'), index);
    };

    var getDataSuccessHandler = function(data, index) {
        var i, num, item, thumb,
            that = this,
            vars = that.vars,
            len = data.length,
            strImageItem = '',
            strThumbItem = '';

        if(!len){
            Site.hideLoading();
        }

        for (i = 0; i < len; i += 1) {
            num = i + 1;
            item = $(sliderItemTemplate);
            thumb = $(thumbItemTemplate);

            $('.image img', item).prop('src', data[i].src);
            $('.social-gallery .content', item).text(data[i].caption);
            $('.social-gallery .pull-left', item).text(num + ' of ' + len);
            $('.download-button', item).attr('href', window.location.origin + '/bin/boqs-redesign/download?image=' + data[i].src);
            strImageItem += item.prop('outerHTML');

            $('.image img', thumb).prop('src', data[i].thumbSrc);
            strThumbItem += thumb.prop('outerHTML');

            cloneImage.call(that, data[i].src);
            cloneImage.call(that, data[i].thumbSrc);
        }
        vars.imageSlider.append(strImageItem);
        vars.thumbSlider.append(strThumbItem);

        initSlider.call(that, index);

        setTimeout(function() {
            vars.isWaiting = false;
            if (vars.numImagesLoaded === vars.arrCloneImages.length) {
                Site.hideLoading();
                showPopup.call(that);
            }
        }, that.options.timeoutLoading);
    };

    var cloneImage = function(src) {
        var that = this,
            imgTemp = new window.Image();

        var imgComplete = function() {
            var vars = that.vars;
            vars.numImagesLoaded += 1;
            if (!vars.isWaiting && vars.numImagesLoaded === vars.arrCloneImages.length) {
                Site.hideLoading();
                showPopup.call(that);
            }
        };

        imgTemp.onload = imgComplete;
        imgTemp.onerror = imgComplete;
        imgTemp.src = src;

        that.vars.arrCloneImages.push(imgTemp);
    };

    var initSlider = function(index) {
        var vars = this.vars,
            options = this.options;

        vars.imageSlider.slick({
            slidesToShow: options.slidesToShowSlide,
            slidesToScroll: options.slidesToScrollSlide,
            arrows: options.arrowsSlide,
            fade: options.fadeSlide,
            asNavFor: options.sliderThumbSelector
        });

        vars.thumbSlider.slick({
            slidesToShow: options.slidesToShowNav,
            slidesToScroll: options.slidesToScrollNav,
            centerMode: options.centerModeNav,
            centerPadding: options.centerPaddingNav,
            focusOnSelect: options.focusOnSelectNav,
            asNavFor: options.sliderImageSelector
        });

        vars.imageSlider.on('afterChange', function(event, slick, currentSlide) {
            var thumbItems = vars.thumbSlider.find('.slick-slide').not('.slick-cloned');
            if($(event.target).is(vars.imageSlider) && slick){
                thumbItems.removeClass(options.classThumbActive);
                thumbItems.eq(currentSlide).addClass(options.classThumbActive);
            }
        });

        $('.slick-prev', vars.imageSlider)
        .add($('.slick-next', vars.imageSlider))
        .removeAttr('style');

        vars.isInited = true;
        vars.imageSlider.slick('slickGoTo', index);

        if ($.isFunction(options.renderSuccessCallback)) {
            options.renderSuccessCallback();
        }
    };

    var resizeSlideshow = function() {
        var height = window.innerHeight || win.height();

        height -= $(this.options.headerSelector).outerHeight();

        if (!Site.isMobile()) {
            height -= this.vars.thumbSlider.outerHeight();
        }
        this.vars.imageSlider.css('height', height);
    };

    var showPopup = function() {
        var that = this,
            vars = that.vars;

        this.vars.bkgElement.hide().appendTo(body).fadeIn();
        if (!Site.isMobile()) {
            this.vars.popupElement.fadeIn(function() {
                vars.imageSlider.resize();
                vars.thumbSlider.resize();
            });
        } else {
            this.vars.popupElement.css('top', '100%').show().animate({
                'top': 0
            }, function() {
                vars.imageSlider.resize();
                vars.thumbSlider.resize();
            });
        }
    };

    var hidePopup = function() {
        this.vars.bkgElement.fadeOut(function() {
            $(this).remove();
        });
        if (!Site.isMobile()) {
            this.vars.popupElement.fadeOut();
        } else {
            this.vars.popupElement.slideUp();
        }
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this,
                options = that.options;

            that.vars = {
                isInited: false,
                isWaiting: true,

                arrCloneImages: [],
                numImagesLoaded: 0,

                bkgElement: $(bkgOverlay),
                popupElement: $(options.galleryPopupSelector, that.element),
                imageSlider: $(this.options.sliderImageSelector, that.element),
                thumbSlider: $(this.options.sliderThumbSelector, that.element)
            };

            that.vars.popupElement.appendTo('body').hide();

            $(options.thumbItemSelector, that.element).on('click.' + pluginName, function() {
                if (!options.gallerySource.length) { return; }
                var idx = $(this).index();

                if (!that.vars.isInited) {
                    loadGallery.call(that, idx);
                } else {
                    showPopup.call(that);
                    that.vars.imageSlider.slick('slickGoTo', idx);
                }
            });

            $(options.closePopupSelector).on('click.' + pluginName, function() {
                hidePopup.call(that);
            });

            win.on('resize.' + pluginName, function() {
                clearTimeout(timer);

                timer = setTimeout(function() {
                    resizeSlideshow.call(that);
                }, resizeDelay);
            });
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        slidesToShowSlide: 1,
        slidesToScrollSlide: 1,
        arrowsSlide: true,
        fadeSlide: true,

        slidesToShowNav: 8,
        slidesToScrollNav: 1,
        centerModeNav: true,
        centerPaddingNav: 0,
        focusOnSelectNav: true,

        gallerySource: '',
        timeoutLoading: 1000,
        headerSelector: '.close-gallery',
        thumbWrapperSelector: '.gallery-thumb',
        thumbItemSelector: '.thumb-image',
        sliderImageSelector: '.slider-for',
        sliderThumbSelector: '.slider-nav',
        galleryPopupSelector: '.popup-gallery',
        closePopupSelector: '.close-gallery',
        classThumbActive: 'photo-active',

        renderSuccessCallback: null
    };

    $(function() {
        var options = {
            renderSuccessCallback: function() {
                $('[data-share-button]').shareButton();
            }
        };

        $('[data-' + pluginName + ']')[pluginName](options);
    });

}(jQuery, window));

/**
*  @name plugin
*  @description description
*  @version 1.0
*  @options
*    option
*  @events
*    event
*  @methods
*    init
*    publicMethod
*    destroy
*/
(function($, window) {
    'use strict';

    var pluginName = 'load-more';

    var getHiddenItems = function() {
        var options = this.options,
            items = $(options.itemSelector + ':not(.' + options.ignoreClass + ').' + options.hiddenClass, this.element);
        return items;
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            that.vars = {
                triggerElement: $(that.options.triggerSelector, that.element)
            };

            that.hideItems();
            that.loadMore();

            that.vars.triggerElement.on('click.' + pluginName, function() {
                that.loadMore();
            });

        },
        hideItems: function() {
            var options = this.options,
                allItems = $(options.itemSelector, this.element);

            allItems.addClass(options.hiddenClass);
            if ($.isFunction(options.loadedMoreCallback)) {
                options.loadedMoreCallback();
            }
        },
        loadMore: function() {
            var options = this.options,
                items = getHiddenItems.call(this).slice(0, options.numberMore);

            if (items.length) {
                items.removeClass(options.hiddenClass).hide().fadeIn();
                if ($.isFunction(options.loadedMoreCallback)) {
                    items = getHiddenItems.call(this);
                    options.loadedMoreCallback(this.element, items.length);
                }
            }

            items = getHiddenItems.call(this).slice(0, options.numberMore);
            if (!items.length && $.isFunction(options.noMoreResultCallback)) {
                options.noMoreResultCallback();
            }
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        numberMore: 5,
        itemSelector: '.item',
        triggerSelector: '.load-more-trigger',
        hiddenClass: 'hidden',
        ignoreClass: 'ignore-item',
        loadedMoreCallback: null,
        noMoreResultCallback: null
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();

        var cardContainer = $('.card-container'),
            masonryGroup = $('.card-container[data-mymasonry]');

        var cardContainerOptions = {
            ignoreClass: 'no-filter',
            itemSelector: '.card-item:not(.control-result)',
            loadedMoreCallback: function(element, num) {
                var resultLabel = '',
                    desc = $('.load-more-trigger .desc'),
                    btnLoadMore = $('.load-more-trigger a.load-more');

                if (!!element) {
                    resultLabel = num === 1 ? element.data('result-type') : element.data('result-type-plural');
                    resultLabel = !!resultLabel ? resultLabel : '';
                }

                $('span.num', desc).html(num);
                $('span.result', desc).html(resultLabel);
                $('span:first', btnLoadMore).html(resultLabel);
                btnLoadMore.attr('title', btnLoadMore.text());

                if (masonryGroup.length && !Site.isMobile()) {
                    masonryGroup.mymasonry('restart');
                }
            },
            noMoreResultCallback: function() {
                $('.no-more-result', cardContainer).removeClass('hidden');
                $('.load-more-trigger', cardContainer).addClass('hidden');
                if (masonryGroup.length && !Site.isMobile()) {
                    masonryGroup.mymasonry('restart');
                }
            }
        };
        cardContainer[pluginName](cardContainerOptions);

        $('.no-more-result .back-top', cardContainer).on('click', function() {
            var isMobile = Site.isMobile(),
                header = isMobile ? $('#navbar-header').outerHeight() : $('#main-nav').outerHeight(),
                margin = isMobile ? 80 : 30;

            $('html, body').animate({
                scrollTop: cardContainer.offset().top - header - margin
            }, 400);
        });

        var teamContainer = $('[data-team]'),
            template = $('<div class="text-center show-more">' +
                            '<a href="#" title="' + window.L10n.text.moreteam + '" class="btn-tertiary">' + window.L10n.text.moreteam + '<span class="wi-icon icon-arrow"></span></a>' +
                        '</div>'),
            items = teamContainer.find('.text-image'),
            limit = 10;
        if (items.length > limit) {
            items.filter(':gt(' + (limit - 1) + ')').hide();
            template.insertAfter(items.last());
            teamContainer.on('click.' + pluginName, '.btn-tertiary', function(e) {
                e.preventDefault();
                items.filter(':hidden')
                    .fadeIn(function(){
                        $(this).removeAttr('style');
                    });
                $(this).parent().remove();
            });
        }
    });

}(jQuery, window));

/**
*  @name masonry
*  @description put blocks to columns
*  @version 1.0
*  @options
*    gutter
*    columnWidth
*    itemSelector
*    percentPosition
*  @events
*    event
*  @methods
*    init
*    restart
*    destroy
*/
(function($, window) {
    'use strict';

    var pluginName = 'mymasonry',
        timer = null,
        delay = 400;

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            that.element.masonry(that.options);

            $(window).on('resize', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    if (!Site.isMobile()) {
                        that.restart();
                    }
                }, delay);
            });
        },
        restart: function() {
            var that = this;
            that.element.masonry('destroy').masonry(that.options);
        },
        destroy: function() {
            this.element.masonry('destroy');
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if(window.console){
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        gutter: ".gutter-sizer",
        columnWidth: '.grid-sizer',
        itemSelector: '.block-item',
        percentPosition: true,
        onInitComplete: ''
    };

    $(function() {
        var curScreen = window.Site.isMobile() ? 'mobile' : 'desktop';

        $('[data-' + pluginName + ']').not('[data-desktop-only]')[pluginName]();
        if (curScreen === 'desktop') {
            $('[data-' + pluginName + '][data-desktop-only]')[pluginName]();
        }

        $(window).on('resize.' + pluginName, function() {
            var newScreen = window.Site.isMobile() ? 'mobile' : 'desktop';
            if (curScreen === newScreen) { return; }

            if (curScreen === 'desktop') {
                $('[data-' + pluginName + '][data-desktop-only]')[pluginName]('destroy');
                curScreen = 'mobile';
            }
            else if (curScreen === 'mobile') {
                $('[data-' + pluginName + '][data-desktop-only]')[pluginName]();
                curScreen = 'desktop';
            }
        });
    });

}(jQuery, window));

(function($, window, Site) {
    'use strict';

    var pluginName = 'navigation';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.target = $(this.element.data(pluginName));
            this.isTransitioning = false;
            this.element.on('click.navigationToggle', $.proxy(function(e) {
                e.preventDefault();
                this.toggleNav();
            }, this));
        },
        expand: function() {
            var that = this,
                options = this.options,
                target = this.target,
                thatElement = that.element;
            if (target.hasClass(options.classExpanded) || that.isTransitioning) {
                return;
            }
            that.isTransitioning = true;
            thatElement.addClass(options.classActive);
            target.fadeIn(options.duration, function() {
                $(this)
                    .addClass(options.classExpanded)
                    .removeAttr('style');
                that.isTransitioning = false;
            });
            thatElement.trigger('expandNav');
        },
        collapse: function(isClose) {
            var that = this,
                options = this.options,
                target = this.target,
                thatElement = that.element;
            if (!target.hasClass(options.classExpanded) || that.isTransitioning) {
                return;
            }
            thatElement.removeClass(options.classActive);
            if(isClose){
                target
                    .hide()
                    .removeClass(options.classExpanded)
                    .removeAttr('style');
            }else{
                that.isTransitioning = true;
                target.fadeOut(options.duration, function() {
                    $(this)
                        .removeClass(options.classExpanded)
                        .removeAttr('style');
                        that.isTransitioning = false;
                });
            }
            thatElement.trigger('collapseNav');
        },
        toggleNav: function() {
            if (!this.target.hasClass(this.options.classExpanded)) {
                this.expand();
            } else {
                this.collapse();
            }
        },
        destroy: function() {
            this.element.off('click.navigationToggle');
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        duration: 500,
        classExpanded: 'in',
        classActive: 'active'
    };

    $(function() {

        var win = $(window),
            headerEl = $('#header'),
            stickyClass = 'sticky',
            stickyClassMobile = 'sticky-xs',
            containerEl = $('#container'),
            htmlBody = $('html,body'),
            navbarHeader = $('#navbar-header'),
            dataHideNav = $('[data-hide-nav]'),
            mainEl = $('#main'),
            topBody = 0,
            isFocus = false,
            inputTag = $('input'),
            menuLi = $('#main-nav .main-menu > li:not(".logo-sticky")'),
            doc = $(document),
            welcome = $('[data-welcome-back]'),
            expandNavMobile = function () {
                containerEl.addClass(stickyClassMobile);
                mainEl.children().hide();
                dataHideNav.hide();
            },
            showOtherNavEl = function () {
                mainEl.children().show();
                dataHideNav.show();
                win.trigger('resize.sameheight');
            },
            inputFocus = function(top){
                if(isFocus){
                    headerEl.css({
                        'position': 'absolute',
                        'top': top
                    });
                }else{
                    headerEl.css('position', '');
                }
            },
            fixTopHeader = function () {
                if (Site.isMobile()) {
                    headerEl.add(mainEl).removeAttr('style');
                    containerEl.removeClass(stickyClass);
                    inputFocus(win.scrollTop());
                } else {
                    containerEl
                        .removeAttr('style')
                        .removeClass(stickyClassMobile);
                    showOtherNavEl();
                    var welcomeHeight = welcome.is(':hidden') ? 0 : welcome.outerHeight(true),
                        navbarHeaderHeight = navbarHeader.outerHeight(true) + welcomeHeight;

                    if (win.scrollTop() >= navbarHeaderHeight) {
                        headerEl.css('top', -navbarHeaderHeight);
                        mainEl.css('marginTop', headerEl.outerHeight(true));
                        containerEl.addClass(stickyClass);
                        if(Site.canTouch){
                            inputFocus(win.scrollTop() - navbarHeaderHeight);
                        }
                    } else {
                        headerEl.css('top', '');
                        mainEl.css('marginTop', '');
                        containerEl.removeClass(stickyClass);
                    }

                }
            };

        inputTag.off('blur focus').on('focus', function(){
            isFocus = true;
        }).on('blur', function(){
            isFocus = false;
        });

        $('[data-' + pluginName + ']')
            [pluginName]()
            .on('expandNav', function() {
                topBody = $('body').scrollTop();
                expandNavMobile();
            })
            .on('collapseNav', function() {
                containerEl
                    .removeAttr('style')
                    .removeClass(stickyClassMobile);
                showOtherNavEl();
                htmlBody.scrollTop(topBody);
             });

        win
            .on('scroll.' + pluginName, function () {
                fixTopHeader();
            })
            .on('resize.' + pluginName, function () {
                fixTopHeader();
                if(!Site.isMobile()){
                    $('[data-' + pluginName + ']')[pluginName]('collapse', true);
                }
            });

        menuLi
            .off('click.return')
            .on('click.return', function(e){
                if(Site.isTablet()){
                    var liEl = $(this);
                    e.preventDefault();
                    if(!liEl.hasClass('active')){
                        menuLi.removeClass('active');
                        liEl.addClass('active');
                    }else{
                        liEl.removeClass('active');
                    }
                }
            });

        doc
            .off('touchstart.return')
            .on('touchstart.return', function(e){
                if(!$(e.target).closest(menuLi).length){
                    menuLi.removeClass('active');
                }
                if(!$(e.target).is('input')){
                    if(isFocus){
                        inputTag.blur();
                    }
                }
            });

        $('[data-footer-mobile]').html($('[data-mobile-bottom]').clone());
        $('[data-header-mobile]').html($('[data-mobile-top]').clone());
    });

}(jQuery, window, Site));

/**
 *  @name popin
 *  @description show specific content in layer top screen
 *  @version 1.0
 *  @options
 *  @events
 *  @methods
 *    init
 *    show: show popin
 *    hide: hide popin
 *    destroy
 */
(function($, window) {
    'use strict';

    var pluginName = 'popin';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            that.vars = {
                contentElement: $(that.options.contentSelector, that.element)
            };

            that.element.hide();
            if (this.options.showonload) {
                this.show();
            }

            that.vars.contentElement.on('webkitTransitionEnd.' + pluginName +
                ' otransitionend.' + pluginName + ' oTransitionEnd.' + pluginName +
                ' msTransitionEnd.' + pluginName + ' transitionend.' + pluginName, function() {
                if (!that.element.hasClass(that.options.classShowAnimate)) {
                    that.element.hide();
                    if ($.isFunction(that.options.onHidden)) {
                        that.options.onHidden();
                    }
                }
                else {
                    if ($.isFunction(that.options.onShown)) {
                        that.options.onShown();
                    }
                }
            });

            $(that.options.closeButtonSelector, that.element).on('click.' + pluginName, function() {
                that.hide();
            });
        },
        show: function() {
            var that = this;
            that.element.show();
            setTimeout(function() {
                that.element.addClass(that.options.classShowAnimate);
            }, 200);
        },
        hide: function() {
            var that = this;
            that.element.removeClass(that.options.classShowAnimate);
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        contentSelector: '.modal-dialog',
        closeButtonSelector: '.close',
        classShowAnimate: 'show-animate',
        showonload: false,
        onShown: null,
        onHidden: null
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();

        var successPopup = $('#submit-success');
        $('button', successPopup).on('click.' + pluginName, function() {
            successPopup[pluginName]('hide') ;
        });

        $('#contact-button').on('click.' + pluginName, function() {
            $('.contact-popup')[pluginName]('show');
        });

        $('[data-show-event-registration]').on('click.' + pluginName, function(){
            $('.register-popup')[pluginName]('show');
        })
    });

}(jQuery, window));

/**
 *  @name popover
 *  @description: display the specific content follow target element
 *  @version 1.0
 */
(function($, window) {
    'use strict';

    var pluginName = 'popover';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    var getPosition = function(param){
        var opt = param.options,
            popover = param.vars.popover,
            popoverW = 0,
            popoverH = 0,
            element = param.element,
            trigger = param.vars.trigger,
            elW = element.outerWidth(),
            elH = element.outerHeight(),
            placement = opt.placement,
            position = {
                top: 0,
                left: 0
            },
            offset = element.offset(),
            status = 'none',
            offsetLeft = opt.offsetleft,
            offsetTop = opt.offsettop;

            if(element.data('showed')){
                status = 'block';
            }

            if(element.is(':hidden') && !trigger.is(':hidden')){
                offset = trigger.offset();
                placement = opt.placementtrigger;
                elW = trigger.outerWidth();
                elH = trigger.outerHeight();
                offsetLeft = opt.triggeroffsetleft;
                offsetTop = opt.triggeroffsettop;
            }

            popover.css({
                'opacity': 0,
                'display': 'block'
            });

            popoverW = popover.outerWidth();
            popoverH = popover.outerHeight();

            popover.css({
                'opacity': 1,
                'display': status
            });

        switch(placement){
            case 'top':
                position.top = offset.top - popoverH - offsetTop;
                position.left = offset.left - offsetLeft;
                break;
            case 'left':
                position.top = offset.top - offsetTop;
                position.left = offset.left - popoverW - offsetLeft;
                break;
            case 'right':
                position.top = offset.top - offsetTop;
                position.left = offset.left + elW + offsetLeft;
                break;
            case 'bottom':
                position.top = offset.top + elH + offsetTop;
                position.left = offset.left - offsetLeft;
                break;
        }
        return position;
    };

    var setPosition = function(param){
        if(param){
        var position = getPosition(param);
            param.vars.popover.css({
                top: position.top,
                left: position.left
            });
        }
    };

    var activePopover = [],
        acitveEl = [];



    Plugin.prototype = {
        init: function() {
            var that = this,
                opt = this.options;

            this.vars = {
                popover: $(opt.template).hide().appendTo(opt.container),
                trigger: $(opt.trigger)
            };

            this.element
                .off('click.' + pluginName)
                .on('click.' + pluginName, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var isShow = $(this).data('showed');
                    if(isShow){
                        that.hide();
                    }
                    else{
                        that.show();
                    }
                });

            this.vars.trigger
                .off('click.' + pluginName)
                .on('click.' + pluginName, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var isShow = that.element.data('showed');
                    if(isShow){
                        that.hide();
                    }
                    else{
                        that.show();
                    }
                });

            this.vars.popover
                .off('click.' + pluginName, opt.close)
                .on('click.' + pluginName, opt.close, function(e){
                    e.preventDefault();
                    that.hide();
                });

            $(window).on('resize.' + pluginName, function() {
                setPosition($('[data-'+ pluginName +'].active').data(pluginName));
            });

            $(document)
                .off('click.' + pluginName)
                .on('click.' + pluginName, function(e){
                    var target = $(e.target);
                    if(!target.closest('[data-popover-template]').length){
                        that.hide();
                    }
                });

            if(opt.autoshow){
                this.show();
            }
        },
        show: function() {
            var opt = this.options;

            setPosition(this);

            this.hide();

            if($.isFunction(opt.onBeforeShow)){
                opt.onBeforeShow();
            }

            this.vars.popover.fadeIn(this.options.duration, function(){
                if($.isFunction(opt.onAfterShow)){
                    opt.onAfterShow();
                }
            });

            this.element.data('showed', true).addClass('active');

            activePopover = this.vars.popover;
            acitveEl = this.element;

        },
        hide: function() {
            if(!acitveEl.length){
                return;
            }
            var data = acitveEl.data(pluginName),
                opt = data.options;

            if(activePopover.length){

                if($.isFunction(opt.onBeforeHide)){
                    opt.onBeforeHide();
                }
                activePopover.fadeOut(this.options.duration, function(){
                    if($.isFunction(opt.onAfterHide)){
                        opt.onAfterHide();
                    }
                    if(opt.removewhenclose){
                        $(this).remove();
                    }
                });

                acitveEl.data('showed', false).removeClass('active');

                activePopover = [];
                acitveEl = [];
            }
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };


    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        placement: 'right',
        placementtrigger: 'right',
        container: 'body',
        close: '.close',
        removewhenclose: false,
        trigger: '',
        offsettop: 0,
        offsetleft: 0,
        triggeroffsetleft: 0,
        triggeroffsettop: 0,
        template : '<div class="popover" data-popover-template></di>',
        duration: 200,
        autoshow: false,
        onBeforeShow: null,
        onAfterShow: null,
        onBeforeHide: null,
        onAfterHide: null

    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

/**
 *  @name same-height
 *  @description description
 *  @version 1.0
 *  @options
 *    block
 *  @methods
 *    init
 *    destroy
 */
(function($, window) {
    'use strict';

    var pluginName = 'sameheight',
        win = $(window);

    var setHeight = function() {
        var maxHeight = 0;
        this.vars.blocks.css('height', '').each(function() {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        this.vars.blocks.css('height', maxHeight);
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;
            that.vars = {
                blocks: $(that.options.block, that.element)
            };
            win.on('resize.' + pluginName, $.proxy(setHeight, that)).trigger('resize.' + pluginName);
        },
        destroy: function() {
            win.off('resize.' + pluginName);
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        block: '[data-item]'
    };

    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));
/**
 *  @name search
 *  @description prevent perform search functionality if no search value
 *  @version 1.0
 *  @options
 *    no option
 *  @events
 *    no event
 *  @methods
 *    init
 *    destroy
 */
(function($, window) {
    'use strict';

    var pluginName = 'search';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }


    Plugin.prototype = {
        init: function() {
            var that = this,
                el = that.element,
                searchBox = el.find(':text, input[type=search]').filter(':enabled');

            if (searchBox.length) {
                el.on('submit.' + pluginName, function() {
                    return !!searchBox.val();
                });
            }
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {};

    $(function() {
        var inputEl = $('[data-input-focus]'),
            inputContentSelector = '[data-input-content]',
            focusClass = 'focused';

        inputEl
            .off('focus.' + pluginName)
            .on('focus.' + pluginName, function () {
                $(this).closest(inputContentSelector).addClass(focusClass);
            })
            .off('blur.' + pluginName)
            .on('blur.' + pluginName, function () {
                $(this).closest(inputContentSelector).removeClass(focusClass);
            });

        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

(function($, window) {
    'use strict';

    var pluginName = 'shareButton',
        shareButtonSelector = '[data-share-button]';

    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var data = this.element.data(),
            options = {
                title: window.L10n.shareButton.title,
                networks: {
                    google_plus: {
                      enabled: true,
                      url: data.url
                    },
                    twitter: {
                      enabled: true,
                      url: data.url,
                      description: data.description
                    },
                    facebook: {
                      enabled: true,
                      load_sdk: false,
                      url: data.url,
                      title: data.title,
                      description: data.description,
                      image: data.image
                    },
                    pinterest: {
                      enabled: true,
                      url: data.url,
                      image: data.image,
                      description: data.description
                    },
                    email: {
                      enabled: true,
                      title: data.title,
                      description: data.description
                    }
                  }
            };

            this.shareButton = new window.Share(shareButtonSelector, options);
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
    };

    $(function() {
        $(shareButtonSelector)[pluginName]();
    });

}(jQuery, window));

(function($, window, Site) {
    'use strict';

    var pluginName = 'tabs';

    var timer = null,
        actTab = function(hrefAnchor, isDelay) {
        var options = this.options;

        this.vars.listTabContent.find(hrefAnchor)
        .css({
            display: 'block',
            opacity: 0
        });

        if ($.isFunction(options.onBeforeAction)) {
            options.onBeforeAction(isDelay);
        }

        this.vars.listTabContent.find(hrefAnchor)
        .animate({
            opacity: 1
        }, options.duration, function() {
            $(this).addClass(options.classActive).removeAttr('style');
        })
        .siblings().stop().removeClass(options.classActive).hide().removeAttr('style');
    };

    var toggleTabs = function() {
        var vars = this.vars,
            options = this.options;

        if (vars.listTabLinks.parent().hasClass(options.moreTwoTabs)) {
            vars.listTabLinks.parent().toggleClass(options.classExpend);
        }
    };

    var checkTabZone = function() {
        var topScroll = this.vars.win.scrollTop();
        if (topScroll >= (this.vars.topEle - this.vars.headerHeight) &&
            topScroll <= (this.vars.topEle + this.element.outerHeight() - this.vars.heightTabLink)) {
            return true;
        } else {
            return false;
        }
    };

    var fixedListTabLink = function() {
        var options = this.options,
            vars = this.vars;

        var removeFixed = function() {
            vars.listTabContent.removeAttr('style');
            vars.listTabLinks.closest(options.wrapTabLinks).removeAttr('style').css('position', 'relative');
        };

        if (!Site.isMobile()) {
            removeFixed();
            return;
        }

        this.vars.headerHeight = $('header').outerHeight();
        
        if (checkTabZone.call(this)) {
            vars.listTabContent.css('padding-top', vars.heightTabLink);
            vars.listTabLinks.closest(options.wrapTabLinks).css({
                'position': 'fixed',
                'top': vars.headerHeight,
                'width': vars.widthEle,
                'z-index': 1
            });
        } else {
            removeFixed();
        }
    };

    var setHashLocation = function(href) {
        var id = href.replace(/^.*#/, ''),
            elem = document.getElementById(id);
        elem.id = id + '-tmp';
        window.location.hash = href;
        elem.id = id;
    };

    var setDefaultTab = function() {
        var that = this,
            options = this.options,
            hashLocation = window.location.hash,
            defaultTabLink, defaultAnchor;

        defaultTabLink = this.vars.listTabLinks.find('li').eq(options.defaultTab);
        defaultAnchor = defaultTabLink.children('a').attr('href');

        if (hashLocation && options.isHash &&
            this.element.find(hashLocation).length) {

            defaultAnchor = hashLocation;
            defaultTabLink = this.vars.listTabLinks.find('li').has('a[href="' + defaultAnchor + '"]');
        }

        defaultTabLink.addClass(options.classActive).siblings().removeClass(options.classActive);
        that.vars.toggleTab.text(this.vars.listTabLinks.find('a[href="' + defaultAnchor + '"]').text());
        actTab.call(that, defaultAnchor, true);
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this,
                delay = 100,
                options = this.options;

            this.vars = {
                listTabLinks: that.element.find(options.tabLinks),
                listTabContent: that.element.find(options.tabContents),
                toggleTab: that.element.find(options.tabToggle),
                win: $(window),
                heightEle: that.element.height(),
                widthEle: that.element.width(),
                topEle: that.element.offset().top,
                headerHeight: 0,
                curScreen: Site.isMobile() ? 'mobile' : 'desktop'
            };
            that.vars.heightTabLink = that.vars.listTabLinks.outerHeight();
            that.vars.bottomEle = that.vars.topEle + that.vars.heightEle;

            setDefaultTab.call(this);
            this.changeTab();

            this.vars.win
                .on('scroll.' + pluginName, function() {
                    fixedListTabLink.call(that);
                })
                .on('resize.' + pluginName, function() {
                    that.vars.heightEle = that.element.height();
                    that.vars.widthEle = that.element.width();
                    that.vars.topEle = that.element.offset().top;
                    that.vars.heightTabLink = that.vars.listTabLinks.height();
                    that.vars.bottomEle = that.vars.topEle + that.vars.heightEle;

                    that.vars.listTabLinks.closest(options.wrapTabLinks).css({
                        'width': that.vars.widthEle
                    });
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fixedListTabLink.call(that);
                    }, delay);
                });

            this.vars.toggleTab.on('click.' + pluginName, function(e) {
                e.preventDefault();
                toggleTabs.call(that);
            });
        },
        changeTab: function() {
            var that = this;

            this.vars.listTabLinks.on('click.' + pluginName, 'li a', function(e) {
                var self = $(this),
                    hrefAnchor = self.attr('href'),
                    options = that.options;

                e.preventDefault();

                if (self.parent().hasClass('active')) {
                    return;
                }

                self.parent('li').addClass(options.classActive)
                    .siblings().removeClass(options.classActive);

                if (Site.isMobile() && checkTabZone.call(that)) {
                    $('html, body').animate({
                        scrollTop: that.vars.topEle - 2 * that.vars.headerHeight
                    }, 300);
                }

                actTab.call(that, hrefAnchor);

                if (that.vars.toggleTab === undefined) {
                    that.vars.toggleTab.text(self.text());
                    toggleTabs.call(that);
                }

                if (options.isHash) {
                    setHashLocation(hrefAnchor);
                }
            });
        },
        destroy: function() {
            // deinitialize
            this.vars.listTabLinks.off('click.' + pluginName, 'li a');
            this.vars.win
                .off('scroll.' + pluginName)
                .off('resize.' + pluginName);
            this.vars.toggleTab.off('click.' + pluginName);
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        duration: 400,
        defaultTab: 0,                  // start at 0
        isHash: true,
        wrapTabLinks: '.tabs',
        tabLinks: '.list-tabs',
        tabContents: '.tabs-content',
        tabToggle: '.tab-active',       // toggle element
        moreTwoTabs: 'more-two-tabs',
        classActive: 'active',          // class active toggle element
        classExpend: 'expanded',
        classFixListTab: 'fixed-list-tab',
        onAfterAction: null,
        onBeforeAction: null
    };

    $(function() {
        var masonryElement = $('[data-mymasonry]'),
            createMasonry = function() {
                masonryElement.mymasonry('restart');
            };

        var opts = {
            onBeforeAction: function(isDelay) {
                if (!Site.isMobile()) {
                    clearTimeout(timer);
                    if (!isDelay) { createMasonry(); }
                    else {
                        timer = setTimeout(function() {
                            createMasonry();
                        }, 300);
                    }
                }
            }
        };

        $('[data-' + pluginName + ']')[pluginName](opts);

    });

}(jQuery, window, Site));

/**
 *  @name validation
 *  @description description
 *  @version 1.0
 *  @options
 *    closestEl
 *    successClass
 *    errorClass
 *    labelClass
 *    errorTemplate
 *    errorAppendTo
 *    container
 *    isValidOnChange
 *    onChange
 *    onBeforeSubmit
 *    onAfterSubmit
 *    onError
 *  @events
 *    errorRendering
 *  @methods
 *    init
 *    attach
 *    detach
 *    destroy
 */
(function ($, window) {
    'use strict';

    var pluginName = 'validation',
        type = window.L10n.validator,
        regEmail = new RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
        regUrl = new RegExp('^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$'),
        regNumber = new RegExp('^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$'),
        regDigits = new RegExp('^[0-9]{1,}$');

    var checkData = function (el) {
        el = $(el);
        var data = el.data(),
            props = [];

        delete data.errors;
        var p;
        var keys = Object.keys(data);
        var key;
        for(p = 0; p < keys.length; p = p + 1){
            key = keys[p];
            if(data.hasOwnProperty(key) && key.indexOf('Message') === -1 && key.indexOf('-message') === -1){
                props.push(key);
            }
        }

        var idxRequired = $.inArray(type.required.name, props);
        if (idxRequired > 0) {
            props.splice(idxRequired, 1);
            props.unshift(type.required.name);
        }

        var idxEqualTo = $.inArray(type.equalto.name, props);
        if (idxEqualTo > 0) {
            props.splice(idxEqualTo, 1);
            props.push(type.equalto.name);
        }

        var i;
        var len = props.length;
        for (i = 0; i < len; i = i + 1) {
            validate(el, props[i], props);
        }
    },
    checkRange = function (num, arr) {
        var result = false;
        if (typeof arr === 'string') {
            arr = arr.replace(/[\[\]]/g, '').split(/[\s,]+/);
        }
        var min = parseInt(arr[0], 10),
            max = parseInt(arr[1], 10);
        result = !isNaN(num) && !isNaN(min) && !isNaN(max) && num >= min && num <= max;
        return [result, min, max];
    },
    validate = function (el, prop, props) {
        var val = el.val(),
            valid = false,
            msg = el.data(prop + 'Message') || type[prop].msg,
            errors = el.data('errors') || [];

        // reset errors
        el.data('errors', []);

        var groupEl;
        var idEqualEl;
        var equalEl;
        var range;
        var rangeLength;
        var re;

        switch (prop) {
            case type.required.name:
                if (!el.is(':password')) {
                    val = $.trim(val);
                }

                if (el.is(':radio') || el.is(':checkbox')) {
                    groupEl = $('[name="' + el.attr('name') + '"]');
                    if (groupEl.filter(':checked').length) {
                        valid = true;
                        groupEl.not(el).removeData('errors');
                    }
                }
                else {
                    if(val.length){
                        valid = true;
                    }
                    else{
                        valid = false;
                    }
                }
                break;

            case type.email.name:
                valid = regEmail.test(val);
                break;

            case type.url.name:
                valid = regUrl.test(val);
                break;

            case type.number.name:
                valid = regNumber.test(val);
                break;

            case type.digits.name:
                valid = val.length && regDigits.test(val);
                break;

            case type.equalto.name:
                idEqualEl = el.data(type.equalto.name);
                equalEl = $('#' + idEqualEl);
                valid = val === equalEl.val();
                if ($.inArray(type.required.name, props) !== -1) {
                    valid = valid && val.length;
                }
                msg = msg.format(idEqualEl);
                break;

            case type.max.name:
                val = parseFloat(val);
                valid = val < parseFloat(el.data(type.max.name));
                break;

            case type.min.name:
                val = parseFloat(val);
                valid = val > parseFloat(el.data(type.min.name));
                break;

            case type.maxlength.name:
                valid = val.length < parseInt(el.data(type.maxlength.name), 10);
                break;

            case type.minlength.name:
                valid = val.length > parseInt(el.data(type.minlength.name), 10);
                break;

            case type.range.name:
                range = checkRange(parseInt(val, 10), el.data(type.range.name));
                valid = range[0];
                msg = msg.format(range[1], range[2]);
                break;

            case type.rangelength.name:
                rangeLength = checkRange(val.length, el.data(type.rangelength.name));
                valid = rangeLength[0];
                msg = msg.format(rangeLength[1], rangeLength[2]);
                break;

            case type.pattern.name:
                re = new RegExp(el.data(type.pattern.name), 'gi');
                valid = re.test(val);
                break;
        }

        if (valid) {
            var idx = $.inArray(msg, errors);
            if (idx !== -1) {
                errors.splice(idx, 1);
                el.data('errors', errors);
            }
        }
        else {
            if ($.inArray(msg, errors) === -1) {
                errors.push(msg);
                el.data('errors', errors);
            }
        }
    },
    processMessages = function (that) {
        var results = [];
        that.vars.fields.each(function () {
            var el = $(this),
                errors = el.data('errors');
            if (errors) {
                results.push({ element: el, errors: errors });
            }
            el.trigger('errorRendering', errors);
        });

        if ($.isFunction(that.options.onError)) {
            that.options.onError.call(null, results);
        }
        else {
            if (that.vars.container.length) {
                showContainerError(that, results);
            }
            else {
                showInlineError(that, results);
            }
        }
    },
    showContainerError = function (that, results) {
        var listError = [];
        var i;
        var len = results.length;
        var result;
        var el;
        var closestEl;
        for (i = 0; i < len; i = i + 1) {
            result = results[i];
            el = result.element;
            closestEl = el.closest(that.options.closestEl);

            if (!closestEl.length) {
                closestEl = el;
            }

            if (result.errors.length) {
                closestEl.addClass(that.options.errorClass);
                listError.push('<p>' + results[i].errors[0] + '</p>');
            }
            else {
                closestEl.removeClass(that.options.errorClass).addClass(that.options.successClass);
            }
        }
        that.vars.container.empty().html(listError.join(''));
    },
    showInlineError = function (that, results) {
        var i;
        var len = results.length;
        var result;
        var el;
        var closestEl;
        var errorEl;
        for (i = 0; i < len; i = i + 1) {
            result = results[i];
            el = result.element;
            closestEl = el.closest(that.options.closestEl);
            errorEl = closestEl.find(that.vars.labelClass);

            if (!closestEl.length) {
                closestEl = el;
                errorEl = closestEl.nextAll(that.vars.labelClass);
            }

            if (result.errors.length) {
                closestEl.addClass(that.options.errorClass);
                if (errorEl.length) {
                    errorEl.html(that.options.errorTemplate.format(result.errors[0])).show();
                }
                else {
                    errorEl = $('<div class="' + that.options.labelClass + '">' + that.options.errorTemplate.format(result.errors[0]) + '</div>');
                    if (closestEl.is(el) || !that.options.errorAppendTo) {
                        closestEl.after(errorEl);
                    }
                    else {
                        errorEl.appendTo(closestEl.find(that.options.errorAppendTo));
                    }
                }
            }
            else {
                closestEl.removeClass(that.options.errorClass).addClass(that.options.successClass);
                errorEl.empty().hide();
            }
        }
    },
    bindEvent = function (that, els) {
        els.on('change.' + pluginName + ' blur.' + pluginName, function () {
            checkData(this);
            processMessages(that);

            if($.isFunction(that.options.onChange)){
                that.options.onChange.call(that);
            }
        });
    };

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var that = this;
            that.vars = {
                fields: $(),
                container: $(that.options.container)
            };

            that.element.attr('novalidate', true);

            if ($.isFunction(that.options.onBeforeInit)) {
                that.options.onBeforeInit.call(that, that.element);
            }

            var p;
            var keys = Object.keys(type);
            var key;
            var els;
            for(p = 0; p < keys.length; p = p + 1){
                key = keys[p];
                if(type.hasOwnProperty(key)){
                    els = $('[data-' + key + ']', that.element);
                    if (els.length) {
                        that.vars.fields = that.vars.fields.add(els);
                    }
                }
            }

            that.vars.labelClass = '.' + that.options.labelClass.split(/[\s,]+/).join('.');
            if(that.options.isValidOnChange){
                bindEvent(that, that.vars.fields);
            }

            that.element.on('submit.' + pluginName, function () {
                if ($.isFunction(that.options.onBeforeSubmit)) {
                    that.options.onBeforeSubmit();
                }

                that.vars.fields.each(function () {
                    checkData(this);
                });

                processMessages(that);

                var isValid;
                if($('.' + that.options.errorClass, that.element).length){
                    isValid = false;
                }
                else{
                    isValid = true;
                }

                if ($.isFunction(that.options.onAfterSubmit)) {
                    return that.options.onAfterSubmit.call(that, isValid);
                }

                return isValid;
            });
        },
        attach: function (props) {
            var that = this;
            var p;
            var keys = Object.keys(props);
            var key;
            var el;
            var currentProp;
            var r;
            var keysRule;
            var ruleName;
            var m;
            var keysMesg;
            var msgName;
            for(p = 0; p < keys.length; p = p + 1){
                key = keys[p];
                if(props.hasOwnProperty(key)){
                    el = $('[name="' + key + '"]', that.element);
                    currentProp = props[key];

                    keysRule = Object.keys(currentProp.rules);
                    for(r = 0; r < keysRule.length; r = r + 1){
                        ruleName = keysRule[r];
                        if(currentProp.rules.hasOwnProperty(ruleName)){
                            el.data(ruleName, currentProp.rules[ruleName]);
                        }
                    }

                    keysMesg = Object.keys(currentProp.messages);
                    for(m = 0; m < keysMesg.length; m = m + 1){
                        msgName = keysMesg[m];
                        if(currentProp.messages.hasOwnProperty(msgName)){
                            el.data(msgName + '-message', currentProp.messages[msgName]);
                        }
                    }

                    if (el.length) {
                        bindEvent(that, el);
                        this.vars.fields = that.vars.fields.add(el);
                    }
                }
            }
        },
        detach: function (props) {
            var p;
            var keys = Object.keys(props);
            var key;
            var el;
            var rules;
            var attrName;
            var i;
            var len;
            for(p = 0; p < keys.length; p = p + 1){
                key = keys[p];
                if(props.hasOwnProperty(key)){
                    el = $('[name="' + key + '"]', this.element);
                    rules = props[key].split(/[\s,]+/);
                    len = rules.length;
                    for (i = 0; i < len; i = i + 1) {
                        attrName = rules[i];
                        el.removeData(attrName);
                        el.removeAttr('data-' + attrName);
                        el.removeData(attrName + 'Message');
                        el.removeAttr('data-' + attrName + '-message');
                        el.off('change.' + pluginName + ' blur.' + pluginName);
                    }
                }
            }
        },
        destroy: function () {
            this.vars.fields.off('change.' + pluginName + ' blur.' + pluginName);
            this.vars.fields.each(function(){
                $(this).removeData('errors');
            });
            this.element.off('submit.' + pluginName);
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            } else if (window.console) {
                console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
            }
        });
    };

    $.fn[pluginName].defaults = {
        closestEl: '.form-group',
        successClass: 'success',
        errorClass: 'error',
        labelClass: 'wrap-error',
        errorTemplate: '{0}',
        errorAppendTo: null,
        container: null,
        isValidOnChange: true,
        onBeforeInit: null,
        onChange: null,
        onBeforeSubmit: null,
        onAfterSubmit: null,
        onError: null
    };

    $(function() {
        var headerError = $('.register-popup .wrap-error:first'),
            successPopup = $('#submit-success'),
            registerForm = $('.register-popup').closest('form'),
            contactPopup = $('.contact-popup'),
            contactForm = contactPopup.closest('form'),
            selInfo = $('[data-select-info]', contactForm),
            blockInfo = $('[data-more-info]', contactForm),
            contactPhoneContainer = $('[data-phone-container]', contactForm),
            placeholderPhone = contactPhoneContainer.data('placeholder-phone'),
            placeholderEmail = contactPhoneContainer.data('placeholder-email'),
            msgPhone = contactPhoneContainer.data('valid-phone'),
            msgEmail = contactPhoneContainer.data('valid-email'),
            titlePhone = contactPhoneContainer.data('title-phone'),
            titleEmail = contactPhoneContainer.data('title-email'),
            inputPhone = $('[data-phone-hidden]', contactForm);

        selInfo
            .off('change.moreInfo')
            .on('change.moreInfo', function() {
                if ($(this).find(':selected').data('option-info')) {
                    blockInfo.is(':hidden') && blockInfo.removeClass('hide').hide().slideDown();
                } else {
                    blockInfo.find(':checkbox:checked').prop('checked', false).trigger('change');
                    blockInfo.slideUp();
                }
            });

        contactPhoneContainer
            .off('change.type', 'select')
            .on('change.type', 'select', function() {
                var inputGroup = $(this).closest('.form-group'),
                    input = inputGroup.find('.wrap input'),
                    label = inputGroup.find('label'),
                    number = label.find('span'),
                    name = input.attr('name'),
                    objDetach = {},
                    objAttach = {},
                    str;


                if (this.selectedIndex) {
                    str = titleEmail;
                    input.attr('placeholder', placeholderEmail);
                    objDetach[name] = 'required digits';
                    objAttach[name] = {
                        rules: {
                            required: true,
                            email: true
                        },
                        messages: {
                            required: contactForm.data('required-message'),
                            email: msgEmail
                        }
                    };
                } else {
                    str = titlePhone;
                    input.attr('placeholder', placeholderPhone);
                    objDetach[input.attr('name')] = 'required email';
                    objAttach[name] = {
                        rules: {
                            required: true,
                            digits: true
                        },
                        messages: {
                            required: contactForm.data('required-message'),
                            digits: msgPhone
                        }
                    };
                }

                if (number.length) {
                    str += ' <span>' + number.text() + '</span> :';
                } else {
                    str += ' :';
                }

                label.html(str);
                input.val('');

                if (inputGroup.hasClass('error')) {
                    inputGroup.removeClass('error');
                    inputGroup.find('.wrap-error').remove();
                }
                contactForm.validation('detach', objDetach);
                contactForm.validation('attach', objAttach);
            });

        $('[data-add-contact]', contactForm)
            .off('click.addPhone')
            .on('click.addPhone', function(e) {
                e.preventDefault();
                var numberOfGroup = contactPhoneContainer.find('[data-added-phone]').length + 1,
                    tpl = $('<div class="form-group phone-component" data-added-phone>' +
                        '<div class="row">' +
                        '<div class="col-sm-6">' +
                        '<label for="phone-"' + numberOfGroup + '>' + titlePhone + ' <span>' + numberOfGroup + '</span>:</label><i aria-hidden="true" class="wi-icon icon-required"></i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="col-sm-6">' +
                        '<div class="input-group">' +
                        '<div class="dropdown">' +
                        '<div data-customselectbox="data-customselectbox" class="custom-select">' +
                        '<select class="custom-box">' +
                        '<option value="phone">Phone</option>' +
                        '<option value="email">Email</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="wrap">' +
                        '<input id="phone-' + numberOfGroup + '" name="phone-' + numberOfGroup + '" type="input" value="" placeholder="Enter phone number" autocomplete="off" class="form-control"/>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'),
                    obj = {};
                obj['phone-' + numberOfGroup] = {
                    rules: {
                        required: true,
                        digits: true
                    },
                    messages: {
                        required: contactForm.data('required-message'),
                        digits: msgPhone
                    }
                };
                tpl.insertBefore($(this).parent());
                $('[data-customselectbox]', tpl).customSelectBox();
                contactForm.validation('attach', obj);
            });

        var toggleWrapError = function(isValid) {
            if (isValid) {
                headerError.addClass('hidden');
            } else {
                headerError.removeClass('hidden');
            }
        };

        var options = {
            successClass: '',
            labelClass: 'col-sm-6 wrap-error',
            errorTemplate: '<i class="wi-icon icon-close-2"></i><p class="text-error">{0}</p>',
            errorAppendTo: '.row:last',
            onBeforeInit: function(form) {
                var requiredMsg = form.data('required-message');
                if (requiredMsg) {
                    form.find('[data-required]').data('required-message', requiredMsg);
                }
            },
            onChange: function() {
                toggleWrapError(!this.element.find('.wrap-error:visible').length);
            },
            onAfterSubmit: function(isValid) {
                toggleWrapError(isValid);
                return isValid;
            }
        };

        $('[data-' + pluginName + ']')[pluginName](options);

        registerForm[pluginName](options);

        var contactOpt = $.extend(options, {
            onBeforeInit: function(form) {
                var requiredMsg = contactPopup.data('required-message');
                if (requiredMsg) {
                    form.find('[data-required]').data('required-message', requiredMsg);
                }
            },
            onAfterSubmit: function(isValid) {
                if (isValid) {
                    var str = '';
                    $('[data-added-phone] input').each(function(index) {
                        var arrow = ' / ';
                        if (index === 0) {
                            arrow = '';
                        }
                        str += arrow + $(this).val();
                    });
                    inputPhone.val(str);
                } else {
                    return false;
                }
            }
        });

        contactForm[pluginName](contactOpt);

        var resetContact = function() {
            var errorField = contactForm.find('.form-group.error'),
                selectContainer = $('[data-customselectbox]', contactForm);

            selectContainer.each(function() {
                var select = $(this).find('select'),
                    showVal = $(this).find('.visible-value'),
                    firstOption = select.find('option:first');
                showVal.text(firstOption.text());
            });

            $('[data-added-phone]').remove();
            $('[data-more-info]').addClass('hide');

            contactForm[0].reset();

            $('[data-phone-container] select').trigger('change');

            errorField.removeClass('error');
            errorField.find('.wrap-error').remove();

            contactForm.validation('destroy');
            $('[data-phone-container] input').attr({
                'data-required': true,
                'data-digits': true,
                'data-digits-message': msgPhone
            });
            contactForm.validation(contactOpt);
        };

        $('.contact-popup').find('.icon-close-1, .btn-cancel')
            .off('click.reset')
            .on('click.reset', resetContact);


        var chkPrivacy = $('#checkbox2'),
            group = chkPrivacy.parent();
        chkPrivacy.on('errorRendering', function(e, errors) {
            var wrapError = group.next('.wrap-error');
            if ($(e.target).is(chkPrivacy) && errors && errors.length) {
                if (!wrapError.length) {
                    group.after('<div class="wrap-error"><i class="wi-icon icon-close-2"></i><p class="text-error">' + errors[0] + '</p></div>');
                }
            } else {
                group.next().remove();
            }
        });
    });

}(jQuery, window));

/**
*  @name video player
*  @description description
*  @version 1.0
*/

var BCL = {};
var videoContainer = jQuery('.video-container');
var onTemplateLoaded = function(experienceID) {
    'use strict';
    BCL[experienceID] = {
        player: brightcove.api.getExperience(experienceID)
    };
};

var onTemplateReady = function(evtObj) {
    'use strict';
    var expId = evtObj.target.experience.id;
    var currentPlayer = BCL[expId].player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    var videoWrapper = $('#' + expId).parent();

    BCL[expId].experienceModule = BCL[expId].player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    currentPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, function(event) {
        onPlay(event);
    });

    if(videoWrapper.length && videoWrapper.data('autoplay')){
        currentPlayer.play();
    }
};

function onPlay(event) {
    'use strict';
    var experienceID = event.target.experience.id;
    var p, keys = Object.keys(BCL), keyName, player, videoPlayer;
    for(p = 0; p < keys.length; p = p + 1){
        keyName = keys[p];
        if(keyName !== experienceID && keyName !== 'resizePlayer'){
            player = brightcove.api.getExperience(keyName);
            videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
            videoPlayer.pause(true);
        }
    }
}

jQuery(window).on('resize', function() {
    'use strict';
    BCL.resizePlayer();
});

BCL.resizePlayer = function() {
    'use strict';
    videoContainer.each(function() {
        var currentContainer = jQuery(this);
        var videoOuter = jQuery('.video-outer', currentContainer);
        videoOuter.width(currentContainer.width());
        var experienceID = videoOuter.find('iframe').attr('id');
        if (experienceID) {
            BCL[experienceID].experienceModule.setSize(videoOuter.width(), videoOuter.height());
        }
    });
};
/**
*  @name welcome
*/
(function($, window) {
    'use strict';
    
    $(function () {
        var welcomeBack = $('[data-welcome-back]'),
            body = $('body'),
            title = $('[data-title]', welcomeBack),
            icon =  $('[data-icon]', welcomeBack),
            url =  $('[data-url]', welcomeBack),
            close = $('.close-btn', welcomeBack),
            cookieName = 'welcome',
            cookie = window.Site.getCookie(cookieName),
            time = new Date().getTime(),
            limit = 1000 * 60 * 60 * 2,
            duration = 500,
            welcomeData = window.dataWelcomeData;

        if(welcomeData){
            welcomeData.time = new Date().getTime();
            window.Site.setCookie(cookieName, JSON.stringify(welcomeData), 7);
        }
        if(body.hasClass('home')){
            if(cookie){
                cookie = JSON.parse(cookie);
                if(time - cookie.time > limit){
                    title
                        .attr({
                            'href': cookie.url,
                            'title': cookie.title
                        })
                        .text(cookie.title);
                    if(cookie.icon){
                        icon.attr('src', cookie.icon).show();
                    }else{
                        icon.hide();
                    }
                    url.attr('href', cookie.url);
                    welcomeBack.slideDown(duration);

                    close.off('click.hide').on('click.hide', function(e){
                        e.preventDefault();
                        welcomeBack.slideUp(duration);
                        cookie.time = new Date().getTime();
                        window.Site.setCookie(cookieName, JSON.stringify(cookie), 7);
                    });
                }
            }
        }


    });
}(jQuery, window));
