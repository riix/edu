(function($) {

    'use strict';

    var MODULE = {
        name: 'tilt',
        title: 'tilt',
        desc: '마우스 포인터에 반응하는 Tilt',
        version: '0.1'
    };

    var _defaults = {
        // tweenMax: true,
        selector: '.js-tilt-el',
        speed: 150,
        easing: {
            enter: 'ease-out',
            leave: 'ease-in' // elastic cubic-bezier(.75,-0.5,0,1.75), or ease-in
        },
        items: [{ // selector 순서대로 속성 부여
            perspective: 300, // 시점이 낮을 수록 tilt 가 많이 됨
            translateZ: 20,
            scale: 1.1, // or false
            tilt: 10, // 기울기
            gravity: -10
        }, {
            perspective: 500,
            translateZ: 10,
            scale: 1.1, // or false
            tilt: 10, // 기울기
            gravity: 0
        }]
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var getMousePos = $.getMousePos || function(e) { // from http://www.quirksmode.org/js/events_properties.html#position
        var _posX = 0,
            _posY = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            _posX = e.pageX;
            _posY = e.pageY;
        } else if (e.clientX || e.clientY) {
            _posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            _posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            x: _posX,
            y: _posY
        };
    };

    // From https://davidwalsh.name/javascript-debounce-function.
    // var myEfficientFn = debounce(function() {
    // }, 250);
    // window.addEventListener('resize', myEfficientFn);
    function debounce(func, wait, immediate) {
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

    var addClass = addClass || function addClass(_el, _class) {
        if (_el.classList) {
            _el.classList.add(_class);
        } else if (!hasClass(_el, _class)) {
            _el.setAttribute('class', _el.getAttribute('class') + ' ' + _class);
        }
    };

    $.fn.hoverTilt = function(_options) {

        var opts = $.extend({}, _defaults, _options);

        var itemsDefaults = { // opts 없을때 적용
            perspective: 600,
            translateZ: 10,
            scale: 1.02, // or false
            tilt: 10, // 기울기
            gravity: 0
        };

        var CSS = { // 'will-change': 'transform', class 로 대신함, .container:hover { will-change: transform; }
            resetTransform: 'perspective(500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        };

        return this.each(function() {

            var base = {},
                $this = $(this),
                ticking = true,
                timerTransition = null;

            var tween = [];

            var onMouseEnter = function(e) {
                if (opts.tweenMax !== true) {
                    toggleTransitionTime(true); // css 동작시만
                }
            };

            var anim = function(i, _el, _prop, _bool) {
                if (opts.tweenMax !== true) {
                    var _transform = '';
                    _transform += 'scale3d(' + _prop.scale + ',' + _prop.scale + ',' + _prop.scale + ') ';
                    if (_prop.maxTilt !== 0) {
                        _transform += 'perspective(' + _prop.perspective + 'px) ';
                        _transform += 'rotateX(' + _prop.tiltY + 'deg) rotateY(' + _prop.tiltX + 'deg) ';
                        _transform += 'translateZ(' + _prop.z + 'px) ';
                    }
                    if (_prop.gravity !== 0) {
                        _transform += 'translateX(' + _prop.x + 'px) translateY(' + _prop.y + 'px) ';
                    }
                    _el.style.WebkitTransform = _el.style.transform = _transform;
                } else {
                    tween[i] = TweenMax.to(_el, 0.6, {
                        scale: _prop.scale,
                        x: _prop.x,
                        y: _prop.y,
                        z: _prop.z,
                        transformPerspective: _prop.perspective,
                        rotationX: _prop.tiltX,
                        rotationY: _prop.tiltY
                    });
                }
            };

            var onMouseMove = function(e) {

                var _mousePos = getMousePos(e);

                for (var i = 0; i < base.itemLength; i++) {

                    var _setting = opts.items[i] || itemsDefaults; // 아이템 각각의 속성 기본값, 보강 필요

                    var _prop = {
                        maxTilt: _setting.tilt * 1,
                        gravity: _setting.gravity * 1,
                        perspective: _setting.perspective * 1,
                        scale: _setting.scale * 1,
                        z: _setting.translateZ * 1,
                        x: 0,
                        y: 0,
                        angle: 0,
                        tiltX: 0,
                        tiltY: 0
                    };


                    var $this = base.$items.eq(i),
                        _this = base.items[i];

                    var _offset = $this.offset();

                    var _itemProps = base.prop[i];

                    var _relLeft = (_mousePos.x - _itemProps.offsetLeft),
                        _relTop = (_mousePos.y - _itemProps.offsetTop),
                        _percentX = _relLeft / _itemProps.width, // width
                        _percentY = _relTop / _itemProps.height; // height

                    if (_prop.maxTilt !== 0) { // tilt
                        _prop.tiltX = (_prop.maxTilt / 2 - _percentX * _prop.maxTilt).toFixed(2) * 1;
                        _prop.tiltY = (_percentY * _prop.maxTilt - _prop.maxTilt / 2).toFixed(2) * 1;
                        _prop.angle = Math.atan2(_mousePos.x - (base.offset.left + base.elWidth / 2), -(_mousePos.y - (base.offset.top + base.elHeight / 2))) * (180 / Math.PI); // 광원을 위한 장치
                    }

                    if (_prop.gravity !== 0) { // gravity, 인력, 끌어당김
                        _prop.x = ((-1 * _prop.gravity - _prop.gravity) / base.elWidth * _relLeft + _prop.gravity).toFixed(2);
                        _prop.y = ((-1 * _prop.gravity - _prop.gravity) / base.elHeight * _relTop + _prop.gravity).toFixed(2);
                    }

                    anim(i, _this, _prop, true); // do anim

                };

                ticking = false;
            };

            var onMouseLeave = function(e) {
                if (opts.tweenMax !== true) {
                    toggleTransitionTime(false);
                    for (var i = 0; i < base.items.length; i++) {
                        base.items[i].style.WebkitTransform = base.items[i].style.transform = CSS.resetTransform;
                    }
                } else {
                    for (var i = 0; i < base.items.length; i++) {
                        tween[i] = TweenMax.to(base.items[i], 0.6, {
                            scale: 1,
                            x: 0,
                            y: 0,
                            z: 1,
                            transformPerspective: 500,
                            rotationX: 0,
                            rotationY: 0
                        });
                    }
                }
            };

            var toggleTransitionTime = function(_bool) {
                if (opts.tweenMax === true) return false; // tweenmax 일 경우 불필요
                clearTimeout(timerTransition);
                var _easing = (_bool === true) ? opts.easing.enter : opts.easing.leave,
                    _transition = 'transform ' + opts.speed + 'ms ' + _easing + ' 0s';
                for (var i = 0; i < base.items.length; i++) { // 초기화, 반드시 필요함
                    base.items[i].style.WebkitTransition = base.items[i].style.transition = _transition;
                }
                if (_bool === true) { // on 시 반응 속도를 빠르게 함
                    var _timeoutSpeed = opts.speed + (opts.speed * 0.1),
                        _transitionReset = 'transform 0s ' + _easing + ' 0s';
                    timerTransition = setTimeout(function() {
                        for (var i = 0; i < base.items.length; i++) {
                            base.items[i].style.WebkitTransition = base.items[i].style.transition = _transitionReset;
                        }
                    }, _timeoutSpeed);
                }
            };

            var reset = function(){ // reset
                base.prop = [];
                base.offset = base.$el.offset();
                base.elWidth = base.$el.outerWidth(); // || bounds.width
                base.elHeight = base.$el.outerHeight(); // || bounds.height
                for (var i = 0; i < base.itemLength; i++) {
                    var _offset = base.$items.eq(i).offset();
                    var _prop = {
                        offsetTop: _offset.top,
                        offsetLeft: _offset.left,
                        width: base.$items.eq(i)[0].offsetWidth,
                        height: base.$items.eq(i)[0].offsetHeight
                    };
                    base.prop.push(_prop);
                }
            };

            var init = function() {

                base.$el = $this;
                base.el = base.$el[0];
                base.$items = $this.find(opts.selector);
                base.itemLength = base.$items.length;
                base.items = [];

                if (!base.itemLength) return false;

                var mouseenterFn = function(e) {
                    onMouseEnter();
                    ticking = false;
                };

                var mousemoveFn = function(e) {
                    if (ticking) return;
                    requestAnimationFrame(function() {
                        onMouseMove(e);
                    });
                    ticking = true;
                };

                var mouseleaveFn = function(e) {
                    requestAnimationFrame(function() {
                        onMouseLeave();
                    });
                };

                var onResize = debounce(function() {
                    reset(); // reset
                }, 250);

                for (var i = 0; i < base.itemLength; i++) {
                    base.items.push(base.$items.eq(i)[0]);
                }

                imagesLoaded(base.el, function(){
                    reset(); // reset
                    addClass(base.el, 'init-tilt');
                });

                $window.on('resize', onResize);

                $this.on({
                    'mouseenter': mouseenterFn,
                    'mousemove': mousemoveFn,
                    'mouseleave': mouseleaveFn
                });

            };

            init();

        });
    };

})(window.jQuery);

$(function() {

    // $('.js-tilt').hoverTilt();

});
