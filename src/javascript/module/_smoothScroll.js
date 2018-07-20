(function(root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) { // Node/CommonJS
        module.exports = function (root, jQuery) {
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
        root.SmoothScroll = factory(jQuery);
    }
})(this, function ($) {

    'use strict';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body'),
        body = body || (document.documentElement || document.body.parentNode || document.body);

    var debounce = debounce || function(_func, _wait, _immediate) { // debonce
        var _timeout;
        return function() {
            var _context = this,
                _args = arguments;
            var later = function() {
                _timeout = null;
                if (!_immediate) _func.apply(_context, _args);
            };
            var _callNow = _immediate && !_timeout;
            clearTimeout(_timeout);
            _timeout = setTimeout(later, _wait);
            if (_callNow) _func.apply(_context, _args);
        };
    };

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = window.requestAnimFrame || (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // http://jsbin.com/iqafek/2/edit
    var normalizeWheelDelta = function() { // Keep a distribution of observed values, and scale by the 33rd percentile.
        var distribution = [],
            done = null,
            scale = 30;
        return function(n) {
            if (n == 0) return n; // Zeroes don't count.
            if (done != null) return n * done; // After 500 samples, we stop sampling and keep current factor.
            var abs = Math.abs(n);
            outer: do { // Insert value (sorted in ascending order).
                for (var i = 0; i < distribution.length; ++i) { // Just used for break goto
                    if (abs <= distribution[i]) {
                        distribution.splice(i, 0, abs);
                        break outer;
                    }
                }
                distribution.push(abs);
            } while (false);
            var factor = scale / distribution[Math.floor(distribution.length / 3)]; // Factor is scale divided by 33rd percentile.
            if (distribution.length == 500) done = factor;
            return n * factor;
        };
    }();

    var SmoothScroll = function(el, _options) {

        'user strict';

        var base = Object.create(SmoothScroll.prototype);

        var opts = { // Default Settings
            tween: true, // 트윈맥스 설정
            tweenDuration: 0.2, // tweenmax duration
            repeatCheck: false, // 높이 반복 체크
            onRender: function(y) {
                // console.log(y);
            }
        };

        if (_options !== undefined) { // extend options
            Object.keys(_options).forEach(function(key) {
                opts[key] = _options[key];
            });
        }

        var $el = null,
            running = false,
            currentY = 0,
            targetY = 0,
            oldY = 0,
            maxScrollTop = 0, // 0
            minScrollTop = null,
            direction = null,
            fricton = 0.95, // 0.95 higher value for slower deceleration
            vy = 0,
            stepAmt = 2, // 1
            minMovement = 0.1,
            ts = 0.1;

        var timerRepeat = null;
        var myTween = null; // tween object
        var isWheelEvent = false;

        var updateScrollTarget = function(amt) {
            targetY += amt;
            vy += (targetY - oldY) * stepAmt;
            oldY = targetY;
        };

        var getMinScrollTop = function() {
            minScrollTop = (window.innerHeight || body.clientHeight) - (body.scrollHeight); // window height, document height
            // console.log('smoothScroll, reset');
        };

        var setScrollTop = function() { // 현재 위치 반환
            var _scrollTop = (window.pageYOffset || body.scrollTop ); // window scroll top
            currentY = 0 - _scrollTop;
            targetY = oldY = _scrollTop;
            // console.log(_scrollTop);
        };

        var killTween = function() { // kill tween
            if (myTween === null) return false;
            myTween.kill();
            myTween = null;
        };

        var repeatGetMinScrollTop = function() {
            clearTimeout(timerRepeat);
            timerRepeat = setTimeout(function() {
                getMinScrollTop();
                repeatGetMinScrollTop();
            }, 2000);
        };

        var onWheel = function(e) {
            e.preventDefault();
            var evt = e.originalEvent,
                delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40,
                dir = delta < 0 ? -1 : 1;
            if (dir != direction) {
                vy = 0;
                direction = dir;
            }
            updateScrollTarget(delta);
        };

        var animScroll = function(_el, _y) {
            _y = _y.toFixed(2);
            if (opts.tween !== true) { // no tweenmax
                _el.scrollTop(_y);
            } else { // tweenmax
                myTween = TweenMax.to(window, opts.tweenDuration, {
                    // ease: Power4.easeOut,
                    // autokill: false,
                    scrollTo: {
                        y: _y
                    },
                    overwrite: 4,
                    onComplete: function() {
                        killTween();
                    }
                });
            }
        };

        var render = function() { // render
            if (vy < -(minMovement) || vy > minMovement) { // 휠을 조작할때

                currentY = (currentY + vy);

                if (currentY > maxScrollTop) { // bulletproof
                    currentY = vy = 0;
                } else if (currentY < minScrollTop) {
                    vy = 0;
                    currentY = minScrollTop;
                }

                animScroll($el, 0 - currentY); // doScroll

                if (typeof opts.onRender == 'function') {
                    opts.onRender.call(null, currentY);
                }

                vy *= fricton;

                isWheelEvent = true; // set wheel event
            } else { // 휠이 아닌 조작일때
                isWheelEvent = false;
            }
        };

        var animateLoop = function() {
            if (running !== true) return;
            requestAnimFrame(animateLoop);
            render();
        };

        var destroy = function() {
            running = false;
            $el = ($el !== null) ? $el : $window;
            $el.off('.smoothScroll');
        };

        var refresh = function() { // refresh
            $window.scrollTop(0);
            getMinScrollTop(); // get min scroll top
            // console.log('refresh scroll');
        };

        var setHander = function() { // set handler
            var debounceOnScroll = debounce(function() { // 휠이 아닌 스크롤시 반응
                    setScrollTop();
                }, 50),
                debounceOnResize = debounce(function() {
                    refresh();
                }, 50);
            $window.off('.smoothScroll');
            $window.on('mousewheel.smoothScroll, DOMMouseScroll.smoothScroll', onWheel);
            $window.on('resize.smoothScroll', debounceOnResize);
            $window.on('scroll.smoothScroll', debounceOnScroll);
        };

        var init = function() {

            if ('ontouchstart' in window) return false; // is mobile

            $el = ($el !== null) ? $el : $window;

            currentY = targetY = 0;

            setScrollTop(); // first
            refresh(); // refresh
            setHander(); // first

            if (opts.repeatCheck === true) { // 높이 반복 체크
                repeatGetMinScrollTop();
            }

            if (running !== true) { // 실행
                running = true;
                animateLoop();
            }

            $html.addClass('init-smooth-scroll');

        };

        base.refresh = refresh; // set pubic func.
        base.destroy = destroy;

        init();

        return base;

    };

    return SmoothScroll;

});
