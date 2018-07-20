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
