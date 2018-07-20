(function(root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) { // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
        module.exports = factory();
    } else { // Browser globals (root is window)
        root.SmoothScroll = factory();
    }
}(this, function() {

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

    var SmoothScroll = function(el, options) {

        'user strict';

        var base = Object.create(SmoothScroll.prototype);

        base.opts = { // Default Settings
            tween: true, // 트윈맥스 설정
            tweenDuration: 0.2, // tweenmax duration
            repeatCheck: false, // 높이 반복 체크
            onRender: function(y) {
                // console.log(y);
            }
        };

        if (options !== undefined) { // User defined options (might have more in the future)
            Object.keys(options).forEach(function(key) {
                base.opts[key] = options[key];
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
            onRenderCallback = null,
            fricton = 0.95, // 0.95 higher value for slower deceleration
            vy = 0,
            stepAmt = 2, // 1
            minMovement = 0.1,
            ts = 0.1;

        var myTween = null; // tween object
        var isWheelEvent = false;
        var timerRepeat = null;

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
            var _scrollTop = $window.scrollTop();
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
            if (base.opts.tween !== true) {
                _el.scrollTop(_y);
            } else { // tween
                myTween = TweenLite.to(window, base.opts.tweenDuration, {
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

                animScroll($el, 0 - currentY); // doScroll

                vy *= fricton;

                if (onRenderCallback) { // callback
                    onRenderCallback();
                }

                if (typeof base.opts.onRender == 'function') {
                    base.opts.onRender.call(null, currentY);
                }

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

            if ('ontouchstart' in window) return false;

            $el = ($el !== null) ? $el : $window;

            currentY = targetY = 0;

            setScrollTop(); // first
            refresh(); // refresh
            setHander(); // first

            if (base.opts.repeatCheck === true) { // 높이 반복 체크
                repeatGetMinScrollTop();
            }

            if (running !== true) { // 실행
                running = true;
                animateLoop();
            }

        };

        base.refresh = refresh; // set pubic func.
        base.destroy = destroy;

        init();

        return base;

    };

    return SmoothScroll;

}));
