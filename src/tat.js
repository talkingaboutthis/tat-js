// TAT.JS v1.0 Beta
var tat = {
	
	modalHooks: [],
	
	modalCloseHook: {},
	
	initialize: function() {
		$(document).ready(this.onReady);
		this.listeners();
		this.tooltip();
		this.cookie();
	},
    
    onReady: function() {
    	tat.modalOnListener();
    },
    
    listeners: function() {
	    tat.modalListener();
		tat.scrollTo();
		tat.toggle();
		tat.tabs();
		tat.addRow();
		tat.delRow();
		tat.confirm();
    },
	
	modalListener: function() {
		$('.js-modal').off('click').on('click',function(event) {
			event.preventDefault();
			var modalClicked = $(this); 
			var modalID = modalClicked.data('modal'); 
			var modalContent = modalClicked.data('modal-content');
			if (modalContent==undefined || modalContent.length < 1) { 
				modalContent = $('#'+modalClicked.data('modal-get')).html();
			}
			tat.modal(modalID,modalContent,modalClicked); 
		});
	},
	
	modal: function(modalID,modalContent,elementClicked) {
		if (!$('.modal').length) {
			$('body').prepend('<div id="'+modalID+'" class="modal"><div class="modal-content"></div></div>');
		} 
		$('.modal-content').html(modalContent);
	    $('body').addClass('modal-open');
	    $('.modal, .js-modal-close').off('click').on('click', function(){
	        tat.modalClose();
	    });
	    for (var i=0; i < tat.modalHooks.length; i++ ) {
	    	if (tat.modalHooks[i].id == modalID) {
	    		if (typeof tat.modalHooks[i].hook == 'function') {
		    		tat.modalHooks[i].hook(i,elementClicked);
		    	}
	    	}
	    }
	},
	
	modalClose: function() {	
		if (typeof tat.modalCloseHook == 'function') {
    		tat.modalCloseHook();
    	} else {
			$('.modal').fadeOut(300,function() {
				$('.modal').remove();
			});
		    $('body').removeClass('modal-open');
		}
		tat.modalCloseHook = {};
	},
	
	modalOnListener: function() {
		if ($('.js-modal-on').length > 0) {
			var modal = $('.modal-on').first();
			var delay = parseInt(modal.data('delay')) || 0;
			setTimeout(function() {
		    	modal.trigger('click');
		    }, delay);
		}
	},
	
	toggle: function() {
		$('.js-toggle').off('click').on('click',function(event) {
			event.preventDefault();
			var toggleid = $(this).data('toggleid');
			var bodyclass = $(this).data('bodyclass');
			$(this).toggleClass('toggled');
			$('#'+toggleid).toggleClass('opened');
			if (bodyclass!=undefined) {
				$('body').toggleClass(bodyclass);
			}
		});
	},
	
	tabs: function() {
		$('.js-tab').off('click').click(function(event) {
			event.preventDefault();
			var tab = $(this).data('tab');
			var wrap = $(this).data('wrap');
			var menu = $(this).data('menu');
			$('#'+menu+' .js-tab').removeClass('active');
			$(this).addClass('active');
			$('#'+wrap+' .tab').removeClass('active');
			$('#'+tab).addClass('active');
		});
	},
	
	tooltip: function() {
		$('.js-tooltip').mouseenter(function(event) {
			event.preventDefault();
			var tooltipid = $(this).data('tooltip');
			$(this).addClass('tooltipped');
			$('#'+tooltipid).addClass('opened');
		});
		$('.js-tooltip').mouseleave(function(event) {
			event.preventDefault();
			var tooltipid = $(this).data('tooltip');
			$(this).removeClass('tooltipped');
			$('#'+tooltipid).removeClass('opened');
		});
		$('.js-tooltip-onfocus').focus(function(event) {
			var tooltipid = $(this).data('tooltip'); 
			$(this).addClass('tooltipped');
			$('#'+tooltipid).addClass('opened');
		});
		$('.js-tooltip-onfocus').focusout(function(event) {
			var tooltipid = $(this).data('tooltip');
			$(this).removeClass('tooltipped');
			$('#'+tooltipid).removeClass('opened');
		});
	},
	
	addRow: function() {
		$('.js-add-row').off('click').click(function(event) {
			event.preventDefault();
			var table_id = $(this).data('table');
			var prototype = $(this).data('prototype');
			var callback = $(this).data('callback');
			var key = $('#'+table_id+' .row:last').data('key');
			if (key === undefined) { 
				key = 1; 
			} else {
				key = parseInt(key) + 1; 				
			}
			prototype = prototype.replace(/bahur/gi, key); 
			$('#'+table_id).append(prototype);
			tat.listeners();
			if (callback!==undefined) {
				var x = eval(callback);
				if (typeof x == 'function') {
					x();
				}
			}
		});
	},
	
	delRow: function() {
		$('.js-del-row').off('click').click(function(event) {
			event.preventDefault();
			var type = $(this).data('type');
			if (type===undefined) {
				type = 'tr';
			}
			var row = $(this).closest(type);
			row.fadeOut(400,function() {
				row.remove();
			});
		});
	},

	scrollTo: function() {
		$('.js-scroll').off('click').click(function(event) {
			event.preventDefault();
			var offset = $(this).data('offset');
				if (offset==undefined) { offset=60; }
		    var target = $(this).data('scrollto');
		    $('html, body').stop().animate({
		        'scrollTop': $('#'+target).offset().top - offset
		    }, 900, 'swing', function () {
		    	
		    });
		});
	},
	
	confirm: function() {
		$('.js-confirm').off('click').click(function(event) {
			event.preventDefault();
			var href = $(this).attr('href');
			modalContent = $(this).data('text')+'';
			tat.modal('confirm',modalContent,$(this));
		});
	},
	
	cookie: function() {
		if ($('body').hasClass('js-cookie')) {
			var cookie = '';
		    match = document.cookie.match(new RegExp('cookielaw=([^;]+)'));
			if (match) cookie = match[1];
		
			if ( cookie.length < 1 ) {
		  		
		  		var cookie_btn = $('body').data('cookie-btn');
		  		var cookie_msg = $('body').data('cookie-msg');
		  		
		        $('body').append( '<div id="cookielaw"><div class="cookielaw-wrap"><div class="cookielaw-msg">' + cookie_msg + '</div><div class="cookielaw-btn"><button id="cookielaw-accept">' + cookie_btn + '</button></div></div></div>' );
		        $('#cookielaw').delay(2000).fadeIn( 500 ).delay(10000).fadeOut(500);
		        setTimeout(function() {
				  $('#cookielaw').remove();
				}, 15000);
		  	
		        $( '#cookielaw-accept' ).click(function () {
		            $( '#cookielaw' ).stop( true, true ).fadeOut( 500 );
		        });
		        
		        var d = new Date();
			    d.setTime(d.getTime() + (30*24*60*60*1000));
			    var expires = "expires="+d.toUTCString();
			    document.cookie = 'cookielaw=Seen; ' + expires;
		    }	
		 }   
	},
	
}
tat.initialize();

