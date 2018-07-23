window.params = (typeof window.params !== 'undefined') ? window.params : {};
window.params.nav = [0, 0, 0]; // 네비게이션 활성화

$(function() {

    'use strict';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html');

    var windowScrollTop = 0;

    var returnAnchor = function($this){ // a 태그 반환
        return ($this.is('a')) ? $this : $this.closest('a');
    };

    var initNav = function(){
        console.log('navigation:' + window.params.nav);
    };

    initNav();

    // slider
    var initSlider = function(_el, _options){

        var $el = _el;

        if (!$el.length) return false;

        var _defaults = {
            autoPlay: true,
            pauseAutoPlayOnClick: true,
            duration: 2000
        };
        var opts = $.extend({}, _defaults, _options);

        var $wrap = $el.find('.slider-wrap'),
            $items = $el.find('.slider-item'),
            $pagers = $el.find('.slider-pager');

        var idx = 0,
            itemLength = $items.length,
            timerSlide = null,
            timerAutoPlay = null,
            isHover = false;

        var doPrev = function(){
            doSlide(idx - 1);
        };
        var doNext = function(){
            doSlide(idx + 1);
        };
        var autoPlay = function(){
            clearTimeout(timerAutoPlay);
            if (opts.autoPlay !== true) return false;
            timerAutoPlay = setTimeout(function(){
                doNext();
            }, opts.duration);
        };
        var doSlide = function(_idx){
            clearTimeout(timerSlide);
            idx = _idx;
            if (idx > itemLength -1) {
                idx = 0;
            } else if (idx < 0) {
                idx = itemLength - 1;
            }
            var $current = $items.eq(idx);
            var _boolLight = $current.hasClass('is-light');
            $current.addClass('in');
            $pagers.find('li').eq(idx).addClass('in').siblings().removeClass('in');
            timerSlide = setTimeout(function(){
                $el.toggleClass('is-light', _boolLight);
                $current.siblings().removeClass('in');
                autoPlay();
            }, 2);
        };
        $pagers.on('click', 'a', function(e){
            var $this = $(e.target),
            _idx = $this.closest('li').index();
            if (opts.pauseAutoPlayOnClick) { // 클릭시 자동재생 해제
                opts.autoPlay = false;
            }
            doSlide(_idx);
        });
        $wrap.hover(function(){ // 보강 필요
            isHover = true;
        }, function(){
            isHover = false;
        });
        doSlide(0);
    };

    // page main
    initSlider($('#visualSlider'), {
        duration: 1500
    });
    initSlider($('#newsSlider'), {
        duration: 1000
    });

    $('.js-graph').each(function(i){
        var $this = $(this),
            _num = $this.attr('data-graph'),
            $el = $this.find('.graph span'),
            $num = $this.find('.num');
        $el.css({
            'transitionDelay': (i + 1) * 80 + 'ms',
            'width': _num
        });
        $num.val(_num);
    });

    $document.on('click', '.js-toggle-this', function(e){ // favorites
        var $this = $(e.target);
        $this = returnAnchor($this);
        $this.toggleClass('in');
    });

    $document.on('click', '.js-collapse', function(e){ // collapse
        var $this = $(e.target);
        $this = returnAnchor($this);
        var _mode = $this.attr('data-mode');
        var $li = $(e.target).closest('.collapse');
        $li.toggleClass('in');
        if (_mode == 'alone') {
            $li.siblings('.collapse').removeClass('in');
        }
    });

    $window.on('load scroll', function(){
        windowScrollTop = $window.scrollTop();
    });

    $document.on('click', '.js-toggle-tab a', function(e){
        var $li = $(e.target).closest('li');
        var $target = $li.closest('.js-toggle-tab').next('.toggle-wrap');
        var _idx = $li.index();
        $li.addClass('in').siblings().removeClass('in');
        $target.find('.toggle').eq(_idx).addClass('in').siblings().removeClass('in');
    });

    var defers = function(){ // defer excute
        $('a[href="#!"]').each(function(){
            $(this).attr('href', 'javascript:;');
        });
        $('i.icon').each(function(){
            var $this = $(this);
            $this.attr('title', $this.text());
        });
    };

    defers();

});

$(function(){

    'use strict';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html');

    var throttle = (function() { // throttle
        var _timerThrottle;
        return function(_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

    $.fn.stickyAside = function(_options){

        var _defaults = {
            marginTop: 0
        };

        var opts = $.extend({}, _defaults, _options);

        return this.each(function(){

            var $target = $('.js-sticky-start').eq(0);
            var $this = $(this);
            var stickyStart = 173; // margin
            var _prev = null;
            var windowScrollTop = 0;

            if ($target.length) {
                var _margin = ($target.attr('data-sticky-margin') !== undefined) ? $target.attr('data-sticky-margin') * 1: 0; // data 마진 설정
                stickyStart = ($target.offset().top + _margin) - opts.marginTop;
            }
            if ($this.closest('.sticky-tab-wrap')) {
                $this.closest('.sticky-tab-wrap').css({
                    'height': $this.height()
                });
            }

            $this.css({
                'margin-top': opts.marginTop,
                'opacity': 1
            });

            // init sticky
            var stickyOnScroll = function(){
                var _bool = (stickyStart + opts.marginTop <= windowScrollTop);
                if (_bool !== _prev) {
                    if (_bool !== true) {
                        $this.css('top', stickyStart);
                    } else {
                        $this.css('top', '0');
                    }
                    $html.toggleClass('is-sticky', _bool);
                }
                _prev = _bool;
            };

            $window.on('load scroll', function(){
                windowScrollTop = $window.scrollTop();
                stickyOnScroll();
            });

        });
    };

    $('#stickyPromo .holder').stickyAside({
        marginTop: 40
    });
    $('.js-sticky-tab').stickyAside({
        marginTop: 0
    });

});
