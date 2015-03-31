/*!
 * Mighty Made v0.2.3
 * Generated on Wed Feb 25 2015 14:21:02
 * 
 */

/* =========
 * imenu.js
 * ========= */

(function($, App) {

  "use strict";

  /* ============== */
  /* MODULE TRIGGER */
  /* ============== */

  var effect = {
    VER_ALL: 1,
    HOR_ALL: 2,
    VER_HOR: 3,
    HOR_VER: 4
  };

  var imenuTrigger = '[data-imenu]',
      subMenuWrapper = '<div class="subm-wrapper"></div>',
      isOut = true,
      timer = null;

  var checkRoot = function(item) {
    return item.parent().hasClass('imenu');
  };

  var initSubMenus = function() {
    var that = this;
    that.element.find('ul').each(function() {
      var group = $(this),
          parent = group.parent();

      if (group.children('li').length > 0) {
        parent.data('sub', group).find('> a').append('<span class="pointer"></span>');

        var height = group.outerHeight() + 2,
            width = group.outerWidth() + 2;

        group
          .appendTo(that.subContainer)
          .wrap('<div class="sw"></div>')
          .parent()
          .css({'width': width, 'height': height});
      }
    });

    that.subContainer.find('.sw').hide();
  };

  var positionSubMenus = function(item, sub) {
    if (sub) {
      var offs = item.offset(),
          wrapper = sub.parent(),
          position = {
          'top': offs.top,
          'left': offs.left
        };

      if (checkRoot.call(this, item)) {
        position.top += item.innerHeight();
      }
      else {
        position.left += item.innerWidth();
      }

      wrapper.css(position);
    }
  };

  var showVertical = function(sub) {
    var that = this,
        top = sub.parent().outerHeight();

    sub.css({
      'margin-top': -top,
      'opacity': 0
    })
    .parent().show();

    sub.stop().animate({
      'margin-top': 0,
      'opacity': 1
    }, that.settings.showDuration, that.settings.showEasing);
  };

  var hideVertical = function(sub) {
    var that = this,
        top = sub.parent().outerHeight();

    sub.stop().animate({
      'margin-top': -top,
      'opacity': 0
    }, that.settings.hideDuration, function() {
      sub.parent().hide();
    });
  };

  var showHorizontal = function(sub) {
    var that = this,
        left = sub.parent().outerWidth();

    sub.css({
      'margin-left': -left,
      'opacity': 0
    })
    .parent().show();

    sub.stop().animate({
      'margin-left': 0,
      'opacity': 1
    }, that.settings.showDuration, that.settings.showEasing);
  };

  var hideHorizontal = function(sub) {
    var that = this,
        left = sub.parent().outerWidth();

    sub.stop().animate({
      'margin-left': -left,
      'opacity': 0
    }, that.settings.hideDuration, function() {
      sub.parent().hide();
    });
  };

  var showSubmenu = function(item) {
    var sub = item.data('sub');

    if (sub && !sub.parent().is(':visible')) {
      positionSubMenus.call(this, item, sub);

      switch (this.settings.style) {
        case effect.HOR_ALL:
          showHorizontal.call(this, sub);
          break;

        case effect.VER_HOR:
          if (checkRoot.call(this, item)) {
            showVertical.call(this, sub);
          }
          else {
            showHorizontal.call(this, sub);
          }
          break;

        case effect.HOR_VER:
          if (checkRoot.call(this, item)) {
            showHorizontal.call(this, sub);
          }
          else {
            showVertical.call(this, sub);
          }
          break;

        default:
          showVertical.call(this, sub);
      }
    }
  };

  var hideOther = function(items) {
    for (var i = 0; i < items.length; i = i + 1) {
      var sub = items.eq(i).data('sub');

      if (sub) {
        switch (this.settings.style) {
          case effect.HOR_ALL:
            hideHorizontal.call(this, sub);
            break;

          case effect.VER_HOR:
            if (checkRoot.call(this, items.eq(i))) {
              hideVertical.call(this, sub);
            }
            else {
              hideHorizontal.call(this, sub);
            }
            break;

          case effect.HOR_VER:
            if (checkRoot.call(this, items.eq(i))) {
              hideHorizontal.call(this, sub);
            }
            else {
              hideVertical.call(this, sub);
            }
            break;

          default:
            hideVertical.call(this, sub);
        }

        hideOther.call(this, sub.children());
      }
    }
  };

  var onOutHandler = function() {
    isOut = true;
    clearTimeout(timer);
    timer = setTimeout(function() {
      if (isOut) {
        hideOther.call(this, this.items);
      }
    }.bind(this), this.settings.timeOut);
  };

  /* =============== */
  /* MODULE DEFAULTS */
  /* =============== */

  var defaults = {
    showDuration: 450,
    hideDuration: 100,
    timeOut: 1000,
    style: effect.HOR_ALL,
    showEasing: 'easeOutCubic'
  };

  /* ================= */
  /* MODULE DEFINITION */
  /* ================= */

  function Imenu(opts) {
    this.settings = $.extend({}, defaults, opts);
    this.element = $(imenuTrigger);
    this.items = this.element.find('li');
    this.subContainer = $(subMenuWrapper);

    return this.init();
  }

  /* ============== */
  /* MODULE METHODS */
  /* ============== */

  Imenu.prototype.init = function() {
    var that = this;
    this.element.show();
    $('body').append(that.subContainer);
    initSubMenus.call(that);

    that.items.on('mouseenter.imenu', function() {
      var item = $(this);
      hideOther.call(that, item.siblings());
      item.parent().promise().done(function() {
        showSubmenu.call(that, item);
      });
      isOut = false;
    });

    that.element.add(that.subContainer).on('mouseleave.imenu', function() {
      onOutHandler.call(that);
    });

    return this;
  };

  /* =============== */
  /* MODULE DATA-API */
  /* =============== */

  $(function() {
    var opts = {
      style: effect.VER_HOR
    };
    App.imenu = new Imenu(opts);
  });

}(window.jQuery, window.App));
