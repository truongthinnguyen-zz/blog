/**
 * @name Site
 * @description Define global variables and functions
 * @version 1.0
 */
var Site = (function($, window, undefined) {
  var win = $(window),
      isTouchDevice = 'ontouchstart' in window;
  function initialize(map, mapCanvas) {
    var ratio = 1.176,
        w = mapCanvas.width(),
        h = w / ratio,
        latlng = new google.maps.LatLng(mapCanvas.data('lat'), mapCanvas.data('lng'));

    mapCanvas.width(w).height(h);
    var mapOptions = {
      zoom: 16,
      disableDefaultUI: true,
      center: latlng
    };
    map = new google.maps.Map(mapCanvas[0], mapOptions);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: 'images/point.png'
    });
  }

  return {
    backToTop: function(){
      $('.btn-backtop').on('click', function(){
        $('html, body').animate({ scrollTop: 0 }, 1000);
      });
    },
    quantity: function(container){
      var qttblocks = $('.quantity', container) || $('.quantity');
      if(qttblocks.length){
        qttblocks.each(function(){
          var quantityBlock = $(this);
          var el = $(':hidden', quantityBlock),
              spanDisplay = $('.value', quantityBlock),
              val = parseInt(el.val()) || 0;
          $('.btn-increase', quantityBlock).on('click', function(){
            el.val(++val);
            spanDisplay.text(val);
          });
          $('.btn-decrease', quantityBlock).on('click', function(){
            val = Math.max(0, --val);
            el.val(val);
            spanDisplay.text(val);
          });
        });
      }
    },
    deleteProduct: function(){
      var btnDels = $('.cart-table .ico-1');
      if(btnDels.length){
        btnDels.on('click', function(){
          $(this).closest('tr').fadeOut(function(){
            $(this).remove();
          });
        });
      }
    },
    loadMap: function(){
      var map,
          mapCanvas = $('.map');
      if(mapCanvas.length){
        google.maps.event.addDomListener(window, 'load', initialize(map, mapCanvas));
        google.maps.event.addDomListener(window, "resize", function() {
          initialize(map, mapCanvas);
        });
      }
    },
    quickview: function(){
      var els = $('.quickview');
      if(els.length){
        $('body').delegate('a.quickview', 'click', function(e) {
          e.preventDefault();
          var el = $(this),
              template = el.data('layer');
          if(template){
            template.layer('show');
          }
          else{
            $.ajax({
              url: el.attr('href'),
              success: function(res){
                if(res.length){
                  res = $(res).appendTo('body');
                  res.imagesLoaded(function(){
                    res.layer({
                      closeButton: '.ico-1',
                    });
                    Site.quantity(res);
                    res.layer('show');
                    el.data('layer', res);
                  });
                }
              }
            });
          }
        });
      }
    },
    menuOnMobile: function(){
      var icoMenu = $('.ico-mobile'),
          wrap = $('.wrap-header');
      if(icoMenu.length){
        icoMenu.on(isTouchDevice ? 'touchend' : 'click', function(){
          wrap.slideToggle();
        });
      }

      if(!isTouchDevice){
        win.on('resize.menuOnMobile', function(){
          var w = win.width();
          if(w < 1007){
            wrap.hide();
            wrap.find('.link a').on('click', function (e) {
              location.href = $(this).attr('href');
            });
            wrap.find('[data-navigation] li.active').removeClass('active');
          }
          else{
            wrap.show();
          }
        }).trigger('resize.menuOnMobile');
      }
      else{
        wrap.find('[data-navigation] li.active').removeClass('active');
      }
    },
    zoomImage: function(){
      var preview = $('.gallery-3 .preview img');
      if(!isTouchDevice && preview.length){
        preview.elevateZoom({
          gallery : 'gallery-zoom',
        });
      }
    }
  };

})(jQuery, window);

jQuery(function() {
  Site.backToTop();
  Site.quantity();
  Site.deleteProduct();
  Site.loadMap();
  Site.quickview();
  Site.menuOnMobile();
  Site.zoomImage();
});

