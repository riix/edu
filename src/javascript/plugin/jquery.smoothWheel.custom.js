/**
 * Created by IntelliJ IDEA.
 *
 * User: phil
 * Date: 15/11/12
 * Time: 11:04 AM
 *
 */
(function($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    var debounce = debounce || function(func, wait, immediate) { // debonce
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
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
            outer: do {  // Insert value (sorted in ascending order).
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

    $.fn.smoothWheel = function() {

        var defaults = {
            tween: true // 트윈맥스 설정
        };

        //  var args = [].splice.call(arguments, 0);
        var opts = $.extend({}, arguments[0], defaults);

        opts.tween = false;
        
        console.log('tween', opts.tween);

        var self = this,
            $el, running = false,
            currentY = 0,
            targetY = 0,
            oldY = 0,
            maxScrollTop = 0, // 0
            minScrollTop, direction, onRenderCallback = null,
            fricton = 0.95, // 0.95 higher value for slower deceleration
            vy = 0,
            stepAmt = 2, // 1
            minMovement = 0.1,
            ts = 0.1;

        var myTween = null; // tween object
        var isWheelEvent = false;

        var updateScrollTarget = function(amt) {
            targetY += amt;
            vy += (targetY - oldY) * stepAmt;
            oldY = targetY;
        };

        var getMinScrollTop = function() {
            minScrollTop = $window.height() - ($el.get(0).scrollHeight || $body[0].scrollHeight);
            // console.log('smoothScroll, reset');
        };

        var setScrollTop = function() { // 현재 위치 반환
            var _scrollTop = $(window).scrollTop();
            currentY = 0 - _scrollTop;
            targetY = oldY = _scrollTop;
            // console.log(_scrollTop);
        };

        var killTween = function() {
            if (myTween === null) return false;
            myTween.kill();
            myTween = null;
            // console.log('killTween');
        };

        var timerRepeat = null;

        var repeatGetMinScrollTop = function() {
            clearTimeout(timerRepeat);
            timerRepeat = setTimeout(function() {
                getMinScrollTop();
                repeatGetMinScrollTop();
            }, 2000);
        };

        repeatGetMinScrollTop();

        var debounceSetScrollTop = debounce(function() { // 휠이 아닌 스크롤시 반응
            setScrollTop();
        }, 50);

        $window.off('.smoothScroll').on('load.smoothScroll scroll.smoothScroll', debounceSetScrollTop);

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

        var move = function(_el, _y) {
            if (opts.tween !== true) {
                _el.scrollTop(_y);
            } else { // tween
                myTween = TweenLite.to(window, 0.2, {
                    scrollTo: {
                        y: _y
                    },
                    overwrite: 5,
                    onComplete: function() {
                        killTween();
                    }
                });
            }
        };

        var render = function() {
            if (vy < -(minMovement) || vy > minMovement) { // 휠을 조작할때

                currentY = (currentY + vy);

                if (currentY > maxScrollTop) { // bulletproof
                    currentY = vy = 0;
                } else if (currentY < minScrollTop) {
                    vy = 0;
                    currentY = minScrollTop;
                }

                // $el.scrollTop(-currentY);
                move($el, 0 - currentY);

                vy *= fricton;

                if (onRenderCallback) { // callback
                    onRenderCallback();
                }
                isWheelEvent = true; // set wheel event
            } else { // 휠이 아닌 조작일때
                isWheelEvent = false;
            }
        };

        var animateLoop = function() {
            if (!running) return;
            requestAnimFrame(animateLoop);
            render();
        };

        this.each(function(i) {

            if ('ontouchstart' in window) return false;

            $el = $(this);
            $el.bind("mousewheel", onWheel);
            $el.bind("DOMMouseScroll", onWheel);

            currentY = targetY = 0;

            getMinScrollTop(); // get min scroll top

            if (opts.onRender) {
                onRenderCallback = opts.onRender;
            }

            if (opts.remove) {
                running = false;
                $el.unbind("mousewheel", onWheel);
                $el.unbind("DOMMouseScroll", onWheel);
            } else if (!running) {
                running = true;
                animateLoop();
            }

            return this;

        });
    };


})(jQuery);
