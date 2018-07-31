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
        root.InView = factory(jQuery);
    }
})(this, function ($) {

    var InView = function(_selector, _options) {

        var baseObj = Object.create(InView.prototype);

        var _defaults = { // defauls
            sceneMode: false, // containerSceneMode, isDark 등을 탐지
            onlyToggle: true, // 반대 상태에서만 반응 (퍼포먼스 향상)
            trigger: false, // set jquery event trigger
            triggerIn: 'in',
            triggerOut: 'out',
            scrollUp: {
                top: 0.2,
                bottom: 0
            },
            scrollDown: {
                top: 0,
                bottom: 0.2
            },
            onEnter: function(base) {
                // console.info(base);
                // console.log('onEnter', base.idx);
            },
            onExit: function(base) {
                // console.log('onExit', base.idx);
            },
            onCurrentEnter: function(base) {
                // console.log('current', base.currentIdx);
            }
        };

        var $window = $window || $(window),
            $document = $document || $(document),
            $html = $html || $('html'),
            $body = $body || $('body');

        var detectMobile = detectMobile || function(){ // 모바일 체크
            var check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        var isMobile = window.isMobile || detectMobile();

        function debounce(func, wait, immediate) { // debonce
            var timeout;
            return function() {
                var context = this, args = arguments;
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

        var common = {
            addHandler: function(element, type, handler) {
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + type, handler);
                } else {
                    element["on" + type] = handler;
                }
            },
            removeHandler: function(element, type, handler) {
                if (element.removeEventListener) {
                    element.removeEventListener(type, handler, false);
                } else if (element.detachEvent) {
                    element.detachEvent("on" + type, handler);
                } else {
                    element["on" + type] = handler;
                }
            },
            callFunc: function(_func, _obj, _param) { // callback 함수 호출하기
                _func = (typeof _func == 'string') ? window[_func] : _func;
                _param = (_param === null) ? '' : _param;
                if (_func && typeof _func == 'function') {
                    _func.call(null, _obj, _param);
                } else {
                    console.log('no exist function');
                }
            },
            isInview: function(_el, _options) {
                var _setting = $.extend({
                    top: 0, // 상단 마진, 윈도우 크기에서 몇 퍼센트 (0.25);
                    bottom: 0 // 하단 마진, 윈도우 크기에서 몇 퍼센트 (0.25);
                }, _options);
                var _getPercent = function(_int, _percent) { // 퍼센트 처리, _getPercent(100, 0.5);
                    var _result = Math.floor(_int * _percent);
                    return _result;
                };
                var $el = _el,
                    $window = $window || $(window),
                    _windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, // 윈도우 크기
                    _scrollTop = document.documentElement.scrollTop || document.body.scrollTop, // 스크롤 탑
                    _scrollBottom = _scrollTop + _windowHeight,
                    _elOffset = $el.offset(),
                    _elementTop = _elOffset.top, // 객체 상단 위치
                    _elementBottom = _elOffset.top + $el.height(), // 객체 하단 위치
                    _marginTop = _getPercent(_windowHeight, _setting.top), // 상단 여백 구하기
                    _marginBottom = _getPercent(_windowHeight, _setting.bottom), // 하단 여백 구하기
                    _isInviewElementTop = ((_scrollBottom - _marginBottom) >= _elementTop), // 스크롤 하단에 객체 상단이 들어왔는지
                    _isInviewElementBottom = ((_scrollTop + _marginTop) <= _elementBottom), // 스크롤 상단에 객체 하단이 벗어나지 않았는지
                    _result = (_isInviewElementTop === true && _isInviewElementBottom === true) ? true : false;
                return _result;
            }
        };

        var _opts = $.extend({}, _defaults, _options);

        var base = {
            idx: 0,
            itemLength: 0, // 전체 아이템 갯수
            inviewItemLength: 0, // 전체 보여지는 아이템 갯수
            current: $(null),
            currentIdx: 0,
            scrollTop: 0,
            dir: 'down'
        };

        var $items = null,
            $stickyUpper = null, // sticky trigger, 옵션
            $stickyMiddle = null,
            $stickyDowner = null;

        var _sceneMode = _opts.sceneMode, // sceneMode
            _lastScroll = 0; // 방향 탐지에 사용

        var util = {
            toggleInviewEl: function(_el, _bool) { // toggle inview element
                if (_opts.onlyToggle === true && _el.hasClass('is-inview') === _bool) return false; // 반대 상태에서만 실행
                var _func = (_bool === true) ? _opts.onEnter : _opts.onExit;
                _el.toggleClass('is-inview', _bool);
                util.toggleTrigger(_el, _bool);
                common.callFunc(_func, base);
            },
            getCurrentInviewEl: function(_el, _current, _val, _currentIdx) { // get current inview element
                var _result = _el;
                if (common.isInview(_current, _val) === true) { // is inview
                    _result = _current;
                    base.currentIdx = (_currentIdx !== undefined) ? _currentIdx : base.currentIdx; // set current idx
                }
                return _result;
            },
            setCurrent: function(_el, _idx) { // set sticky trigger
                base.current = util.getCurrentInviewEl(base.current, _el, { top: 0.3, bottom: 0.3 }, _idx);
            },
            setStickyTrigger: function(_el, _idx) { // set sticky trigger
                if (_sceneMode !== true) return false;
                $stickyUpper = util.getCurrentInviewEl($stickyUpper, _el, { top: 0, bottom: 0.9 });
                $stickyMiddle = util.getCurrentInviewEl($stickyMiddle, _el, { top: 0.5, bottom: 0.5 });
                $stickyDowner = util.getCurrentInviewEl($stickyDowner, _el, { top: 0.9, bottom: 0 });
            },
            doCurrent: function(_el) { // set sticky trigger
                if (!base.current.length) return false;
                if (_sceneMode === true) { // sceneMode 일 경우
                    base.current.addClass('is-inview-current').siblings().removeClass('is-inview-current');
                    base.elementId = base.current.attr('id'); // element id
                }
                common.callFunc(_opts.onCurrentEnter, base);
            },
            doStickyTrigger: function() { // do sticky trigger
                if (_sceneMode !== true) return false;
                var _do = function(_el, _from, _to) {
                    if (_el === null || !_el.length) return false;
                    $html.toggleClass(_to, _el.hasClass('is-dark'));
                };
                _do($stickyUpper, 'is-dark', 'is-dark-upper');
                _do($stickyMiddle, 'is-dark', 'is-dark-middle');
                _do($stickyDowner, 'is-dark', 'is-dark-downer');
            },
            toggleTrigger: function(_el, _bool) { // trigger
                if (_opts.trigger !== true && _opts.trigger !== 'true') return false;
                var _func = (_bool === true) ? _opts.triggerIn : _opts.triggerOut,
                    _hasClass = _el.hasClass('is-inview');
                if (_bool === _hasClass){
                    _el.trigger(_func);
                }
            }
        };

        var onScroll = function() { // doScroll

            base.inviewItemLength = 0;
            base.scrollTop = $window.scrollTop(); // 방향 탐지
            base.dir = (base.scrollTop >= _lastScroll) ? 'down' : 'up';
            _lastScroll = base.scrollTop;

            var _core = function(_dir) { // 메인

                var i = 0,
                    _optsStandard = (_dir == 'up') ? _opts.scrollUp : _opts.scrollDown; // inview 기준치

                var _loopItems = function(_idx) {

                    var $this = $items.eq(_idx),
                        _boolInview = (common.isInview($this, _optsStandard) === true);

                    base.el = $this; // set global var.
                    base.idx = _idx;

                    // toggle inview element
                    // 기준치 내에 들어가는/벗어나는 모든 아이템 실행
                    util.toggleInviewEl($this, _boolInview);

                    // 기준치 내에 들어가는 해당 아이템 기준으로 실행
                    util.setCurrent($this, _idx); // set current
                    util.setStickyTrigger($this, _idx); // set sticky trigger

                };

                for (i = 0; i < base.itemLength; i++) { // up, down 에 따라 순차, 역순차 탐지
                    var _idx = (_dir == 'up') ? (base.itemLength - 1) - i : i;
                    _loopItems(_idx);
                }

                util.doCurrent(); // do current
                util.doStickyTrigger(); // do sticky trigger

            };

            _core(base.dir); // onScroll

        };

        var refresh = function() { // reset
            _lastScroll = 0;
            $items = $(_selector);
            base.el = $(null);
            base.current = $(null);
            base.itemLength = $items.length;
            $html.addClass('init-inview');
        };

        var init = function() {

            var debounceOnResize = debounce(function(){
                onScroll();
                // console.log('inview resize');
            }, 400);

            var setHandler = function(){
                var eventNameScroll = (isMobile === true) ? 'touchmove.inviewHandler' : 'scroll.inviewHandler';
                $window.off('.inviewHandler');
                $window.on('resize.inviewHandler', debounceOnResize);
                $window.on(eventNameScroll, onScroll);
            };

            setHandler();
            refresh();
            onScroll();

        };

        baseObj.refresh = function(){
            refresh();
            onScroll();
        };

        baseObj.destroy = function(){
            $window.off('.inviewHandler');
        };

        init();

        return baseObj;

    };

    return InView;

});

// ------------------------------------------
// Rellax.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
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
        root.Rellax = factory(jQuery);
    }
})(this, function ($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html');

    var detectMobile = detectMobile || function () { // 모바일 체크
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    var throttle = (function () { // throttle
        var _timerThrottle;
        return function (_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

    var debounce = debounce || function (_func, _wait, _immediate) { // debonce
        var _timeout;
        return function () {
            var _context = this,
                _args = arguments;
            var later = function () {
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
    var loop = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        setTimeout(callback, 1000 / 60);
    };

    var transformProp = window.transformProp || (function () { // check which transform property to use
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

    var Rellax = function (el, options) {

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
                    reset: function (i) {
                        var item = base.items[i],
                            $item = base.$items.eq(i);
                        // $el.css({
                        //     'opacity': '0',
                        //     'transition': 'opacity 0s ease-in-out'
                        // });
                    },
                    in: function (i) {
                        var item = base.items[i],
                            $item = base.$items.eq(i);
                        // $el.css({
                        //     'opacity': '1',
                        //     'transition': 'opacity .6s ease-in-out'
                        // });
                    },
                    out: function (i) {
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
            round: true, // Math.round();
            vertical: true,
            horizontal: false,
            on: {
                scroll: function () { },
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
            Object.keys(options).forEach(function (key) {
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

        var setElements = function () {
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

        var updatePosition = function (percentageX, percentageY, speed) { // Ahh a pure function, gets new transform value based on scrollPosition and speed Allow for decimal pixel values
            var result = {},
                valueX = (speed * (100 * (1 - percentageX))),
                valueY = (speed * (100 * (1 - percentageY)));
            result.x = opts.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
            result.y = opts.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;
            return result;
        };

        var createBlock = function (el) { // We want to cache the parallax blocks' values: base, top, height, speed. el: is dom object, return: el cache values

            var dataPercentage = el.dataset.parallaxPercentage || el.getAttribute('data-parallax-percentage'), // riix
                dataSpeed = el.dataset.parallaxSpeed || el.getAttribute('data-parallax-speed') || opts.speed,
                dataZindex = el.dataset.parallaxZindex || el.getAttribute('data-parallax-zindex') || 0,
                dataTrigger = el.dataset.parallaxTrigger || el.getAttribute('data-parallax-trigger') || false;


            // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
            // ensures elements are positioned based on HTML layout.
            //
            // If the element has the percentage attribute, the posY and posX needs to be
            // the current scroll position's value, so that the elements are still positioned based on HTML layout
            var wrapperPosY = opts.wrapper ? opts.wrapper.scrollTop : (window.pageYOffset || body.scrollTop);

            var posY = opts.vertical ? (dataPercentage || opts.center ? wrapperPosY : 0) : 0,
                blockTop = posY + el.getBoundingClientRect().top,
                blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight,
                percentageY = 0;

            var posX = opts.horizontal ? (dataPercentage || opts.center ? (window.pageXOffset || body.scrollLeft) : 0) : 0,
                blockLeft = posX + el.getBoundingClientRect().left,
                blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth,
                percentageX = 0;

            if (dataPercentage !== null) {
                percentageY = dataPercentage;
            } else {
                if (opts.center) {
                    percentageY = 0.5;
                } else {
                    percentageY = (posY - blockTop + screenY) / (blockHeight + screenY);
                }
            }

            if (dataPercentage !== null) {
                percentageX = dataPercentage;
            } else {
                if (opts.center) {
                    percentageX = 0.5;
                } else {
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

        var cacheBlocks = function () { // Get and cache initial position of all elements
            for (var i = 0; i < base.items.length; i++) {
                var _block = createBlock(base.items[i]);
                blocks.push(_block);
            }
        };

        var getScrollTopAndReturnScrolled = function () { // set scroll position (posY, posX). side effect method is not ideal, but okay for now. returns true if the scroll changed, false if nothing happened

            var oldY = posY;
            posY = opts.wrapper ? opts.wrapper.scrollTop : body.scrollTop || window.pageYOffset; // set scroll position

            var oldX = posX;
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

        var killTween = function (_delay) { // kill tweening
            _delay = (_delay !== undefined) ? _delay : 0;
            if (myTween === null) return false;
            clearTimeout(timerKill);
            timerKill = setTimeout(function () {
                myTween.kill();
                myTween = null;
                // console.log('kill', _delay);
            }, _delay);
        };

        var toggleItems = { // toggleItems
            reset: function (i) {
                addClass(base.items[i], CLASSES.inView.out);
                removeClass(base.items[i], CLASSES.inView.in);
                opts.inView.on.reset.call(null, i);
            },
            onEnter: function (i) {
                var _item = base.items[i];
                removeClass(_item, CLASSES.inView.out);
                addClass(_item, CLASSES.inView.in);
                if (blocks[i].after !== true) {
                    addClass(_item, CLASSES.inView.after);
                }
                opts.inView.on.in.call(null, i); // callback
            },
            onOut: function (i) {
                addClass(base.items[i], CLASSES.inView.out);
                removeClass(base.items[i], CLASSES.inView.in);
                opts.inView.on.out.call(null, i); // callback
            }
        };

        var triggerItems = { // toggleItems
            reset: function (i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('out');
            },
            onEnter: function (i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('in');
                if (blocks[i].after !== true) {
                    base.$items.eq(i).trigger('inFirst');
                }
            },
            onOut: function (i) {
                if (opts.inView.trigger !== true && blocks[i].trigger !== true) return false;
                base.$items.eq(i).trigger('out');
            }
        };

        var animate = function () { // Transform3d on parallax element

            var positions;

            var _transformEl = function (_idx, _el, _x, _y, _z, _transform) { // transform element
                if (opts.tweenMax !== true) { // 스피드 설정이 0일 경우 skip
                    var translate = (opts.translate3d === true) ? 'translate3d(' + _x + 'px,' + _y + 'px,' + _z + 'px) ' : 'translate(' + _x + 'px,' + _y + 'px) ';
                    translate += _transform;
                    _el.style[transformProp] = translate;
                } else { // tweenmax, 스피드 설정이 0일 경우 skip
                    myTween = TweenMax.to(_el, opts.duration, {
                        x: _x,
                        y: _y,
                        z: _z,
                        overwrite: 5,
                        onComplete: function () {
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

                // if (i==4){
                //     console.log(positions.y);
                // }

                var _x = (opts.horizontal ? positionX : '0') * 1, // riix tween
                    _y = (opts.vertical ? positionY : '0') * 1;

                var zindex = _block.zindex;

                var getInView = function (_offsets) {
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

        var core = function () {
            blocks = [];
            screenY = window.innerHeight;
            screenX = window.innerWidth;
            getScrollTopAndReturnScrolled();
            cacheBlocks();
            animate();
        };

        var resize = debounce(function () {
            for (var i = 0; i < blocks.length; i++) {
                base.items[i].style.cssText = blocks[i].style;
            }
            setElements(); // set elements
            core();
            // console.log('rellax resize');
        }, 500);

        var refresh = function () {
            for (var i = 0; i < blocks.length; i++) {
                base.items[i].style.cssText = blocks[i].style;
            }
            setElements(); // set elements
            core();
        };

        var init = function () { // Let's kick this script off.  Build array for cached element values
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

        var update = function () { // Loop
            if (getScrollTopAndReturnScrolled() === true) {
                if (pause !== true) {
                    animate();
                }
            }
            loop(update); // loop again
        };

        base.destroy = function () {
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

(function(global){

    var _easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

    global.CSS_EFFECT = { // 효과
        blockReveal: {
            off: {
                prev: {
                    'transform': 'translate3d(-101%, 0, 0)'
                },
                current: {
                    'visibility': 'hidden'
                },
                next: {
                    'transform': 'translate3d(-101%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'transform': 'translate3d(101%, 0, 0)'
                },
                current: {
                    'visibility': 'visible'
                },
                next: {
                    // 'transition': 'transform 1.2s ' + _easing + ' .2s',
                    'transform': 'translate3d(200%, 0, 0)'
                }
            }
        },
        fadeUp: {
            off: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 0, 0)',
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 100%, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, -100%, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        fadeLeft: {
            off: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(100%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(-100%, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        slideUp: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 100%, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, -100%, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        slideLeft: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(100%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(-100%, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        title: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(-100px, 0, 0) rotateX(0deg)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(100px, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                }
            }
        },
        hover: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(-40px, 0, 0) rotateX(0deg)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(40px, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                }
            }
        },
        zoomIn: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'scale3d(1, 1, 1)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'scale3d(0, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'scale3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'scale3d(1, 1, 1)'
                }
            }
        }
    };

})(window);

(function($) {

    'use strict';

    var MODULE = {
        name: 'textMotion',
        title: '텍스트 효과',
        desc: '이벤트 트리거를 통해 스크롤에 반응할 수 있음, 코드 확장으로 다양한 표현',
        version: '1.0'
    };

    var _defaults = {
        // css: 'random', // css 효과
        css: 'fadeUp', // css 효과
        autoPlay: false, // autoplay
        autoPlayDelay: 3500, // autoplay 지연시간
        itemDelay: 0.1, // 아이템간 딜레이
        itemDuration: 0.8, // 아이템간 듀레이션
        inDelay: 0,
        outDelay: 0,
        mobile: true,
        perspective: 1200,
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        lettering: null // 'all' || 'words' || 'lines'
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    if (typeof window.CSS_EFFECT == 'undefined') {
        alert('func 필요');
    }

    var CSS_EFFECT = window.CSS_EFFECT,
        TRANSITIONEND_NAMES = 'webkitTransitionEnd.clear otransitionend.clear oTransitionEnd.clear msTransitionEnd.clear transitionend.clear';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    var base = {
        html: [
            '<div class="text-wrap">',
            '<div class="text-child text-before"></div>',
            '<div class="text-child text-current"></div>',
            '<div class="text-child text-after"></div>',
            '</div>'
        ],
        style: {
            wrap: {
                'position': 'relative',
                'display': 'inline-block',
                'overflow': 'hidden'
            },
            child: {
                'position': 'absolute',
                'top': '0',
                'bottom': '0',
                'left': '0',
                'right': '0'
            }
        }
    };

    var isMobile = function(){ // 모바일 체크
        var _result = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        return _result;
    };

    var common = {
        readCustomData: function(_el, _obj) { // read custom data
            if (typeof _obj !== 'object') return false;
            var _result = _obj;
            $.each(_result, function(key, val) { // get custom data
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(), // buttonSubmit 을 button-submit 등으로 camelCase 를 hipen 구조로 변환
                    _data = _el.attr('data-' + _key);
                if (_data !== undefined) {
                    _result[key] = _data;
                }
            });
            return _result;
        },
        saveCustomData: function(_el, _obj) { // save custom data
            if (typeof _obj !== 'object') return false;
            var _result = _obj;
            $.each(_result, function(key, val) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase();
                if (_el.attr('data-' + _key) === undefined) {
                    _el.attr('data-' + _key, _result[key]);
                }
            });
        },
        getRandomInArray: function(_arr) { // 배열에서 랜덤값 추출하기
            var _result = ['blue', 'red', 'green', 'orange', 'pink'];
            _result = (typeof _arr === 'object') ? _arr : _result;
            _result = _result[Math.floor(Math.random() * _result.length)];
            return _result;
        },
        getRandomInLiteralArray: function(_css, _arr){ // replace random literal array
            var _result = _css;
            if (_result == 'random') {
                var _length = 0,
                    _tmpArr = [];
                for (var key in _arr) {
                    _tmpArr[_length] = key;
                    _length++;
                }
                _result = common.getRandomInArray(_tmpArr);
            }
            return _result;
        }
    };

    var model = {
        getHtmlBreakWord: function(_text, _method){ // 글자 나누기
            var _result = '';
            if (_method == 'lines') { // break all
                _result = '<u>' + _text + '</u>';
            } else if (_method == 'words') { // break word
                var _temp = _text.split(' '),
                    _length = _temp.length;
                for (var i = 0; i < _length; i++) {
                    var _active = _temp[i];
                    if (i > 0) {
                        _result += '<u class="space">&nbsp;</u>';
                    }
                    _result += '<u>' + _active + '</u>';
                }
            } else {
                var _length = _text.length;
                for (var i = 0; i < _length; i++) {
                    var _active = _text.charAt(i);
                    if (_active == ' ') {
                        _result += '<u class="space">&nbsp;</u>';
                    } else {
                        _result += '<u>' + _active + '</u>';
                    }
                }
            }
            return _result;
        },
        getElement: function(_el){ // 엘리먼트 구하기
            var _result = {};
            _result.this = _el;
            _result.wrap = _result.this.children();
            _result.children = _result.wrap.children();
            _result.prev = _result.children.eq(0);
            _result.current = _result.children.eq(1);
            _result.next = _result.children.eq(2);
            return _result;
        },
        extendMode: function(_fxName, _items){ // mode
            if (_fxName == 'blockReveal') {
                var _color = _items.current.css('color'),
                    _css = {
                    color: _color,
                    backgroundColor: _color
                };
                _items.prev.css(_css);
                _items.next.css(_css);
            }
        },
        resetCSS: function(_el, _cssDefault, _fxName){ // buildCSS Elements
            var _items = model.getElement(_el);
            var _cssFX = CSS_EFFECT[_fxName];
            _items.wrap.css(_cssDefault.wrap);
            _items.prev.css(_cssDefault.child);
            _items.next.css(_cssDefault.child);
            _items.prev.css(_cssFX.off.prev);
            _items.next.css(_cssFX.off.next);
            _items.wrap.css({
                perspective: '1200px'
            });
            _items.current.css((_cssFX.off.current !== undefined ) ? _cssFX.off.current : {
                'visibility': 'hidden',
                'transition': 'visibility 0s'
            });
            model.extendMode(_fxName, _items);
        },
        onComplete: function(_group){
            var _length = _group.length;
            var _complete = function(_el){ // 완료시 실행
                _group.find('.text-child').css('transition', 'all 0s linear');
            };
            _group.off('.clear').eq(_length - 1).find('.text-after').one(TRANSITIONEND_NAMES, function(){
                _complete();
            });
        },
        addItemsCSS: function(_items, _bool, _idx, _setting, _css){ // 아이템 css 부여하기

            var _duration = _setting.itemDuration * 1,
                _delay = _setting.itemDelay * 1,
                _easing = _setting.easing,
                _visibilityDelay = _duration / 2;

            _delay = (_delay * _idx);
            _visibilityDelay = (_bool === true) ? _visibilityDelay + _delay : _visibilityDelay - _delay;

            var _visibility = 'visibility 0s linear ' + _visibilityDelay + 's, ',
                _opacity = 'opacity ' + _duration + 's ' + _easing + ' ' + _delay + 's, ',
                _transform = 'transform ' + _duration + 's ' + _easing + ' ' + _delay + 's ',
                _result = _visibility + _opacity + _transform;

            _items.children.css({
                'transition': _result
            });
            _items.prev.css(_css.prev);
            _items.next.css(_css.next);

            if (_css.current !== undefined) {
                _items.current.css(_css.current);
            }

        }
    };

    $.fn.textMotion = function(_options){

        return this.each(function(){

            var $this = $(this);

            var _opts = {};

            var _timerToggle = null;

            var _toggle = function(_el, _bool){ // on 일때

                if (_opts.mobile === false && isMobile() === true) return false;

                if (_bool === undefined) { // toggle
                    _bool = (_el.hasClass('is-in-text-motion')) ? false : true;
                }

                var $group = _el.find('u'),
                    _length = $group.length,
                    _fx = (_bool === true) ? CSS_EFFECT[_opts.css].on : CSS_EFFECT[_opts.css].off,
                    _startDelay = ((_bool === true) ? _opts.inDelay : _opts.outDelay) * 1000 + 1;

                var _core = function(){
                    _el.toggleClass('is-in-text-motion', _bool); // flag
                    model.onComplete($group); // clear trainsition time
                    for (var i = 0; i < _length; i++) {
                        var $this = $group.eq(i),
                            $items = model.getElement($this);
                        model.addItemsCSS($items, _bool, i, _opts, _fx);
                    }
                };

                clearTimeout(_timerToggle);

                if (_startDelay > 10) { // delay 가 있을 경우
                    _timerToggle = setTimeout(function(){
                        _core();
                    }, _startDelay);
                } else {
                    _core();
                }

            };

            var _init = function(_el, _opts){ // 초기화

                var _timerAutoPlay = null;

                var _drawGroupHtml = function(_el){ // html 그리기
                    var _text = _el.text();

                    _el.html(base.html.join(''));
                    _el.find('.text-child').text(_text);

                };

                var _setHandler = function(_el){ // 핸들러 부여
                    _el.off('.textMotion').on({
                        'in.textMotion': function(){
                            clearTimeout(_timerAutoPlay);
                            _toggle(_el, true); // on
                        },
                        'out.textMotion': function(){
                            clearTimeout(_timerAutoPlay);
                            _toggle(_el, false);
                        }
                    });
                };

                var _autoPlay = function(_el){
                    if (_opts.autoPlay === true || _opts.autoPlay == 'true') { // autoplay
                        var _autoPlayDelay = 1000;
                        var _repeat = function(){
                            _timerAutoPlay = setTimeout(function(){
                                clearTimeout(_timerAutoPlay);
                                _autoPlayDelay = _opts.autoPlayDelay;
                                _toggle(_el);
                                _repeat();
                            }, _autoPlayDelay);
                        };
                        _repeat();
                    }
                };

                var _length = _el.length;

                for (var i = 0; i < _length; i++) {

                    var $this = _el.eq(i),
                        _text = null,
                        _html = '';

                    if ($this.hasClass('init-text-motion')) return false;

                    // get text and addclass
                    _text = $.trim($this.text());
                    _html = model.getHtmlBreakWord(_text, _opts.lettering);
                    $this.addClass('init-text-motion text-motion-' + _opts.css.toLowerCase()).attr('data-text', _text);
                    $this.empty().append(_html);

                    _setHandler($this); // set handler
                    _autoPlay($this);

                    $this.find('u').each(function(){ // group
                        var $this = $(this);
                        _drawGroupHtml($this);
                        model.resetCSS($this, base.style, _opts.css);
                    });

                }
            };

            _opts = $.extend({}, _defaults, _options)
            _opts = (common.readCustomData($this, _opts)); // read custom data

            _opts.css = common.getRandomInLiteralArray(_opts.css, CSS_EFFECT); // replace random literal array

            common.saveCustomData($this, { // save custome data
                'in-delay': _opts.inDelay,
                'out-delay': _opts.outDelay,
                'item-delay': _opts.itemDelay,
                'item-duration': _opts.itemDuration
            });

            _init($this, _opts);

        });

    };

})(window.jQuery);

$(function() {

    // var $el = $('.js-text-motion');

    // $.textMotion.init($('.js-text-motion'));

    // $('.js-text-motion').textMotion();

});

(function($){

    'use strict';

    var MODULE = {
        name: 'colorMask',
        title: 'colorMask',
        desc: '이미지 주요색을 탐지하여 마스크 객체 애니메이션을 생성, primaryColor 플러그인 사용, 샘플 페이지는 트래픽 환경에 따라 느릴 수 있음',
        version: '1.0'
    };

    var _defaults = {
        delay:  [0, 800],
        maskBgColor: '#fff'
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    // using _colormask.less

    // <div class="js-color-mask js-inview pic" data-offset="[0, 0]" data-offset="[0, 0]">
    //     <a href="A1.mediacontent.channels.html">
    //            <img class="js-color-mask-el" src="../img/temp/@main_01.png" alt="{{ 대체 텍스트 }}" /></a>
    //      </a>
    // </div>

    $.fn.colorMask = function(_options, _todo){

        _options = (typeof _options === 'object') ? _options : {};

        if (_todo === false) return false;

        var _opts = $.extend(_defaults, _options);

        var _html = [
            '<div class="color-mask nth-child-1"></div>',
            '<div class="color-mask nth-child-2"></div>'
        ];

        var random = function(min, max) { // return random with scope
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var initDelay = function(_obj, _delayStart){ // init delay

            var _start = random(_delayStart[0], _delayStart[1]);

            var _setDelay = function(_el, _ms){
                if (_el === undefined) return false;
                _el.css({
                    'animationDelay': _ms + 'ms'
                });
            };
            _setDelay(_obj.$mask1, _start);
            _setDelay(_obj.$mask2, _start + 150);
            _setDelay(_obj.$img, _start + 400);
        };

        var setColor = function(_img, _target){
            try {
                _img.getColor(function(_el, _color){
                    _target.css('background-color', _color.primary);
                });
            } catch(e){
                _target.css('background-color', maskBgColor);
            }
        };

        this.each(function(i){

            var base = {};

            base.$el = $(this);

            if (!base.$el.length) return false;

            base.$img = base.$el.find('img').eq(0);

            var build = function(){
                if (base.$el.hasClass('is-color-mask-build')) return false;
                base.$el.addClass('is-color-mask-build');
                base.$el.css({
                    position: 'relative',
                    overflow: 'hidden'
                });
                base.$mask1 = $(_html[0]);
                base.$mask2 = $(_html[1]);
                base.$mask1.appendTo(base.$el);
                base.$mask2.appendTo(base.$el);
            };

            var _start = base.$el.data('delay') || _opts.delay;

            build(); // build
            initDelay(base, _start); // init delay
            setColor(base.$img, base.$mask2); // set color

            i++;

            return this;

        });

    };

})(window.jQuery);

$(function(){

    // $(window).on('load.colorMask ajaxloaded.colorMask', function(){
    //     //////// $('.js-color-mask').addClass('in is-inview');
    //     // $('.js-color-mask').colorMask();
    //
    //     // $('.js-color-mask-new').colorMask();
    // });



});

/**
* 필수 탑재
@prepros-prepend './module/_inView.js'
@prepros-prepend './module/_parallax.js'
// !prepros-prepend './module/_smoothScroll.js'
// !prepros-prepend './module/_distortion.js'

// !prepros-prepend './module/_pointer.js', 보강 필요
// !prepros-prepend './module/_paroller.js'
*/

/**
* 기본 탑재
// !prepros-prepend './module/_getColor.js'
// !prepros-prepend './module/_tilt.js'
// !prepros-prepend './module/_underline.js'
@prepros-prepend './module/_textMotion.func.js'
@prepros-prepend './module/_textMotion.js'
*/

/**
* 선별 탑재
@prepros-prepend './module/_colorMask.js'
// @!prepros-prepend './module/_imgPlaceHoldr.js'
// @!prepros-prepend './module/_blockReveal.js'
// @!prepros-prepend './module/_glassy.js'
// @!prepros-prepend './module/_numberSpinnr.js'
// @!prepros-prepend './module/_spidr.js'
// @!prepros-prepend './module/_cheez.js'
// @!prepros-prepend './module/_datepickr.js'
*/

$(function() {

    // var isBaseModule = function(_moduleName) { // 모듈이 호출되었는지 판단
    //     var _result = false,
    //         _module = window.plugins;
    //     if (_module !== undefined) {
    //         var _length = _module.length;
    //         for (var i = 0; i < _length; i++) {
    //             if (_module[i].name == _moduleName) {
    //                 _result = true;
    //             }
    //         }
    //     }
    //     return _result;
    // };
    //
    // console.info('init module', window.plugins);

    // if (isBaseModule('datepickr')) {
    //
    // }

});

