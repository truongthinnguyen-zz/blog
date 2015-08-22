/*-----------------------------------------------------------------------------------

 	main.js - All front-end jQuery
 
-----------------------------------------------------------------------------------*/

$(function(){

/*-----------------------------------------------------------------------------------

	Responsive Menu

-----------------------------------------------------------------------------------*/
	var $select = $('<select id="option-menu"></select>').appendTo('#menu').hide();
	$('#menu').find('li').each(function(index, item){
		var plusText = $(item).hasClass('second_list') ? '&nbsp;&nbsp;|-' : '';
		var $a = $(item).find('a').first();
		var $option = $('<option>'+plusText+$a.text()+'</option>').val($a.attr('href')).appendTo($select);
		if($a.hasClass('main_current')){
			$option.attr('selected', true);
		}
	});

	$select.on('change', function(){
		document.location = $select.val();
	});

	$('a[href="#"]').on('click', function(e){
		e.preventDefault();
	});

/*-----------------------------------------------------------------------------------

	Stick topbar when scrolling

-----------------------------------------------------------------------------------*/
	var aboveHeight = $('#hero').outerHeight(false);
    $(window).scroll(function(){
    	var specialAboveHeight = aboveHeight;
        if ($(window).scrollTop() > specialAboveHeight){
            $('#topbar').addClass('fixed');
            $('#main').css({'marginTop' : $('#topbar').outerHeight(true)+'px'});

        } else {
            $('#topbar').removeClass('fixed');
            $('#main').css({'marginTop' : 0+'px'});
        }
    });

/*-----------------------------------------------------------------------------------

	Toggle fullscreen

-----------------------------------------------------------------------------------*/
	function onFullScreenChange(){
		if (screenfull.enabled) {
			if($('#superfullscreen-wrapper').length){
				$('#main').unwrap();
			}
			else{
				$('#main').wrap($('<div id="superfullscreen-wrapper"/>'));
			}
			if(screenfull.isFullscreen)
				$('#fullscreen-button').addClass('selected');
			else
				$('#fullscreen-button').removeClass('selected');
		}
	}

	$('#fullscreen-button').click(function(){
			screenfull.toggle($('#superfullscreen-wrapper')[0]);
	});

	$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',onFullScreenChange);

/*-----------------------------------------------------------------------------------

	Toggle search

-----------------------------------------------------------------------------------*/
	$('#search-button').click(function(){
		if(!$(this).hasClass('selected')){
			$(this).addClass('selected');
			$('#searchform').addClass('selected');
			setTimeout(function(){
				$('#s').focus();
			}, 300);
		}
	});

	$('#s').on('focusout', function(){
		$('#search-button').removeClass('selected');
		$('#searchform').removeClass('selected');
	});

/*-----------------------------------------------------------------------------------

	Toggle like button

-----------------------------------------------------------------------------------*/
	$('#like-button').click(function(){
		var $t = $(this);
		var url = $t.attr('rel');
		$(this).toggleClass('selected');
		var data = $.extend($t.data(), {"like" : $(this).hasClass('selected')});
		$.post(url, data, function(json){
			console.log(json);
		}, "json");
	});


/*-----------------------------------------------------------------------------------

	Keyboards shortcuts

-----------------------------------------------------------------------------------*/
	var textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];
	$(document).keyup(function(e) {
		// Don't fire in text-accepting inputs that we didn't directly bind to
		if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
			$.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
			return;
		}

		if (e.keyCode == 70) { $('#fullscreen-button').click(); }   // f for fullscreen
		if (e.keyCode == 76) { $('#like-button').click(); }   // l for like
	});

/*-----------------------------------------------------------------------------------

	Handle resize of window

-----------------------------------------------------------------------------------*/
    $(window).resize(function(){
    	aboveHeight = $('#hero').outerHeight(false);
    	
    	$select.hide();
    	$('#menu > ul').show();

    	if($('#menus-wrapper').width()-$('#logo').width()-$('#toolbar').width() < $('#menu').outerWidth()){
	    	$select.show();
	    	$('#menu > ul').hide();
    	}
    	else{
    		$select.hide();
    		$('#menu > ul').show();
    	}

    	responsiveTabs();
		bindCarousels();
    });