/**
 *  @name accordion plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    toogle
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'accordion',
      isDevice = 'ontouchstart' in window,
      win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this;
      that.vars = {
        handlers: $(this.options.handlers, this.element),
        contents: $(this.options.contents, this.element),
        clickEvt: !isDevice ? 'click.' + pluginName : ' touchend.' + pluginName
      };

      that.vars.contents.hide();
      that.vars.handlers.on(that.vars.clickEvt, function (e) {
        if(win.width() < that.options.minWidthClick){
          e.preventDefault();
        }
        that.toogle(this);
      });

      if(that.options.hideOnResize){
        win.bind('resize.' + pluginName, function(){
          setTimeout(function(){
            that.vars.contents.hide();
          }, 100);
        });
      }

      if(typeof that.options.openIndex === 'number'){
        that.vars.handlers.eq(that.options.openIndex).addClass(that.options.activeClass);
        that.vars.contents.eq(that.options.openIndex).show();
      }
    },
    toogle: function (el) {
      var current = $(el).parent();
      if(current.children(this.options.contents).length === 0){
        return;
      }
      if (current.hasClass(this.options.activeClass)) {
        current.removeClass(this.options.activeClass);
        current.children(this.options.contents).stop().slideUp();
      }
      else {
        var beforeEl = this.vars.handlers.filter('.' + this.options.activeClass);
        if(beforeEl.length){
          beforeEl.removeClass(this.options.activeClass);
          beforeEl.children(this.options.contents).stop().slideUp();
        }

        current.addClass(this.options.activeClass);
        current.children(this.options.contents).stop().slideDown();
      }
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
      this.vars.handlers.off(this.vars.clickEvt);
      win.unbind('resize.' + pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    handlers: '>li>a',
    contents: '.sub-nav-1',
    activeClass: 'active',
    minWidthClick: null,
    hideOnResize: false,
    openIndex: null
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
      minWidthClick: 1007,
      hideOnResize: true
    });

    $('.accordions')[pluginName]({
      handlers: '.accordion > h3',
      contents: '.content',
      openIndex: 0
    });
  });

}(jQuery, window));


/**
 *  @name carousel plugin
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
;(function($, window, undefined) {
  var pluginName = 'carousel',
      dataColor = 'data-color';

  var setup = function(currentActive) {
    var wrapper = this.element.find(this.options.slideContain + ' > ul');
    var listLi = wrapper.children();
    var isTouchDevice = 'ontouchstart' in window;
    listLi.eq(0).clone().appendTo(wrapper);
    listLi.eq(listLi.length - 1).clone().prependTo(wrapper);

    this.vars = {
      win : $(window),
      currLiSize : this.options.navigation === 'verical' ? listLi.width() : listLi.height(),
      ulMarginNav: this.options.navigation === 'verical' ? 'margin-left' : 'margin-top',
      slideWrapper : wrapper,
      listLi: listLi,
      currentActive: currentActive || this.options.currentActive,
      liNumber : wrapper.children().length,
      thumbsWrapper: this.element.find(this.options.thumbsWrapper),
      startEvt : !isTouchDevice ? 'mousedown.' + pluginName : 'touchstart.' + pluginName,
      moveEvt : !isTouchDevice ? 'mousemove.' + pluginName : ' touchmove.' + pluginName,
      endEvt : !isTouchDevice ? 'mouseup.' + pluginName : ' touchend.' + pluginName,
      isPress: false,
      firstPoint: null,
      isAnimate: false,
      timer : null,
      delta: isTouchDevice ? 5 : 50
    };

    setupActive.call(this, this.vars.currentActive);
    this.vars.currentActive += 1;
    setupMargin.call(this);
  };

  var setupMargin = function(){
    this.vars.slideWrapper.css(this.vars.ulMarginNav, -1 * this.vars.currentActive * this.vars.currLiSize);
  };

  var setupActive = function(idx){
    this.vars.thumbsWrapper.find('.' + this.options.activeClass).removeClass(this.options.activeClass);
    this.vars.thumbsWrapper.find('li').eq(idx).addClass(this.options.activeClass);
  };

  var clearTime = function(){
    this.vars.timer && clearInterval(this.vars.timer);
  };

  var autoRun = function(){
    var that = this;
     if(this.options.autoSlide){
        this.vars.timer = setTimeout(function(){
          that.element.find(that.options.btnNext).trigger(that.vars.startEvt);
        }, that.options.autoSlide);
      }
  };

  var reset = function(){
    var listLi = this.vars.slideWrapper.children();
    listLi.eq(0).remove();
    listLi.eq(listLi.length - 1).remove();
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      setup.call(this);

      this.vars.win.bind('resize.' + pluginName, function(){
        that.resize();
      }).trigger('resize');

      var colorStyle = this.element.attr(dataColor);
      if(colorStyle){
        this.element.addClass(colorStyle);
      }

      this.element.find(this.options.btnNext).bind(this.vars.startEvt, function(){
        if(that.vars.isAnimate){
          return;
        }
        that.vars.currentActive = that.vars.currentActive + 1;
        that.slideTo(that.vars.currentActive);
        return false;
      });

      this.element.find(this.options.btnPrev).bind(this.vars.startEvt, function(){
        if(that.vars.isAnimate){
          return;
        }
        that.vars.currentActive = that.vars.currentActive - 1;
        that.slideTo(that.vars.currentActive);
      });

      this.vars.thumbsWrapper.find('li').bind(this.vars.startEvt, function(){
        if(that.vars.isAnimate){
          return;
        }
        that.vars.currentActive = $(this).index() + 1;
        that.slideTo(that.vars.currentActive);
      });

      if(this.options.touchable){
        that.vars.prevent = true;
        var startX, endX, startY, endY;

        /*
        this.vars.slideWrapper.delegate('li', this.vars.startEvt, function(e){
          e.preventDefault();
        });
        */

        that.vars.slideWrapper.unbind(that.vars.moveEvt).bind(that.vars.moveEvt, function(e) {
          if(!that.vars.prevent){
            e.preventDefault();
          }
          that.vars.prevent = false;
        });

        this.vars.slideWrapper.bind(this.vars.startEvt, function(e){
          clearTime.call(that);
          if(that.vars.isAnimate){
            return;
          }
          that.vars.isPress = true;

          /*that.vars.firstPoint = that.options.navigation === 'verical' ? !isNaN(e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX
            : !isNaN(e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;*/

          var targetTouch = null;
          if(e.originalEvent.targetTouches){
            targetTouch = e.originalEvent.targetTouches[0];
          }
          else{
            targetTouch = e.originalEvent;
          }
          startX = targetTouch.pageX;
          startY = targetTouch.pageY;
          that.vars.firstPoint = that.options.navigation === 'verical' ? startX : startY;

          //return false;
        });

        this.vars.win.bind(this.vars.moveEvt, function(e){
          if(that.vars.isAnimate){
            return;
          }

          if(that.vars.isPress){
            var changeTouch = null;
            if(e.originalEvent.changedTouches){
              changeTouch = e.originalEvent.changedTouches[0];
            }
            else{
              changeTouch = e.originalEvent;
            }
            endX = changeTouch.pageX;
            endY = changeTouch.pageY;

            var currentPageX = that.options.navigation === 'verical' ? endX : endY;
            var currentCss = -1 * that.vars.firstPoint + currentPageX - that.vars.currentActive * that.vars.currLiSize;
            that.vars.slideWrapper.css(that.vars.ulMarginNav, currentCss);

            var x = Math.abs(endX - startX);
            var y = Math.abs(endY - startY);
            if(x > y){
              that.vars.prevent = false;
            }
            else{
              that.vars.prevent = true;
            }

            /*var currentPageX = that.options.navigation === 'verical' ? !isNaN(e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX
              : !isNaN(e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;

            var currentCss = -1 * that.vars.firstPoint + currentPageX - that.vars.currentActive * that.vars.currLiSize;
            that.vars.slideWrapper.css(that.vars.ulMarginNav, currentCss);*/
          }
          //return false;
        });

        this.vars.win.bind(this.vars.endEvt, function(e){
          if(that.vars.isAnimate){
            return;
          }
          if(that.vars.isPress){
            var currentPageX = that.options.navigation === 'verical' ? !isNaN(e.pageX) ? e.pageX : e.originalEvent.changedTouches[0].pageX
              : !isNaN(e.pageY) ? e.pageY : e.originalEvent.changedTouches[0].pageY;

            if(Math.abs(currentPageX - that.vars.firstPoint) > that.vars.delta){
              if(currentPageX < that.vars.firstPoint){
                that.vars.currentActive = that.vars.currentActive + 1;
              }else{
                that.vars.currentActive = that.vars.currentActive - 1;
              }

              that.slideTo(that.vars.currentActive);
            }
            that.vars.isPress = false;
          }
          //return false;
        });
      }

      that.vars.listLi.eq(that.vars.currentActive - 1).addClass(that.options.activeClass);
      autoRun.call(this);
      $.isFunction(that.options.afterSlide) && that.options.afterSlide.call(that);
    },
    resize: function() {
      var that = this;
      if(this.options.navigation === 'verical'){
        this.vars.currLiSize = that.element.width();
        this.vars.slideWrapper.children('li').width(this.vars.currLiSize);
      }else{
        this.vars.currLiSize = this.vars.slideWrapper.find('img').height();
        this.element.height(this.vars.currLiSize);
        this.vars.slideWrapper.children('li').height(this.vars.currLiSize);
      }
      setupMargin.call(this);
    },
    slideTo: function(idx){
      if(this.vars.isAnimate){
        return;
      }
      var objDir = {};
      var that = this;
      clearTime.call(that);
      that.vars.isAnimate = true;
      if(idx >= this.vars.liNumber){
        idx = 1;
      }

      if(idx < 0){
        idx = this.vars.liNumber - 1;
      }

      objDir[this.vars.ulMarginNav] =  -1 * idx * this.vars.currLiSize;
      this.vars.slideWrapper.animate(objDir, that.options.duration, that.options.easing, function(){
        that.vars.isAnimate = false;

        if(idx === that.vars.liNumber - 1){
          that.vars.currentActive = 0 + 1;
        }

        if(idx === 0){
          that.vars.currentActive = that.vars.liNumber - 1 - 1;
        }

        setupActive.call(that, that.vars.currentActive - 1);
        setupMargin.call(that);
        that.vars.isAnimate = false;
        var current = that.vars.listLi.eq(that.vars.currentActive - 1);
        current.addClass(that.options.activeClass);
        that.vars.listLi.not(current).removeClass(that.options.activeClass);
        autoRun.call(that);
        $.isFunction(that.options.afterSlide) && that.options.afterSlide.call(that);
      });
    },
    refresh: function(){
      var that = this;
      var listLi = this.vars.wrapper.children();
      this.vars.liNumber = this.vars.slideWrapper.children().length;
      setupMargin.call(this);
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    btnNext:'.btn-next',
    btnPrev:'.btn-previous',
    slideContain: '.inner',
    thumbsWrapper: '.nav',
    navigation: 'verical',
    currentActive: 0,
    activeClass: 'active',
    autoSlide: 7000, //false, 5000
    touchable: true,
    easing: 'swing',
    duration: 700,
    beforeSlide: function(){},
    afterSlide: function(){}
  };

  $(function() {
    var animateTrigger = '[data-animate]',
        animateItems = $(animateTrigger),
        charactersTrigger = '[class^="char"],[class^="line"]';

    animateItems.each(function(index, el) {
      el = $(el);
      el.lettering(el.data('letter'));
    });

    animateItems.children(charactersTrigger).css({
      'visibility': 'hidden'
    });

    function animate(currentChar, effect) {
      currentChar.addClass('animated ' + effect)
        .css('visibility', 'visible')
        .show();

      currentChar.one('animationend webkitAnimationEnd oAnimationEnd', function () {
          currentChar.removeClass('animated ' + effect);
      });
    }

    $('[data-' + pluginName + ']')[pluginName]({
      autoSlide: false,
      afterSlide: function(){
        var container = this.vars.listLi.eq(this.vars.currentActive - 1);
        container.siblings().find(charactersTrigger).css({
          'visibility': 'hidden'
        });

        $(animateTrigger, container).each(function(){
          var el = $(this),
              chars = el.children(),
              type = el.data('type'),
              delayTime = el.data('delay'),
              letterType = el.data('letter');

          chars.css('visibility', 'hidden');

          if(letterType !== 'lines'){
            chars.css('display', 'inline-block');
          }

          if(type === 'shuffle'){
            chars = shuffle(chars);
          }
          else if(type === 'reverse'){
            chars = chars.toArray().reverse();
          }

          $.each(chars, function (i, c) {
            var charItem = $(c);
            var delay = type === 'sync' ? delayTime : delayTime * i * 1.5;

            var effect = charItem.closest(animateTrigger).data('animate');

            charItem.text() &&
              setTimeout(function () {
                animate(charItem, effect);
              }, delay);
          });
        });
      }
    });
  });

}(jQuery, window));

