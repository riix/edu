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

        var _duration = $el.data('duration') || opts.duration;

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
            }, _duration);
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
        duration: 3000
    });
    initSlider($('#newsSlider'), {
        duration: 3000
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

    $window.on('load scroll', function(){
        windowScrollTop = $window.scrollTop();
    });

    var handlers = function(){

        $document.on('click', '.js-toggle-html', function(e){ // favorites
            var $this = $(e.target);
            $this = returnAnchor($this);
            var _class = $this.attr('data-clasㅡ먀ㅜs');
            $html.toggleClass(_class);
            var _bool = $html.hasClass(_class);
            if (_class === 'is-login') {
                if (_bool === true) {

                } else {

                }
            }
        });

        $document.on('click', '.js-toggle-this', function(e){ // favorites
            var $this = $(e.target);
            $this = returnAnchor($this);
            $this.toggleClass('in');
        });

        $document.on('click', '.js-active-this', function(e){ // bbs media
            var $this = $(e.target);
            $this = returnAnchor($this);
            $this.addClass('in').siblings('.js-active-this').removeClass('in');
        });

        $document.on('click', '.js-collapse', function(e){ // collapse
            var $this = $(e.target);
            $this = returnAnchor($this);
            var _mode = $this.attr('data-mode'),
                $li = $(e.target).closest('.collapse');
            $li.toggleClass('in');
            if (_mode == 'alone') {
                $li.siblings('.collapse').removeClass('in');
            }
        });

        $document.on('click', '.js-toggle-tab a', function(e){
            var $li = $(e.target).closest('li'),
                $target = $li.closest('.js-toggle-tab').next('.toggle-wrap'),
                _idx = $li.index();
            var $active = $target.find('.toggle').eq(_idx);
            $li.addClass('in').siblings().removeClass('in');
            $active.addClass('in').siblings().removeClass('in');

            // 로그인 모달일때
            if ($li.parents('.is-modal-login').length) {
                console.log('login');
                $active.find('input').val('').focus();
                setTimeout(function(){
                    $active.find('input').eq(0).focus();
                }, 400)
            }
        });
    };

    var modals = function(){

        var closeModal = function(){
            $html.toggleClass('is-overlay is-modal is-login is-find-id is-join-ok', false);
        };

        $.openModal = function(_class, _idx){ // toggle modal
            closeModal();
            $html.addClass('is-overlay is-modal ' + _class);
            var $modal = $('.md-modal');
            $modal.attr('tab-index', 0);
            if (_idx !== undefined) {
                $modal.find('.js-toggle-tab a').eq(_idx).trigger('click'); // trigger
            }
        };

        $document.on('click', '.js-modal-login', function(e){ // modal login
            $.openModal('is-login', 0); // login
        });

        $document.on('click', '.js-modal-join', function(e){ // modal login
            $.openModal('is-login', 1); // join
        });

        $document.on('click', '.js-modal-find-id', function(e){ // modal login
            $.openModal('is-find-id', 0); // login
        });

        $document.on('click', '.js-modal-close', function(e){ // favorites
            var $this = $(e.target);
            closeModal();
        });

    };

    var defers = function(){ // defer excute
        $('a[href="#!"]').each(function(){
            $(this).attr('href', 'javascript:;');
        });
        $('i.icon').each(function(){
            var $this = $(this);
            $this.attr('title', $this.text());
        });
    };

    handlers();
    modals();
    defers();

    $('select.select').selectric();

    $('.file-fake .attach').on('click', function(e){
        var $this = $(e.target);
        $this = $this.is('a') ? $this : $this.closest('a');
        $this.closest('.file-fake').find('.file').trigger('click');
    });

    $('.file-fake .delete').on('click', function(e){
        var $this = $(e.target);
        $this = $this.is('a') ? $this : $this.closest('a');
        $this.closest('.file-fake').find('.file').val('').prev().val('');
    });

    $('.file-fake .file').on('change', function(e){
        var $this = $(this);
        var _val = $this.val();
        $this.prev().val(_val);
    });

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
            marginTop: 0,
            onScroll: true,
            className: 'is-sticky'
        };

        var opts = $.extend({}, _defaults, _options);

        return this.each(function(){

            var $target = $('.js-sticky-start').eq(0);
            var $this = $(this);
            var stickyStart = $('html').hasClass('is-promo') ? 173: 93; // margin
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

            // init sticky
            var stickyOnScroll = function(){
                var _bool = (stickyStart + opts.marginTop <= windowScrollTop);
                if (_bool !== _prev) {
                    if (_bool !== true) {
                        $this.css('top', stickyStart);
                    } else {
                        $this.css('top', '0');
                    }
                    $html.toggleClass(opts.className, _bool);
                }
                _prev = _bool;
            };

            var core = function(){
                windowScrollTop = $window.scrollTop();
                stickyOnScroll();
            };

            if (opts.onScroll === true) {
                $window.on('scroll', function(){
                    core();
                });
            }

            $window.on('load', function(){
                core();
            });

            setTimeout(function(){
                core();
                $this.css({
                    'margin-top': opts.marginTop,
                    'opacity': 1
                });
            }, 200);

        });
    };

    $('#stickyPromo .holder').stickyAside({
        marginTop: 40,
        onScroll: false,
        className: 'is-sticky-banner'
    });
    $('.js-sticky-tab').stickyAside({
        marginTop: 0
    });

    $('.js-tab-lecture').each(function(){
        var $wrap = $(this);
        var $items = $wrap.find('li');
        var _offsetTop = $wrap.offset().top;
        var $sections = $('.section-sticky');
        var _length = $sections.length;
        var _tops = [];
        $sections.each(function(i){
            var _top = parseInt($(this).offset().top, 10) - 54;
            // if (i == 0) {
            //     _top = _top - 54;
            // }
            _tops.push(_top);
        });
        $(window).on('load scroll', function(){
            var _scrollTop = $window.scrollTop();
            var _bool =  _scrollTop > _offsetTop;
            $html.toggleClass('is-tab-fixed', _bool);
            var _active = 0;
            for (var i = 0; i < _tops.length; i++) {
                if (_tops[i] < _scrollTop) {
                    _active = i;
                }
            }
            $items.eq(_active).addClass('in').siblings().removeClass('in');
        });
        $items.children().on('click', function(e){
            e.preventDefault();
            var $this = $(e.target);
            $this = ($this.is('a')) ? $this : $this.closest('a');
            var _href = $this.attr('href');
            var $target = $(_href);
            var _target = $target.offset().top - 52;
            if (_href == '#lectures') {
                if ($target.find('.pic').length) {
                    _target = $target.find('.pic').offset().top - 62;
                } else {
                    _target = _target + 34;
                }
            }
            $('html, body').animate({
                'scrollTop': _target
            }, 60);
        });
    });

});
