(function(root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) { // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) { // require('jQuery') returns a factory that requires window to build a jQuery instance, we normalize how we use modules that require this pattern but the window provided is a noop if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else { // Browser globals
        root.Underline = factory(jQuery);
    }
})(this, function($) {

    var Underline = function(el, options) {

        'use strict';

        var $window = $window || $(window),
            $document = $document || $(document),
            $html = $html || $('html'),
            $body = $body || $('body');

        var base = Object.create(Underline.prototype);

        var HTML = '<div id="underline"><span></span><span></span></div>';

        var EASING = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

        var CSS = {
            ready: {
                'position': 'fixed',
                'z-index': '1',
                'left': '0',
                // 'top': '0',
                'height': '2px',
                'opacity': '0',
                // 'margin-top': '15px',
                // 'margin-left': '-2px',
                // 'background-color': '#fff',
                'transition': 'opacity .3s linear 0s, transform 0s linear 0s, width 0s linear 0s'
            },
            complete: {
                'transition': 'opacity .3s linear 0s, transform .4s ' + EASING + ' 0s, width .4s ' + EASING + ' 0s'
            }
        };

        var $el = null,
            $span = null,
            $nav = null,
            $links = null,
            $active = null;
        var _isHover = false,
            _timer = null,
            _delay = 500;

        var animTo = function(_el, _toggle){

            _el = (_el !== undefined) ? _el : $nav.find('.in');

            var _target = null,
                _top = $nav.height(),
                _width = 0,
                _left = 0;

            if (!_el.length || _toggle === false) { // 활성화 객체가 없을때, Home 등
                _target = $links.eq(0);
                if (_target.length){
                    _width = _target.width();
                    _left = _target.offset().left - _width;
                    $span.css('opacity', 0);
                }
            } else {
                _target = _el.find('span');
                _width = _target.width();
                _left = _target.offset().left;
                $span.css('opacity', 1);
            }

            $span.stop().css({
                'width': _width,
                'left': '0',
                // 'top': _top,
                'transform': 'translate3d('+ _left + 'px, 0 ,0)'
            });

        };

        var build = function(){
            $nav = $('#header .nav');
            $links = $nav.find('li');
            $active = $links.filter('.in');
            $el = $(HTML);
            $span = $el.children();
            $span.css(CSS.ready);
            // $body.prepend($el);
            $('#header').prepend($el);

            animTo($links.eq(0), false);

            setTimeout(function(){
                $span.css(CSS.complete);
            }, 600);
        };

        var _repeat = function(){
            clearTimeout(_timer);
            _delay = 1000;
            _timer = setTimeout(function(){
                if (_isHover !== true) {
                    animTo();
                }
                _repeat();
            }, _delay);
        };

        $window.on('load.underline resize.underline', function(){
            animTo();
        });

        base.pause = function(){
            clearTimeout(_timer);
            $links.off('.underline');
            // console.log('pause');
        };

        base.refresh = function(){
            $nav = $('#header .nav');
            $links = $nav.find('li');
            $active = $links.filter('.in');
            animTo();
            _repeat();
            $links.on({
                'mouseenter.underline': function(){
                    _isHover = true;
                    var $this = $(this);
                    animTo($this);
                },
                'mouseleave.underline': function(){
                    _isHover = false;
                }
            });
        };

        var init = function(){
            build();
            base.refresh();
        };

        init();

        return base;
    };

    return Underline;

});