// scroll listener v.1.3
var tatScroll = {

	scrollHeight: 180,
	viewport: null,
	scrollTop: null, 
	isOn: false,
			
	initialize: function() {
		if ( $( '.js-inview' ).length ) {
			tatScroll.listener();
			$(document).ready(tatScroll.inview);
		}
		if ( $( '.js-sticky' ).length ) {
			tatScroll.listener();
			if ($('.js-sticky').data('scrollheight')) { 
				tatScroll.scrollHeight = $('.js-sticky').data('scrollheight');
				if (tatScroll.scrollHeight==='touch') {
					tatScroll.scrollHeight = $('.js-sticky').offset().top;
				}
			}
			tatScroll.sticky();
		}
		
	},
	
	listener: function() {
		if (tatScroll.isOn==false) {
			tatScroll.isOn = true;
			tatScroll.viewport = $(window).height();
			$(window).resize(function(){
			   if($(this).height() != tatScroll.viewport){
			      tatScroll.viewport = $(this).height();
			   }
			});
			tatScroll.scrollTop = $('body').scrollTop();
		}
	},
    
    sticky: function() {
    	$(window).scroll( function() {
		    tatScroll.scrollTop = $(this).scrollTop();	
		    if ( tatScroll.scrollTop > tatScroll.scrollHeight ) { 
		    	$('.js-sticky').addClass('scrolled');
				$('body').addClass('sticky-fixed');	   	
		    } else {
		    	$('.js-sticky').removeClass('scrolled');
		    	$('body').removeClass('sticky-fixed');    
		    }
		});
    },
    
    inview: function() {
	    
		if ( $( '.js-inview' ).length ) {
			$('.js-inview').each(function () { 	
				var scrollElement = $(this).offset().top;
				var scrollMin = scrollElement - tatScroll.viewport;
				var scrollMax = scrollElement + $(this).outerHeight();
				var scrollCallback = $(this).data('callback');
				if (tatScroll.scrollTop > scrollMin && tatScroll.scrollTop < scrollMax) { 
					$(this).removeClass('js-inview').addClass('in-viewport');
					if (scrollCallback!==undefined && typeof scrollCallback == 'function') { 
						var scrolledID = $(this).attr('id');
						var scrolledElement = $(this);	
						scrollCallback(scrolledID,scrolledElement); 
					}
				}
			});
		} else {
			$(window).off('scroll', tatScroll.scrollListener);
		} 
    },

}
tatScroll.initialize();
