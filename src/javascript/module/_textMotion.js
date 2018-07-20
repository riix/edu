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
