/**
 *  @name smCarousel
 *  @description carousel jquery plugin.
 *  @version 1.0
 *  @options
 *  items
 *  slide
 *  next
 *  prev
 *  scale 
 *  @events
 *    onChange
 *  @methods
 *    init
 *    slideTo
 *    setStyle
 *    destroy
 */
; (function ($, window, undefined) {
    var pluginName = 'smCarousel';
	
    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.init();
    }
	
    Plugin.prototype = {
        init: function () {
            var that = this;
            that.vars = {};
			that.vars.slideContainer = that.element.children('ul');
            that.vars.slides = that.element.find(that.options.slide);
            that.vars.slideWidth = that.vars.slides.outerWidth(true);
            that.vars.slideHeight = that.vars.slides.outerHeight(true);
			that.vars.beforeLength = that.vars.slides.length;
			that.element.width(that.options.items * that.vars.slideWidth);
			
			var cloneLi = that.vars.slides.filter(':gt(' + (that.options.items - 1) + ')').clone();
            cloneLi.prependTo(that.vars.slideContainer);
            that.vars.slideContainer.css('margin-left', -cloneLi.length * that.vars.slideWidth);

            that.vars.slides = that.element.find(that.options.slide);
            that.vars.activeIdx = Math.ceil(that.vars.slides.length / 2 - 1);
			that.vars.newWidth = that.vars.slideWidth * that.options.scale;
			that.vars.newHeight = that.vars.slideHeight * that.options.scale;
			
            that.vars.forceWait = true;
            that.slideTo(that.vars.activeIdx);

            $(that.options.next, that.element)
                .unbind('click.' + pluginName)
                .bind('click.' + pluginName, function () {
                    that.slideTo(that.vars.activeIdx + 1);
                });

            $(that.options.prev, that.element)
                .unbind('click.' + pluginName)
                .bind('click.' + pluginName, function () {
                    that.slideTo(that.vars.activeIdx - 1);
                });

            that.vars.slideContainer.children().unbind('click.' + pluginName).bind('click.' + pluginName, function () {
                that.slideTo($(this).index());
            });		
        },
        slideTo: function (idx) {
            var that = this;
            if(that.vars.forceWait)
            {
                that.vars.forceWait = false;
                that.vars.slideContainer.stop().animate({
                    'margin-left': '-=' + (idx - that.vars.activeIdx) * that.vars.slideWidth
                }, 'swing', function () {
                    that.vars.slides.eq(that.vars.activeIdx).find('a').removeAttr('style');
					that.scale(idx);					
                });
            }
        },
		scale: function(idx, setStyle){
			var that = this;
			var current = that.vars.slides.eq(idx).find('a');
			var style = {
				'position': 'absolute',
				'margin-top': -(that.vars.newHeight - that.vars.slides.outerHeight()) / 2,
				'margin-left': -(that.vars.newWidth - that.vars.slideWidth) / 2,
				'width': that.vars.newWidth,
				'height': that.vars.newHeight - (that.vars.slideHeight - that.vars.slides.outerHeight())
			};
			
			if(setStyle){
				current.css(style);
			}
			else{
				current.css({ position: 'absolute'}).stop().animate(style, 'swing', function(){
					that.vars.activeIdx = idx;
					that.options.onChange.call(this);						
					if(idx > that.vars.slides.length - that.options.items){
						that.vars.slides.eq(that.vars.activeIdx).find('a').removeAttr('style');                            
						that.vars.activeIdx = idx - that.vars.beforeLength;							
						that.vars.slideContainer.css('margin-left', - (that.vars.activeIdx - Math.floor(that.options.items / 2)) * that.vars.slideWidth);					
						that.scale(that.vars.activeIdx, true);					
					}
					else if(idx < that.options.items - 1){
						that.vars.slides.eq(that.vars.activeIdx).find('a').removeAttr('style');                            
						that.vars.activeIdx = idx + that.vars.beforeLength;							
						that.vars.slideContainer.css('margin-left', -(Math.round(that.vars.slides.length / 2) + idx) * that.vars.slideWidth);
						that.scale(that.vars.activeIdx, true);						
					}
					that.vars.forceWait = true;
				});
			}
		},
        destroy: function () {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function (options, params) {
        return this.each(function () {
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
		items: 5,
        slide: 'li',
        next: '.wi-icon-next',
        prev: '.wi-icon-prev',
        scale: 1.5,     
        onChange: function () { }
    };
}(jQuery, window));