/**
 *  @name custom select plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    show
 *    hide
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'customselect',
      isDevice = 'ontouchstart' in window,
      ignoreTrigger = 'ignorefirst';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          select = $('select', that.element),
          options = select.children('option');
      that.vars = {
        template: $('<ul></ul>'),
        click: isDevice ? 'touchstart.' + pluginName : 'click.' + pluginName,
        doc: $(document)
      };

      for(var i = 0; i < options.length; i++){
        if(i === 0 && that.element.data(ignoreTrigger)){
          continue;
        }

        var opt = options[i];
        that.vars.template.append('<li data-val="' + opt.value + '">' + opt.text + '</li>');
      }

      that.element.append(that.vars.template);
      that.element.unbind(that.vars.click).bind(that.vars.click, function(e){
        e.preventDefault();
        e.stopPropagation();
        that.hide();
        that.show();
      });

      that.vars.doc.bind(that.vars.click, function(e){
        that.hide();
      });

      that.vars.template.children().unbind(that.vars.click).bind(that.vars.click, function(e){
        var el = $(this);
        $('span.text', that.element).text(el.text());
        select.val(el.data('val'));
        select.trigger('change');
      });
    },
    show: function() {
      if(this.options.effect === 'fade'){
        this.vars.template.is(':visible') ? this.vars.template.fadeOut(this.options.duration) : this.vars.template.fadeIn(this.options.duration);
      }
      else if(this.options.effect === 'slide'){
        this.vars.template.is(':visible') ? this.vars.template.slideUp(this.options.duration) : this.vars.template.slideDown(this.options.duration);
      }
    },
    hide: function(){
      var visibleTpt =  $('ul:visible', $('[data-' + pluginName + ']'));
      if(this.options.effect === 'fade'){
        visibleTpt.length && visibleTpt.fadeOut(this.options.duration);
      }
      else if(this.options.effect === 'slide'){
        visibleTpt.length && visibleTpt.slideUp(this.options.duration);
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    effect: 'slide',  // fade, slide
    duration: 200
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
    $('select[data-direct-url]').on('change', function(){
      var el = $(this);
      window.location.href = el.data('direct-url') + el.val();
    });
  });

}(jQuery, window));

/**
 *  @name layer plugin
 *  @description layer plugin
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
;(function($, window, undefined) {
  var pluginName = 'layer',
      win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this,
          options = this.options,
          clickevt = 'click.' + pluginName;

      that.overlay = $('.overlay');
      if(!that.overlay.length){
        that.overlay = $('<div class="overlay" />').appendTo('body');
      }
      $(that.options.closeButton, that.element)
        .add($(that.overlay))
        .unbind(clickevt).bind(clickevt, function (e) {
          e.preventDefault();
          that.hide();
        });

      win.bind('resize.' + pluginName, function () {
        that.reposition();
      });
    },
    reposition: function() {
      var that = this;
      if(that.isOpen) {
        var winHeight = win.height(),
            elHeight = that.element.outerHeight(true);
        if(winHeight < elHeight){
          that.element.css({
            'top': win.scrollTop(),
            'left': (win.width() - that.element.outerWidth(true)) / 2,
            'position': 'absolute'
          });
        }
        else{
          that.element.css({
            'top': (win.height() - that.element.outerHeight(true)) / 2,
            'left': (win.width() - that.element.outerWidth(true)) / 2,
            'position': 'fixed'
          });
        }
      }
    },
    show: function(target) {
      if (this.isOpen){
        return;
      }

      var that = this,
          options = this.options;

      that.isOpen = true;
      $.isFunction(options.beforeShow) && options.beforeShow.call(that.element);
      this.overlay.fadeIn(options.duration, options.easing);
      this.element.fadeIn(options.duration, options.easing, function () {
        that.reposition();
        $.isFunction(options.afterShow) && options.afterShow.call(that.element);
      });
    },
    hide: function() {
      if (!this.isOpen){
        return;
      }

      var that = this;
      var options = that.options;

      $.isFunction(options.beforeHide) && options.beforeHide.call(that.element);
      that.overlay.fadeOut(options.duration, options.easing);
      that.element.fadeOut(options.duration, options.easing, function () {
        $.isFunction(options.afterHide) && options.afterHide.call(that.element);
        that.isOpen = false;
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    duration: 200,
    easing: 'linear',
    closeButton: '.close',
    zIndex: 100,
    beforeShow: function () { },
    afterShow: function () { },
    beforeHide: function () { },
    afterHide: function () { }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *  @name navigation plugin
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
;(function($, window, undefined) {
  var pluginName = 'navigation',
      win = $(window),
      isTouchDevice = 'ontouchstart' in window;

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this;
      that.vars = {
        containerWidth: that.element.outerWidth(true),
        touch: 'touchstart.' + pluginName
      };

      that.vars.items = that.element.children('li');

      if(isTouchDevice && win.width() >= 1024){
        var accordion = that.element.data('accordion');
        if(accordion){
          accordion.destroy();
        }
        that.vars.items.unbind(that.vars.touch).bind(that.vars.touch, function(e){
          e.preventDefault();
          e.stopPropagation();
          var target = $(e.target);
          var el = $(this);
          if(target.is('a') && target.closest('ul.link').length){
            location.href = target.attr('href');
            return;
          }
          var siblings = el.siblings().children('div:visible');
          if(siblings.closest('li').length){
            that.hide(siblings.closest('li'));
          }
          that.show(this);
        });
        win.bind('click.' + pluginName, function (e) {
          var siblings = that.vars.items.children('div:visible');
          if(siblings.closest('li').length){
            that.hide(siblings.closest('li'));
          }
        });
      }
      else{
        win.bind('resize.' + pluginName, function(){
          var w = win.width();
          setTimeout(function(){
            if(w < that.options.minWidthShow){
              that.vars.items.unbind('mouseenter.' + pluginName).unbind('mouseleave.' + pluginName);
            }
            else{
              that.vars.items.bind('mouseenter.' + pluginName, function(e){
                e.preventDefault();
                e.stopPropagation();
                that.show(this);
              }).bind('mouseleave.' + pluginName, function(){
                that.hide(this);
              });
            }
          }, 200);
        }).trigger('resize.' + pluginName);
      }
    },
    show: function (t) {
      var that = this,
          current = $(t),
          childMenu = current.children('.sub-nav-1'),
          currWidth = current.width();

      if(!childMenu.data('width')){
        var ulFirst = childMenu.children('ul:first');
        var dataWidth = current.data('width');
        dataWidth && ulFirst.width(dataWidth);
        childMenu.data('width', childMenu.width());
      }

      var subWidth = childMenu.data('width');

      if(childMenu.hasClass('pull-lr')){
        childMenu.css({
          'display': 'block',
          'width': 0
        }).stop().animate({
          'width': subWidth
        }, that.options.effectDuration, that.options.easing, function () {
          childMenu.css('width', subWidth);
        });
      }
      else if(childMenu.hasClass('pull-slidedown')){
        childMenu.stop().slideDown(that.options.effectDuration);
      }
      else if(childMenu.hasClass('pull-mlr')){
        var left = that.element.children('li:first').offset().left - current.offset().left;
        if(subWidth < that.vars.containerWidth){
          left = -(subWidth - currWidth) / 2;
        }
        childMenu.css({
          'display': 'block',
          'left': currWidth / 2,
          'width': 0
        }).stop().animate({
          'width': subWidth,
          'left': left
        });
      }
    },
    hide: function (t) {
      var that = this,
          current = $(t),
          childMenu = current.children('.sub-nav-1');

      if(!that.options.hideEffect){
        childMenu.hide();
        if(childMenu.hasClass('pull-mlr')){
          childMenu.css({
            'width': 0,
            'left': 0
          });
        }
        return;
      }
      else{
        if(childMenu.hasClass('pull-lr')){
          childMenu.stop().animate({
            'width': 0
          }, that.options.effectDuration, that.options.easing, function () {
            childMenu.css({
              'display': 'none',
              'width': childMenu.data('width')
            });
          });
        }
        else if(childMenu.hasClass('pull-slidedown')){
          childMenu.stop().slideUp(that.options.effectDuration);
        }
        else if(childMenu.hasClass('pull-mlr')){
          childMenu.stop().animate({
            'width': 0,
            'left': current.width() / 2
          }, function() {
            childMenu.css({
              'display': 'none',
              'left': 0
            });
          });
        }
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    easing: 'swing',
    effectDuration: 300,
    hideEffect: true,
    minWidthShow: 1024
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
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
;(function($, window, undefined) {
  var pluginName = 'plugin';
  var privateVar = null;
  var privateMethod = function() {

  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {

    },
    publicMethod: function(params) {

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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    option: 'value'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));

/**
 *@name slider jquery
 *    @description slider jquery
 *@version 1.0
 *    next
 *    prev
 *    duration
 *    easing
 *@events
 *    event
 *@methods
 *    init
 *    slideNext
 *    slidePrev
 *    destroy
 */

