// ------------------------------------------
// Rellax.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

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
        root.Rellax = factory(jQuery);
    }
})(this, function($) {

    var detectMobile = detectMobile || function() { // 모바일 체크
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    var throttle = (function() { // throttle
        var _timerThrottle;
        return function(_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

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

    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
        setTimeout(callback, 1000 / 60);
    };

    var transformProp = window.transformProp || (function() { // check which transform property to use
        var testEl = document.createElement('div'),
            vendors = ['Webkit', 'Moz', 'ms'];
        if (testEl.style.transform === null) {
            for (var vendor in vendors) {
                if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
                    return vendors[vendor] + 'Transform';
                }
            }
        }
        return 'transform';
    })();

    var hasClass = hasClass || function hasClass(_el, _class) {
        return _el.getAttribute('class').indexOf(_class) > -1;
    };

    var addClass = addClass || function addClass(_el, _class) {
        if (_el.classList) {
            _el.classList.add(_class);
        } else if (!hasClass(_el, _class)) {
            _el.setAttribute('class', _el.getAttribute('class') + ' ' + _class);
        }
    };

    var removeClass = removeClass || function removeClass(_el, _class) {
        if (_el.classList) {
            _el.classList.remove(_class);
        } else if (hasClass(_el, _class)) {
            _el.setAttribute('class', _el.getAttribute('class').replace(_class, ' '));
        }
    };

    var toggleClass = toggleClass || function toggleClass(_el, _class, _bool) {
        _bool = (_bool !== undefined) ? _bool : hasClass(_el, _class);
        if (_bool === true) {
            addClass(_el, _class);
        } else {
            removeClass(_el, _class);
        }
    };

    var Rellax = function(el, options) {

        'use strict';

        var base = Object.create(Rellax.prototype);

        var opts = { // Default Settings
            tweenMax: false, // tweenMax, smoothScroll 시 필요없음
            translate3d: false, // z값, css 일때
            inView: {
                active: true, // false 일 경우 기능해제
                trigger: true, // data-trigger 속성이 있는 개체에 대한 trigger 기능 여부
                offsets: {
                    screenTopRatio: -0.2, // 0.2, 스크린 상단 마진, 음수면 상단에서 미리 보임
                    screenBottomRatio: 0.05, // 0.2, 스크린 하단 마진, 음수면 하단에서 미리 보임
                    outHeight: -200 // inview 벗어난 구간, 퍼포먼스를 위함, 적정 수치는 300
                },
                on: {
                    reset: function(i) {
                        var item = base.items[i],
                            $item = base.$items.eq(i);
                        // $el.css({
                        //     'opacity': '0',
                        //     'transition': 'opacity 0s ease-in-out'
                        // });
                    },
                    in: function(i) {
                        var item = base.items[i],
                            $item = base.$items.eq(i);
                        // $el.css({
                        //     'opacity': '1',
                        //     'transition': 'opacity .6s ease-in-out'
                        // });
                    },
                    out: function(i) {
                        var item = base.items[i],
                            $item = base.$items.eq(i);
                        // $el.css({
                        //     'opacity': '0'
                        // });
                    }
                }
            },
            inViewOffsetTopRatio: 0, // inview 비율
            inViewOffsetBottomRatio: 0.2, // inview 비율
            duration: 0.1, // 0.1
            speed: -2,
            center: false,
            wrapper: null, // '#container',
            round: true,
            vertical: true,
            horizontal: false,
            on: {
                scroll: function() {},
            }
        };

        var CLASSES = { // 클래스명
            inView: {
                out: 'is-parallax-out',
                in: 'is-parallax-in',
                after: 'is-parallax-after'
            }
        };

        if (options) { // User defined options (might have more in the future)
            Object.keys(options).forEach(function(key) {
                opts[key] = options[key];
            });
        }

        if (opts.wrapper) { // Has a wrapper and it exists
            if (!opts.wrapper.nodeType) {
                var wrapper = document.querySelector(opts.wrapper);
                if (wrapper) {
                    opts.wrapper = wrapper;
                } else {
                    throw new Error("The wrapper you're trying to use don't exist.");
                }
            }
        }

        var isMobile = window.isMobile || detectMobile();

        if (isMobile === true) { // 모바일 일때
            opts.tweenMax = false;
        }

        var body = body || (document.documentElement || document.body.parentNode || document.body);

        var blocks = [],
            posX = 0,
            posY = 0,
            screenX = 0,
            screenY = 0,
            pause = true;

        var myTween = null; // timemax tween

        var setElements = function() {
            el = (!el) ? '.js-parallax' : el;
            if (el instanceof jQuery === true) {
                base.$items = el;
            } else if (typeof el == 'string') {
                base.$items = $(el);
            } else {
                throw new Error("The elements you're trying to select don't exist.");
            }
            base.$items = $(el);
            base.items = [];
            for (var i = 0; i < base.$items.length; i++) {
                base.items.push(base.$items.eq(i)[0]);
            }
        };

        var updatePosition = function(percentageX, percentageY, speed) { // Ahh a pure function, gets new transform value based on scrollPosition and speed Allow for decimal pixel values
            var result = {},
                valueX = (speed * (100 * (1 - percentageX))),
                valueY = (speed * (100 * (1 - percentageY)));
            result.x = opts.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
            result.y = opts.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;
            return result;
        };

        var createBlock = function(el) { // We want to cache the parallax blocks' values: base, top, height, speed. el: is dom object, return: el cache values

            var dataPercentage = el.dataset.parallaxPercentage || el.getAttribute('data-parallax-percentage'), // riix
                dataSpeed = el.dataset.parallaxSpeed || el.getAttribute('data-parallax-speed') || opts.speed,
                dataZindex = el.dataset.parallaxZindex || el.getAttribute('data-parallax-zindex') || 0,
                dataTrigger = el.dataset.parallaxTrigger || el.getAttribute('data-parallax-trigger') || false;


            // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
            // ensures elements are positioned based on HTML layout.
            //
            // If the element has the percentage attribute, the posY and posX needs to be
            // the current scroll position's value, so that the elements are still positioned based on HTML layout
            var wrapperPosY = opts.wrapper ? opts.wrapper.scrollTop : (window.pageYOffset || body.scrollTop),
                posY = opts.vertical ? (dataPercentage || opts.center ? wrapperPosY : 0) : 0,
                posX = opts.horizontal ? (dataPercentage || opts.center ? (window.pageXOffset || body.scrollLeft) : 0) : 0;

            var blockTop = posY + el.getBoundingClientRect().top,
                blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight,
                blockLeft = posX + el.getBoundingClientRect().left,
                blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

            var percentageY = 0,
                percentageX = 0;

            if (dataPercentage !== null) {
                percentageY = dataPercentage;
                percentageX = dataPercentage;
            } else {
                if (opts.center) {
                    percentageX = 0.5;
                    percentageY = 0.5;
                } else {
                    percentageY = (posY - blockTop + screenY) / (blockHeight + screenY);
                    percentageX = (posX - blockLeft + screenX) / (blockWidth + screenX);
                }
            }

            var bases = updatePosition(percentageX, percentageY, dataSpeed);

            var style = el.style.cssText; // ~~Store non-translate3d transforms~~. Store inline styles and extract transforms
            var transform = '';

            // Check if there's an inline styled transform
            if (style.indexOf('transform') >= 0) {
                var index = style.indexOf('transform'), // Get the index of the transform
                    trimmedStyle = style.slice(index), // Trim the style to the transform point and get the following semi-colon index
                    delimiter = trimmedStyle.indexOf(';');
                if (delimiter) { // Remove "transform" string and save the attribute
                    transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
                } else {
                    transform = " " + trimmedStyle.slice(11).replace(/\s/g, '');
                }
            }

            return {
                baseX: bases.x,
                baseY: bases.y,
                top: blockTop,
                left: blockLeft,
                height: blockHeight,
                width: blockWidth,
                speed: dataSpeed,
                style: style,
                transform: transform,
                zindex: dataZindex,
                trigger: dataTrigger,
                fired: false,
                viewed: false
            };
        };

        var cacheBlocks = function() { // Get and cache initial position of all elements
            for (var i = 0; i < base.items.length; i++) {
                var _block = createBlock(base.items[i]);
                blocks.push(_block);
            }
        };

        var getScrollTopAndReturnScrolled = function() { // set scroll position (posY, posX). side effect method is not ideal, but okay for now. returns true if the scroll changed, false if nothing happened
            var oldY = posY,
                oldX = posX;
            posY = opts.wrapper ? opts.wrapper.scrollTop : body.scrollTop || window.pageYOffset; // set scroll position
            posX = opts.wrapper ? opts.wrapper.scrollLeft : body.scrollLeft || window.pageXOffset;
            if (oldY != posY && opts.vertical) { // scroll changed, return true
                return true;
            }
            if (oldX != posX && opts.horizontal) { // scroll changed, return true
                return true;
            }
            return false; // scroll did not change
        };

        var timerKill = null;

        var killTween = function(_delay) { // kill tweening
            _delay = (_delay !== undefined) ? _delay : 0;
            if (myTween === null) return false;
            clearTimeout(timerKill);
            timerKill = setTimeout(function() {
                myTween.kill();
                myTween = null;
                // console.log('kill', _delay);
            }, _delay);
        };

        var toggleItems = { // toggleItems
            reset: function(i) {
                addClass(base.items[i], CLASSES.inView.out);
                removeClass(base.items[i] , CLASSES.inView.in);
                opts.inView.on.reset.call(null, i);
            },
            onEnter: function(i) {
                var _item = base.items[i];
                removeClass(_item, CLASSES.inView.out);
                addClass(_item, CLASSES.inView.in);
                if (blocks[i].after !== true) {
                    addClass(_item, CLASSES.inView.after);
                }
                opts.inView.on.in.call(null, i); // callback
            },
            onOut: function(i) {
                addClass(base.items[i], CLASSES.inView.out);
                removeClass(base.items[i], CLASSES.inView.in);
                opts.inView.on.out.call(null, i); // callback
            }
        };

        var triggerItems = { // toggleItems
            reset: function(i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('out');
            },
            onEnter: function(i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('in');
                if (blocks[i].after !== true) {
                    base.$items.eq(i).trigger('inFirst');
                }
            },
            onOut: function(i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('out');
            }
        };

        var animate = function() { // Transform3d on parallax element

            var positions;

            var _transformEl = function(_idx, _el, _x, _y, _z, _transform){ // transform element
                if (opts.tweenMax !== true) { // 스피드 설정이 0일 경우 skip
                    var translate = (opts.translate3d === true) ? 'translate3d(' + _x + 'px,' + _y + 'px,' + _z + 'px) ' : 'translate(' + _x + 'px,' + _y + 'px) '
                    translate += _transform;
                    _el.style[transformProp] = translate;
                } else { // tweenmax, 스피드 설정이 0일 경우 skip
                    myTween = TweenMax.to(_el, opts.duration, {
                        x: _x,
                        y: _y,
                        z: _z,
                        overwrite: 5,
                        onComplete: function() {
                            killTween(500);
                        }
                    });
                }
                // console.info(_idx, _x, _y, _z, _transform);
            };

            for (var i = 0; i < base.items.length; i++) {

                var _el = base.items[i],
                    _block = blocks[i];

                var percentageY = ((posY - _block.top + screenY) / (_block.height + screenY)), // 실제 좌표대비 조정 구간
                    percentageX = ((posX - _block.left + screenX) / (_block.width + screenX));

                // Subtracting initialize value, so element stays in same spot as HTML
                positions = updatePosition(percentageX, percentageY, _block.speed); // - _block.baseX;

                var positionY = positions.y - _block.baseY, // 실제 좌표대비 percentageY 로 얻어진 조정 수치
                    positionX = positions.x - _block.baseX;

                var _x = (opts.horizontal ? positionX : '0') * 1, // riix tween
                    _y = (opts.vertical ? positionY : '0') * 1;

                var zindex = _block.zindex;

                var getInView = function(_offsets) {
                    var _screenTopMargin = screenY * _offsets.screenTopRatio, // 스크린 대비 비율 조정 계산치
                        _screenBottomMargin = screenY * _offsets.screenBottomRatio;
                    var distanceElementTopAndScreenBottom = (posY - _block.top + screenY - _y), // 객체와 스크린의 거리
                        distanceElementBottomAndScreenTop = (_block.top + _block.height - posY + _y),
                        isElementTopInScreenEnd = (distanceElementTopAndScreenBottom - _screenBottomMargin >= 0), // 객체 상단이 스크린 하단 위에 있는지
                        isElementBottomInScreenTop = (distanceElementBottomAndScreenTop - _screenTopMargin >= 0), // 객체 하단이 스크린 상단 위에 있는지
                        isElemntTopInScreenOutterEnd = (distanceElementTopAndScreenBottom - _offsets.outHeight >= 0), // 보여지지 않는 부분, 오프셋(마진) 포함, 퍼포먼스를 위함
                        isElemntBottomInScreenOutterTop = (distanceElementBottomAndScreenTop - _offsets.outHeight >= 0);
                    var _result = {
                        out: (isElemntTopInScreenOutterEnd === true && isElemntBottomInScreenOutterTop === true), // 오프셋(마진) 포함, 퍼포먼스를 위함
                        in: (isElementTopInScreenEnd === true && isElementBottomInScreenTop === true)
                    };
                    // if (i == 3) {
                    //     console.log(distanceElementTopAndScreenBottom, distanceElementBottomAndScreenTop);
                    //     console.log(i, 'isElementTopInScreenEnd', isElementTopInScreenEnd, 'isElementBottomInScreenTop', isElementBottomInScreenTop);
                    //     $(_el).css('border', 'solid 10px #ff0000');
                    // }
                    return _result;
                };

                var _isInView = getInView(opts.inView.offsets), // inView 계산
                    _isToggled = (blocks[i].in !== _isInView.in); // is toggled

                if (_isInView.out === true) { // 필요한 구간만 움직임, out 영역 안에 들어왔을때, 퍼포먼스를 위함

                    if (blocks[i].fired !== true) { // reset, fired 인자가 있을때만 초기화
                        toggleItems.reset(i); // reset
                        triggerItems.reset(i);
                        _block.fired = true;
                    }

                    if (_isToggled === true) { // 토글시에만 실행
                        if (_isInView.in === true) {
                            toggleItems.onEnter(i); // in
                            triggerItems.onEnter(i);
                            _block.viewed = true; // 첫 view, toggleItems 하단에 위치함
                        } else {
                            toggleItems.onOut(i); // out
                            triggerItems.onOut(i);
                        }
                    }

                    blocks[i].in = _isInView.in; // 토글을 위해 상태 저장
                    blocks[i].out = _isInView.out;

                    if (_block.speed != 0) { // speed 가 0일 경우 skip
                        _transformEl(i, _el, _x, _y, zindex, _block.transform); // transform element
                    }

                }

            }

            if (typeof opts.on.scroll == 'function') { // callback
                opts.on.scroll(positions);
            }

        };

        var core = function() {
            blocks = [];
            screenY = window.innerHeight;
            screenX = window.innerWidth;
            getScrollTopAndReturnScrolled();
            cacheBlocks();
            animate();
        };

        var resize = debounce(function() {
            for (var i = 0; i < blocks.length; i++) {
                base.items[i].style.cssText = blocks[i].style;
            }
            setElements(); // set elements
            core();
            // console.log('rellax resize');
        }, 500);

        var refresh = function() {
            for (var i = 0; i < blocks.length; i++) {
                base.items[i].style.cssText = blocks[i].style;
            }
            setElements(); // set elements
            core();
        };

        var init = function() { // Let's kick this script off.  Build array for cached element values
            for (var i = 0; i < blocks.length; i++) {
                base.items[i].style.cssText = blocks[i].style;
            }
            setElements(); // set elements
            core();
            $html.toggleClass('is-smooth-scroll-tweenmax', opts.tweenMax); // toggle class

            if (pause === true) { // If paused, unpause and set listener for window resizing events
                $window.on('resize.rellax', resize);
                pause = false;
            }
        };

        var update = function() { // Loop
            if (getScrollTopAndReturnScrolled() === true) {
                if (pause !== true) {
                    animate();
                }
            }
            loop(update); // loop again
        };

        base.destroy = function() {
            killTween();

            // riix, 불필요함
            // for (var i = 0; i < base.items.length; i++) {
            //     base.items[i].style.cssText = blocks[i].style;
            // }

            // Remove resize event listener if not pause, and pause
            if (pause !== true) {
                $window.off('.rellax');
                pause = true;
            }
        };

        base.refresh = refresh; // Allow to recalculate the initial values whenever we want

        init(); // Init
        update(); // Start the loop

        return base;
    };

    return Rellax;

});
