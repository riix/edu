(function($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    window.$window = $window; // set global vars.
    window.$document = $document;
    window.$html = $html;
    window.$body = $body;

    var _is = { // detect object
        lteIE10: !!window.ActiveXObject, // IE, lte 10
        gteIE10: (!!window.navigator.msPointerEnabled), // IE, gte 10
        cssanimations: !$html.hasClass('no-cssanimations')
    };

    $.str = {
        TRANSITIONEND_NAMES: 'webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend transitionEnd',
        ANIMATIONEND_NAMES: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd'
    };

    $.extend({
        isMobile: function(){ // 모바일인지 판단
            var check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        getUriParam: function() { // uri 파라미터 구하기
            var _result = {},
                parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                    _result[key] = value;
                });
            return _result;
        },
        getAnchor: function(_el, _tagName) { // 클릭객체 구하기
            _tagName = (_tagName !== undefined) ? _tagName : 'a';
            var _return = (_el[0].tagName !== undefined && _el[0].tagName.toLowerCase() !== _tagName) ? _el.closest(_tagName) : _el;
            return _return;
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
            var _getPercent = function(_int, _percent){ // 퍼센트 처리, _getPercent(100, 0.5);
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
        },
        getMousePos: function getMousePos(e) {
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
    		return { x: _posX, y: _posY };
    	},
        getJsonHtml: function(_obj, _options) { // get json element
           var i = 0,
                _length = _obj.length,
                _html = '';
            var _defaults = {
                format: function(_item, _idx, _total) {
                    var _return = '';
                    _return += '<li class="item ' + 'nth-child-' + (_idx + 1) + '"><div class="module"><img src="' + _item.url + '" alt="' + _item.alt + '" class="pic" /></div></li>';
                    return _return;
                }
            };
            var opts = $.extend({}, _defaults, _options);
            while (i < _length) {
                _html += opts.format.call(null, _obj[i], i);
                i++;
            }
            return _html;
        },
        getJsonFromCustomData: function(_string) { // 커스텀 데이터로 부터 json 추출하기
            if (typeof _string != 'string') return _string;
            if (_string.indexOf(':') != -1 && _string.trim().substr(-1) != '}') {
                _string = '{' + _string + '}';
            }
            var _start = (_string ? _string.indexOf("{") : -1),
                options = {};
            var str2json = function(str, notevil) {
                try {
                    if (notevil) {
                        return JSON.parse(str.replace(/([\$\w]+)\s*:/g, function(_, $1) {
                            return '"' + $1 + '":';
                        }).replace(/'([^']+)'/g, function(_, $1) {
                            return '"' + $1 + '"';
                        }));
                    } else {
                        return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
                    }
                } catch (e) {
                    return false;
                }
            };
            if (_start != -1) {
                try {
                    options = str2json(_string.substr(_start));
                } catch (e) {}
            }
            return options;
        },
        getCustomDataByDefaults: function(_el, _defaultsArr) { // 기본값 기준으로 커스텀 데이터 불러와 배열 생성
            var _result = {};
            var returnBool = function(_str){
                if (_str == 'true') _str = true;
                if (_str == 'false') _str = false;
                return _str;
            };
            for (var key in _defaultsArr) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(),
                    _data = _el.attr('data-' + _key);
                _result[key] = _defaultsArr[key];
                if (_data !== undefined) {
                    _result[key] = returnBool(_data);
                }
            }
            return _result;
        },
        setCustomDataByDefaults: function(_el, _options) { // 기본값 기준으로 커스텀 데이커 저장
            if (typeof _options !== 'object') return false;
            var _result = _options;
            $.each(_result, function(key, val) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase();
                if (_el.attr('data-' + _key) === undefined) {
                    _el.attr('data-' + _key, _result[key]);
                }
            });
        },
        getExtendOpts: function(_defaults, _options, _el){
            // 기본값, 옵션값, 객체 커스텀 데이터 값을 기분으로 opts 배열을 반환 (우선순위 역순)
            // _opts = getExtendOpts(_defaults, _options, $this);
            var _result = $.extend({}, _defaults, _options); // 1차 병합
            var returnBool = function(_str){
                if (_str == 'true') _str = true;
                if (_str == 'false') _str = false;
                return _str;
            };
            for (var key in _defaults) {
                var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(),
                    _data = _el.attr('data-' + _key);
                _result[key] = _defaults[key];
                if (_data !== undefined) {
                    _result[key] = returnBool(_data); // 2차 병합
                }
            }
            return _result;
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
        },
        getIdxProof: function(_idx, _max) { // 인덱스값 범위 내 반환
            _idx = (_idx < 0) ? _max : _idx;
            _idx = (_idx > _max) ? 0 : _idx;
            return _idx;
        },
        onImagesLoaded: function(_el, _func, _args) { // on images loaded
            var _items = _el.filter('img'),
                _len = _items.length,
                _totalLen = 0,
                _timer = null,
                _blankImageSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            _items.one('load.imgloaded', function() {
                _totalLen = --_len;
                if (_totalLen <= 0 && this.src !== _blankImageSrc) {
                    _items.off('load.imgloaded');
                    if (typeof _func == 'function') {
                        _timer = setTimeout(function() {
                            _func.call(null, _args);
                        }, 1);
                    }
                }
            });
            _items.each(function() {
                if (this.complete || this.complete === undefined) {
                    var _src = this.src; // + '?time = ' + new Date().getTime();
                    this.src = _blankImageSrc;
                    this.src = _src;
                }
            });
            return this;
        }
    });

    $.throttle = (function() {
        var _timerThrottle;
        return function(_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

    $.debounce = function(_func, _wait, _immediate) { // debounce 함수
        // From https://davidwalsh.name/javascript-debounce-function.
        // var myEfficientFn = debounce(function() {
        // }, 250);
        // window.addEventListener('resize', myEfficientFn);
        var _timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                _timeout = null;
                if (!_immediate) _func.apply(context, args);
            };
            var _callNow = _immediate && !_timeout;
            clearTimeout(_timeout);
            _timeout = setTimeout(later, _wait);
            if (_callNow) _func.apply(context, args);
        };
    };

})(window.jQuery);