;(function($, window, undefined) {
  var pluginName = 'showslider',
      isDevice = 'ontouchstart' in window,
      win = $(window);

  var loadImage = function(src, callback) {
    var img = new Image();
    img.onload = function(){
      $.isFunction(callback) && callback();
    };
    img.src = src;
  };

  var split = function(arr, n) {
    var len = arr.length, out = [], i = 0;
    while (i < len) {
      out.push(arr.slice(i, i += n));
    }
    return out;
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      that.vars = {
        btnNext: that.element.find(that.options.next),
        btnPrev: that.element.find(that.options.prev),
        startEvt : !isDevice ? 'mousedown.' + pluginName : 'touchstart.' + pluginName,
        moveEvt : !isDevice ? 'mousemove.' + pluginName : ' touchmove.' + pluginName,
        endEvt : !isDevice ? 'mouseup.' + pluginName : ' touchend.' + pluginName,
        clickEvt: !isDevice ? 'click.' + pluginName : ' touchstart.' + pluginName,
        forceWait: true
      };

      that.vars.container = that.element.find(that.options.container);
      that.reset();

      win.bind('resize.' + pluginName, function(){
        setTimeout(function(){
          that.reset();
        }, 300);
      });

      that.vars.btnNext.unbind(that.vars.clickEvt).bind(that.vars.clickEvt, function(e){
        if($(this).hasClass(that.options.disableClass)){
          return false;
        }

        e.preventDefault();
        that.slideNext(this);
      });

      that.vars.btnPrev.addClass(that.options.disableClass).unbind(that.vars.clickEvt).bind(that.vars.clickEvt, function(e){
        if($(this).hasClass(that.options.disableClass)){
          return false;
        }

        e.preventDefault();
        that.slidePrev(this);
      });

      if(that.options.multiRows){
        that.vars.container.css({
          'position': 'relative',
          'height': that.vars.slides.height()
        });
        that.vars.slides.width(that.vars.liWidth);
      }

      that.vars.prevent = false;
      that.vars.container.css({
        'width': that.vars.slides.length * that.vars.liWidth
      });

      that.vars.container.unbind(that.vars.moveEvt).bind(that.vars.moveEvt, function(e) {
        if(!that.vars.prevent){
          e.preventDefault();
        }
        that.vars.prevent = false;
      });

      that.vars.slides.eq(that.vars.currentIndex).addClass(that.options.activeClass);
      var startX, endX, startY, endY;
      that.element.unbind(that.vars.startEvt).bind(that.vars.startEvt, function(e){
        $.isFunction(that.options.touchstart) && that.options.touchstart.call(that);
        var targetTouch = null;
        if(e.originalEvent.targetTouches){
          targetTouch = e.originalEvent.targetTouches[0];
        }
        else{
          targetTouch = e.originalEvent;
        }
        startX = targetTouch.pageX;
        startY = targetTouch.pageY;
      }).bind(that.vars.moveEvt, function(e){
        var changeTouch = null;
        if(e.originalEvent.changedTouches){
          changeTouch = e.originalEvent.changedTouches[0];
        }
        else{
          changeTouch = e.originalEvent;
        }
        endX = changeTouch.pageX;
        endY = changeTouch.pageY;

        var x = Math.abs(endX - startX);
        var y = Math.abs(endY - startY);
        if(x > y){
          that.vars.prevent = false;
        }
        else{
          that.vars.prevent = true;
        }
      }).bind(that.vars.endEvt, function(e){
        var x = Math.abs(endX - startX);
        var y = Math.abs(endY - startY);
        if(x > y){
          if(endX < startX){
            that.slideNext(that.options.touchend);
          }
          else{
            that.slidePrev(that.options.touchend);
          }
        }
      });
    },
    reset: function(){
      var that = this;
      if(that.options.responsive){
        that.vars.winWidth = win.width();
        that.vars.inner = that.element.find(that.options.inner);
        if(that.options.childItems){
          that.vars.childItems = that.element.find(that.options.childItems);
          var itemsOnRow = Math.floor(that.vars.winWidth / that.vars.childItems.width());
          var arr = split(that.vars.childItems, Math.min(itemsOnRow, that.options.maxItems) * that.options.multiRows);
          that.vars.inner.css({
            width: itemsOnRow * that.vars.childItems.width(),
            margin: '0 auto'
          });
          that.vars.container.empty();
          for(var i = 0; i < arr.length; i++){
            var li = $('<li />'),
                current = arr[i];
            for(var j = 0; j < current.length; j++){
              li.append(current[j]);
            }
            that.vars.container.append(li);
          }
          that.vars.showItems = 1;
        }
        else{
          that.vars.slides = that.vars.container.children(that.options.items);
          that.vars.showItems = Math.floor(that.vars.winWidth / that.vars.slides.width());
          that.vars.inner.css({
            width: that.vars.showItems * that.vars.slides.width(),
            margin: '0 auto'
          });
        }
      }
      else{
        that.vars.showItems = that.options.showitems;
      }

      that.vars.slides = that.vars.container.children(that.options.items);
      that.vars.liWidth = that.vars.slides.eq(Math.floor(that.vars.slides.length / 2)).outerWidth(true);
      that.vars.currentIndex = 0;
      that.vars.totalPages = Math.ceil(that.vars.slides.length / that.vars.showItems);
      that.vars.preview = that.element.find(that.options.preview);

      if(that.options.multiRows && that.vars.childItems){
        var len = that.vars.slides.eq(0).children().length;
        that.vars.liWidth = (len / that.options.multiRows) * that.vars.childItems.width();
        that.vars.slides.width(that.vars.liWidth);
      }

      that.vars.container.css('margin-left', 0);
      that.vars.btnPrev.addClass(that.options.disableClass);
      that.vars.btnNext.removeClass(that.options.disableClass);
    },
    slideNext: function(callback){
      var that = this;
      if(that.vars.forceWait){
        if(that.vars.currentIndex >= that.vars.totalPages - 1){
          return;
        }

        that.vars.forceWait = false;
        that.vars.slides.eq(that.vars.currentIndex).removeClass(that.options.activeClass);
        that.vars.btnPrev.hasClass(that.options.disableClass) && that.vars.btnPrev.removeClass(that.options.disableClass);
        that.vars.container.stop().animate({
          'margin-left': '-=' + that.vars.liWidth * that.vars.showItems
          }, that.options.duration, that.options.easing, function(){
            that.vars.currentIndex++;
            that.vars.slides.eq(that.vars.currentIndex).addClass(that.options.activeClass);
            if(that.vars.currentIndex >= that.vars.totalPages - 1){
              that.vars.btnNext.addClass(that.options.disableClass);
            }
            that.vars.forceWait = true;
            $.isFunction(callback) && callback();
        });
      }
    },
    slidePrev: function(callback){
      var that = this;
      if(that.vars.forceWait){
        if(that.vars.currentIndex > that.vars.totalPages || that.vars.currentIndex === 0){
          return;
        }

        that.vars.forceWait = false;
        that.vars.slides.eq(that.vars.currentIndex).removeClass(that.options.activeClass);
        that.vars.btnNext.hasClass(that.options.disableClass) && that.vars.btnNext.removeClass(that.options.disableClass);
        that.vars.container.stop().animate({
          'margin-left': '+=' + that.vars.liWidth * that.vars.showItems
          }, that.options.duration, that.options.easing, function(){
            that.vars.currentIndex--;
            that.vars.slides.eq(that.vars.currentIndex).addClass(that.options.activeClass);
            if(that.vars.currentIndex <= 0){
              that.vars.btnPrev.addClass(that.options.disableClass);
            }
            that.vars.forceWait = true;
            $.isFunction(callback) && callback();
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
      } else {
        alert(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    container: '[data-container]',
    items: 'li',
    childItems: 'li > .item-1',
    inner: '.inner',
    preview: '.preview img',
    multiRows: 1,
    showitems: 1,
    maxItems: 4,
    responsive: true,
    next: '.btn-next',
    prev: '.btn-previous',
    activeClass: 'active',
    disableClass: 'disable',
    duration: 500,
    easing: 'swing',
    beforeLoading: function(){},
    afterLoading: function(){},
    beforeSlider: function(){},
    afterSlider: function(){}
  };

  $(function() {
    var sliders = $('[data-slider]');
    sliders.imagesLoaded(function(){
      sliders.each(function(index, el) {
        el = $(el);
        var options = {
          showitems: el.data('showitems'),
          multiRows: el.data('multirows'),
          childItems: 'li > .item-1',
          inner: '.inner'
        };

        if(el.hasClass('gallery-3')){
          options.responsive = false;
        }

        if(el.hasClass('gallery-2')){
          options.childItems = null;
        }

        el[pluginName](options);
      });
    });
  });
}(jQuery, window));

/**
 *@name tabs jquery
 *    @description tabs jquery
 *@version 1.0
 *    next
 *    prev
 *    duration
 *    easing
 *@events
 *    event
 *@methods
 *    init
 *    goToTab
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'tabs';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function(){
      var that = this;
      var handlers = $(that.options.handlers, that.element);
      var tabs = $(that.options.tabs, that.element);
      that.vars = {
          handlers: handlers,
          tabs: tabs,
          index: that.options.openTabIndex > handlers.length - 1 ? 0 : that.options.openTabIndex
      };

      var hash = window.location.hash;
      if (hash.length > 0) {
          var el = handlers.find('a[href="' + hash + '"]');
          that.vars.index = el.parent().index();
      }

      tabs.filter(':not(":eq('+(that.vars.index)+')")').addClass(that.options.hiddenClass);
      handlers.eq(that.vars.index).addClass(that.options.activeClass);
      handlers.on('click.tabs', function(e) {
        e.preventDefault();
        that.goToTab(this);
      });
    },
    goToTab: function(el) {
      var current = $(el);
      if (current.hasClass(this.options.activeClass)) {
        return;
      }
      else {
        var beforeEl = this.vars.handlers.eq(this.vars.index);
        beforeEl.removeClass(this.options.activeClass);
        this.vars.tabs.eq(this.vars.index).addClass(this.options.hiddenClass);

        this.vars.index = current.index();
        current.addClass(this.options.activeClass);
        this.vars.tabs.eq(this.vars.index).removeClass(this.options.hiddenClass);
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    handlers: '.tabs-nav li',
    tabs: '.tabs-panel',
    activeClass: 'active',
    hiddenClass: 'hidden',
    openTabIndex: 0
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
/**
 *  @name validation plugin
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
;(function($, window, undefined) {
  var pluginName = 'validate',
      requiredTrigger = '[data-required]',
      emailTrigger = '[data-email]',
      matchTrigger = '[data-match]',
      ignoreTrigger = '[data-ignore]',
      labelMsg = 'error-msg';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      if(that.element.is('form')){
        that.vars = {
          elsRequired: $(requiredTrigger, that.element),
          elsEmail: $(emailTrigger, that.element),
          elsMatch: $(matchTrigger, that.element),
          elsExcludes: $(that.options.excludes, that.element),
          blurEvt: 'blur.validate',
          changeEvt: 'change.validate',
          types: {
            required: 'required',
            email: 'email',
            match: 'match'
          }
        };

        that.vars.elsRequired.on(that.vars.blurEvt + ' ' + that.vars.changeEvt, function(){
          that.requiredValidate($(this));
        });

        that.vars.elsEmail.on(that.vars.blurEvt, function(){
          that.emailValidate($(this));
        });

        that.vars.elsMatch.on(that.vars.blurEvt + ' ' + that.vars.changeEvt, function(){
          that.matchValidate($(this));
        });

        if(that.options.showMessage){
          that.vars.elsRequired.each(function(index, el) {
            el = $(el);
            that.generateMsg(el, el.data('required'), that.vars.types.required);
          });

          that.vars.elsEmail.each(function(index, el) {
            el = $(el);
            that.generateMsg(el, el.data('email'), that.vars.types.email);
          });

          that.vars.elsMatch.each(function(index, el) {
            el = $(el);
            that.generateMsg(el, el.data('msg-match'), that.vars.types.match);
          });
        }

        that.element.submit(function(e){
          that.vars.elsRequired.each(function(index, el) {
            that.requiredValidate($(el));
          });

          that.vars.elsEmail.each(function(index, el) {
            that.emailValidate($(el));
          });

          that.vars.elsMatch.each(function(index, el) {
            that.matchValidate($(el));
          });

          var errorFields = that.element.find('.' + that.options.errorClassName);
          if(errorFields.length > 0){
            that.options.ownElmentError ? errorFields.filter(':first').focus().select()
                                        : errorFields.filter(':first').children('input').focus().select();
            return false;
          }

          if($.isFunction(that.options.afterSubmit)){
            that.options.afterSubmit.call(that.element);
            return false;
          }
          else{
            return true;
          }
        });

        if(that.options.btnSubmit && that.options.btnSubmit.length > 0){
          $(that.options.btnSubmit, that.element).on('click.validate', function(){
            that.element.trigger('submit');
          });
        }
      }
    },
    requiredValidate: function(el){
      if(el.attr(ignoreTrigger)){
        return;
      }

      if(el.data('customselect')){
        el = $('select', el);
      }

      var val = el.is(':password') ? el.val() : $.trim(el.val());
      var elError = this.options.ownElmentError ? el : el.parent();
      if(el.attr('placeholder') === val){
        val = '';
      }

      if(!el.parent().hasClass('custom-select')){
        this.showMessage(el, elError, val.length === 0, this.vars.types.required);
      }
    },
    emailValidate: function(el){
      var regEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
      var elError = this.options.ownElmentError ? el : el.parent();
      this.showMessage(el, elError, !regEmail.test(el.val()), this.vars.types.email);
    },
    matchValidate: function(el){
      var elError = this.options.ownElmentError ? el : el.parent(),
          matchEl = $(el.data('match'));
      if(el.val().length){
        elError.siblings('.' + this.vars.types.required).hide();
        this.showMessage(el, elError, el.val() !== matchEl.val(), this.vars.types.match);
      }
      else{
         elError.siblings('.' + this.vars.types.match).hide();
      }
    },
    showMessage: function(el, elError, notValid, messages){
      if(this.options.showMessage){
        var labelError = elError.siblings('.' + labelMsg);
        if(labelError.length > 0){
          var currentError = labelError.filter('.' + this.vars.types[messages]);
          notValid ? currentError.show() : currentError.hide();
        }
      }
      notValid ? elError.addClass(this.options.errorClassName) : elError.removeClass(this.options.errorClassName);
    },
    generateMsg: function(el, msg, type){
      el = this.options.ownElmentError ? el : el.parent();
      el.after('<label class="' + labelMsg + ' ' + type + '" style="display: none;">' + msg + '</label>');
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    btnSubmit: ':submit',
    errorClassName: 'error',
    ownElmentError: false,
    showMessage: false
  };

  $(function() {
    $('[data-' + pluginName + ']').each(function(index, el) {
      el = $(el);
      el[pluginName]({showMessage: el.data('show-message') });
    });
    //$('[data-' + pluginName + ']')[pluginName]();
    $('.subscribe-form')[pluginName]({
      ownElmentError: true,
      showMessage: false
    });
  });

}(jQuery, window));