/*-----------------------------------------------------------------------------------

	Sharre plugin configuration

-----------------------------------------------------------------------------------*/
    $('.twitter').sharrre({
		share: {
			twitter: true
		},
		enableHover: false,
		enableTracking: true,
		buttons: { twitter: {via: '_JulienH'}},
		click: function(api, options){
			api.simulateClick();
			api.openPopup('twitter');
		}
	});
	$('.facebook').sharrre({
		share: {
			facebook: true
		},
		enableHover: false,
		enableTracking: true,
		click: function(api, options){
			api.simulateClick();
			api.openPopup('facebook');
		}
	});
	$('.googleplus').sharrre({
		share: {
			googlePlus: true
		},
		enableHover: false,
		enableTracking: true,
		click: function(api, options){
			api.simulateClick();
			api.openPopup('googlePlus');
		}
	});


/*-----------------------------------------------------------------------------------

	Carousels configuration

-----------------------------------------------------------------------------------*/
	function bindCarousels(){
		$('.carousel').each(function(){
			var $t = $(this);
			if($t.data('carouselBound')||!$t.is(':visible'))
				return;
			$t.carouFredSel({
				height: 'variable',
				align: "center",
				width   : "100%",
				items: { visible     : "0"},
				auto: { play: false },
				prev: $t.parents('.fancy-carousel:first').find('.prev-related'),
				next: $t.parents('.fancy-carousel:first').find('.next-related'),
				mousewheel: true,
				swipe: {
					onMouse: true,
					onTouch: true
				}
			});
			$t.data('carouselBound', true);
		});

		//	Popular widget Carousels
		$('.widget-carousel').each(function(){
			var $t = $(this);
			if($t.data('carouselBound')||!$t.is(':visible'))
				return;
			$t.carouFredSel({
				height: 'variable',
				responsive: true,
				width: '100%',
				items: { visible: "variable" },
				auto: { play: false },
				prev: $t.parents('.fancy-carousel:first').find('.prev-popular'),
				next: $t.parents('.fancy-carousel:first').find('.next-popular'),
				mousewheel: true,
				swipe: {
					onMouse: true,
					onTouch: true
				}
			});
			$t.data('carouselBound', true);
		});
	}
	bindCarousels();

/*-----------------------------------------------------------------------------------

	Make the videos responsive

-----------------------------------------------------------------------------------*/
	$(".video-wrapper").fitVids();

/*-----------------------------------------------------------------------------------

	Slicebox configuration

-----------------------------------------------------------------------------------*/
	var $navArrows = $( '#nav-arrows' ).hide(),
		commonSpeed = 600,
		$descriptions = $('.sb-description'),
		slicebox = $( '#sb-slider' ).slicebox( {
			onReady : function() {
				$('#slicebox').addClass('loaded');
				if($descriptions.first().hasClass('sb-description-light'))
					$navArrows.addClass('sb-nav-light');
				else
					$navArrows.removeClass('sb-nav-light');
				$navArrows.show();
			},
			speed : commonSpeed,
			onBeforeChange : function( pos ) {
				if($descriptions.eq(pos).hasClass('sb-description-light'))
					$navArrows.addClass('sb-nav-light');
				else
					$navArrows.removeClass('sb-nav-light');

			}
		} );

		// add navigation events
		$navArrows.children( ':first' ).on( 'click', function() {
			slicebox.previous();
			return false;
		} );

		$navArrows.children( ':last' ).on( 'click', function() {
			slicebox.next();
			return false;
		} );


/*-----------------------------------------------------------------------------------

	Transform audio player in a sleek responsive audio player

-----------------------------------------------------------------------------------*/		
	$( 'audio' ).audioPlayer();


