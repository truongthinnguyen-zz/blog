/*!
 * Mighty Made v0.2.3
 * Generated on Wed Mar 11 2015 09:20:41
 * 
 */

/* =========
 * lightbox.js
 * ========= */

(function($, App) {

  "use strict";

  /* ============== */
  /* MODULE TRIGGER */
  /* ============== */

  var pluginName = 'lightbox';
  var win = $(window);

  var lightboxTrigger = '[data-' + pluginName + ']',
      lbBackg = '<div class="lb-background"></div>',
      lbWrapper = '<div class="lb-wrapper">' +
                    '<img src="" class="lb-image" alt="" />' +
                    '<div class="lb-loader"><img src="images/app/spinner.gif" /></div>' +
                    '<div class="lb-controls">' +
                      '<div class="lb-info">' +
                        '<p class="lb-title"></p>' +
                        '<p class="lb-idx"></p>' +
                      '</div>' +
                      '<div class="lb-hide-btn"></div>' +
                      '<div class="lb-prev-btn"></div>' +
                      '<div class="lb-next-btn"></div>' +
                    '</div>' +
                  '</div>';

  var arrImg = [];

  /* =============== */
  /* MODULE DEFAULTS */
  /* =============== */

  var defaults = {
    margin: 200,
    dur: 'slow'
  };

  /* ================= */
  /* MODULE DEFINITION */
  /* ================= */

  var showLightbox = function(info) {
    var that = this;
    var isset = false;

    that.backg.fadeIn(that.settings.dur);
    that.wrapper.add(that.loader).show();

    for (var i = 0; i < arrImg.length; i = i + 1) {
      if (info.link === arrImg[i].url) {
        isset = true;
        resize.call(that, arrImg[i].w, arrImg[i].h);
        break;
      }
    }

    if (!isset) {
      var img = new Image();
      img.onload = function() {
        var nWidth = this.naturalWidth,
            nHeight = this.naturalHeight;
        if (!nWidth) {
          nWidth = this.width;
          nHeight = this.height;
        }
        arrImg.push({
          url: info.link,
          w: nWidth,
          h: nHeight
        });
        resize.call(that, nWidth, nHeight);
      };
      img.src = info.link;
    }

    that.image.attr('src', info.link);
    if (info.title) {
      that.title.text(info.title);
    } else {
      that.title.text(App.settings.locales.imageNoTitle);
    }

    var groupLength = $('[data-' + pluginName + '="' + info.groupName + '"]').length;
    if (groupLength > 1) {
      that.wrapper.data('current', {
          group: info.groupName,
          index: info.idx - 1
        }
      );
      that.index.html(info.idx + ' of ' + groupLength);
      that.prevBtn.add(that.nextBtn).removeAttr('style');
    } else {
      that.wrapper.removeData('current');
      that.index.empty();
      that.prevBtn.add(that.nextBtn).height(0);
    }
  };

  var resize = function(w, h) {
    var that = this,
        scrRatio = win.width() / win.height(),
        ratio = w / h;

    if (w > win.width() - that.settings.margin * 2) {
      w = win.width() - that.settings.margin * 2;
      h = w / ratio;
    }

    that.wrapper.finish().animate({
      width: w,
      height: h
    }, {
      step: function() {
        setPositon.call(that, h);
      },
      complete: function() {
        that.loader.hide();
        that.controls.add(that.image).fadeIn(that.settings.dur);
      }
    });
  };

  var setPositon = function(height) {
    var that = this,
        scroll = win.scrollTop(),
        top = 20 + scroll,
        left = win.innerWidth() / 2 - that.wrapper.outerWidth() / 2;

    if (win.innerHeight() > height) {
      top = win.innerHeight() / 2 - that.wrapper.innerHeight() / 2 + scroll;
    }
    that.wrapper.css({ 'top' : top, 'left' : left });
  };

  var getData = function(el) {
    return {
      groupName: el.data(pluginName),
      link: el.attr('href'),
      title: el.data('title'),
      idx: el.index('[data-' + pluginName + '="' + el.data(pluginName) + '"]') + 1
    };
  };

  function Lightbox(opts) {
    this.settings = $.extend({}, defaults, opts);

    return this.init();
  }

  /* ============== */
  /* MODULE METHODS */
  /* ============== */

  Lightbox.prototype.init = function() {
    var that = this;

    this.backg = $(lbBackg);
    this.wrapper = $(lbWrapper);
    this.image = $('img.lb-image', this.wrapper);
    this.loader = $('.lb-loader', this.wrapper);
    this.title = $('.lb-title', this.wrapper);
    this.index = $('.lb-idx', this.wrapper);
    this.hideBtn = $('.lb-hide-btn', this.wrapper);
    this.nextBtn = $('.lb-next-btn', this.wrapper);
    this.prevBtn = $('.lb-prev-btn', this.wrapper);
    this.info = $('.lb-info', this.wrapper);
    this.controls = $('.lb-controls', this.wrapper);

    this.imgSets = $(lightboxTrigger);
    that.backg.add(that.wrapper).hide().appendTo($('body'));
    that.controls.hide();
    setPositon.call(that);

    that.imgSets.on('click.' + pluginName, function(e) {
      e.preventDefault();
      showLightbox.call(that, getData($(this)));
    });

    that.prevBtn.on('click.' + pluginName, function(e) {
      that.changePic('prev');
    });

    that.nextBtn.on('click.' + pluginName, function(e) {
      that.changePic('next');
    });

    that.backg.add(that.hideBtn).on('click', function() {
      that.backg.add(that.wrapper).fadeOut(that.settings.dur, function() {
        that.image.add(that.controls).hide();
      });
    });

    win.resize(function() {
      var link = that.image.attr('src');
      for (var i = 0; i < arrImg.length; i = i + 1) {
        if (link === arrImg[i].url) {
          resize.call(that, arrImg[i].w, arrImg[i].h);
          break;
        }
      }
    });

    return this;
  };

  Lightbox.prototype.changePic = function(act) {

    var info = this.wrapper.data('current');
    if (!info || typeof info === 'undefined') {
      return;
    }

    var group = $('[data-' + pluginName + '="' + info.group + '"]'),
        len = group.length,
        index = info.index;

    switch (act) {
      case 'prev':
        index = index - 1;
        if (index < 0) { index = len - 1; }
        break;

      case 'next':
        index = index + 1;
        if (index >= len) { index = 0; }
        break;

      default:
        return;
    }
    this.image.add(this.controls).hide();
    showLightbox.call(this, getData(group.eq(index)));
  };

  Lightbox.prototype.destroy = function() {
    this.backg.add(this.wrapper).remove();
    this.imgSets.off('.' + pluginName);
    return this;
  };

  /* =============== */
  /* MODULE DATA-API */
  /* =============== */

  $(function() {
    var opts = {};
    App.lightbox = new Lightbox(opts);
  });

}(window.jQuery, window.App));