/*-----------------------------------------------------------------------------------

	Ajax Contact form

-----------------------------------------------------------------------------------*/
	$('#contact-submit').on('click', function(e){
		e.preventDefault();
		var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if($('#name').val() == ""){
			$('#name').addClass("required");
			return;
		}
		if($('#email').val() == "" || !emailRe.test($('#email').val())){
			$('#email').addClass("required");
			return;
		}
		if($('#message').val() == ""){
			$('#message').addClass("required");
			return;
		}

		$('#contact').find('.alert').hide();
		var $t = $(this),
			$form = $t.parents('form:first'),
			url = $form.attr('action'),
			data = $form.serialize();
		$.post(url, data, function(json){
			if(json.res == "success")
				$('#contact-form-success').slideToggle();
			else
				$('#contact-form-error').slideToggle();
		}, "json");
	});


/*-----------------------------------------------------------------------------------

	Tabs

-----------------------------------------------------------------------------------*/

$(".tabwrapper").each(function(){
	var $container = $(this);
	$container.find('.tabrow').find('li').click(function(e){
		var $element = $(this);
		e.preventDefault();
		$container.find('.tabrow').find('li').removeClass("selected");
		$element.addClass("selected");
		var index = $container.find('.tabrow').find('li').index($element);

		$container.find('.tabcontent').find('li.tabcontentwrapper').removeClass('selected').hide();
		$container.find('.tabcontent').find('li.tabcontentwrapper').eq(index).addClass('selected').show();
	});
});

function responsiveTabs(){
	$('.nav-responsive-tabs').remove();

	$(".tabwrapper").each(function(){
		var $container = $(this),
			$tr = $container.find('.tabrow'),
			count = 0;

		$tr.find('li').each(function(){
			count+= $(this).outerWidth(true);
		});


		if($container.width() - parseInt($tr.css('paddingLeft')) - parseInt($tr.css('paddingRight')) < count){
			$tr.width(count);
			var $next = $('<a class="next-responsive-tabs" href="#"><i class="icon-caret-right"></i></a>'),
				$prev = $('<a class="prev-responsive-tabs" href="#"><i class="icon-caret-left"></i></a>');
			$('<nav class="nav-responsive-tabs"/>').appendTo($container).append($next).append($prev);
			
			$next.on('click', function(e){
				e.preventDefault();
				if(parseInt($tr.css('marginLeft')) - 100 <  $container.width() - $tr.outerWidth())
					$tr.stop(true, true).animate({
						'marginLeft' : $container.width() - $tr.outerWidth()
					});
				else
					$tr.stop(true, true).animate({
						'marginLeft' : "-=100"
					});
			});

			$prev.on('click', function(e){
				e.preventDefault();
				if(parseInt($tr.css('marginLeft')) + 100 > 0)
					$tr.stop(true, true).animate({
						'marginLeft' : "0"
					});
				else
					$tr.stop(true, true).animate({
						'marginLeft' : "+=100"
					});
			});
		}
		else
			$tr.css({
				'width': '100%',
				'marginLeft' : '0'
			});
	});
}

/*-----------------------------------------------------------------------------------

	Gamma Gallery

-----------------------------------------------------------------------------------*/
var GammaSettings = {
		// order is important!
		viewport : [ {
			width : 1200,
			columns : 5
		}, {
			width : 900,
			columns : 4
		}, {
			width : 500,
			columns : 3
		}, { 
			width : 320,
			columns : 2
		}, { 
			width : 0,
			columns : 2
		} ]
};

Gamma.init( GammaSettings );


/*-----------------------------------------------------------------------------------

	Toggle

-----------------------------------------------------------------------------------*/
$(".toggle-title").click(function(){
	var $this = $(this),
		$parent = $this.parent();
	$parent.toggleClass('open').find(".toggle-inner").slideToggle();
});


/*-----------------------------------------------------------------------------------

	Trigger resize when document's ready

-----------------------------------------------------------------------------------*/
	$(window).resize();

});


/*-----------------------------------------------------------------------------------

	Google map utility

-----------------------------------------------------------------------------------*/
$(window).load(function(){
	var $map = $('#map-canvas');
	if($map.length){
		var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	    var mapOptions = {
	      zoom: 4,
	      center: myLatlng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
	    var map = new google.maps.Map($map[0], mapOptions);

	    var marker = new google.maps.Marker({
	        position: myLatlng,
	        map: map,
	        title: 'Hello World!'
	    });
	}
});
