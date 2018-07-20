(function($){

    'use strict';

    "version: 0.1";

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.fn.scrollFlickr = function(_options) {

        var base = {
            $wrapper: $(this),
            $inner: null,
            $items: null,
            idx: 0 // index
        };

        var _defaults = {
            inner: '.flickr-inner',
            items: '.flickr-item',
            itemsHeight: [0, 0, 0, 0, 0, 0], // 아이템 길 경우 강제 옵션
            css: [{
                    height: '100%',
                    overflow: 'hidden'
                },{
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden'
                },{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    transform: 'translate3d(0, 0, 0)',
                    transition: 'transform 50ms ease 0s'
                },{
                    position: 'absolute',
                    width: '100%',
                    left: '0',
                    right: '0',
                    top: '0'
                }],
            onSlide: null,
            onResize: null
        };

        var _setting = {};

        var _itemsLength = null,
            _itemsTop = [],
            _itemsHeight = [];

        var _startX = 0,
            _endX = 0,
            _deltaX = 0;

        var _startY = 0,
            _endY = 0,
            _deltaY = 0;

        var _dir = 1, // 1: down, -1: up
            _prevIdx = -1, // previous index
            _indexedPos = 0, // index pos
            _draggedPos = 0, // dragged position
            _dragTo = 0, // move by drag
            _maxPos = 0, // gesture scope
            _scopeMove = 0, // gesture scope
            _windowInnerHeight = 0, // window height
            _timeNow = 0, // time now
            _timeLastAnim = 1500, // time previous animation
            _timer = null, // timer
            _timerAnimating = null, // timer
            _isAnimating = false, // is animating
            _isLonger = { // is longer item
                prev: false,
                current: false,
                next: false
            };

        var _console = function(_str){ // console
            var _timestamp = Math.floor(Date.now() / 100);
            $('#test').prepend($('<p> current:' + base.idx + '/'+_str + '?' + _timestamp +'</p>'));
        };

        var _callFunc = function(_callback, _delay, _param) {
            _callback = (typeof _callback == 'string') ? window[_callback] : _callback;
            if (typeof _callback == 'function') {
                _param = (_param === null) ? '' : _param;
                _delay = _delay || 50;
                setTimeout(function() {
                    _callback.call(null, base, _param);
                }, _delay);
            } else {
                return false;
            }
        };

        var _translateY = function(_to, _duration) { // css move transition
            _isAnimating = true;
            clearTimeout(_timerAnimating);
            base.$inner.css({
                'transition': 'transform ' + _duration + 'ms ease 0s',
                'transform': 'translate3d(0, '+ _to +'px, 0)'
            });
            _timerAnimating = setTimeout(function(){
                _isAnimating = false;
            }, _duration);
        };

        var _goto = function(_index, _bool) { // goto index
            var _getTo = function() {
                var _result;
                _index = (_index >= _itemsLength - 1) ? _itemsLength - 1 : _index;
                _index = (_index <= 0) ? 0 : _index;
                _result = 0 - _itemsTop[_index];
                return _result;
            };
            var _to = _getTo();
            _translateY(_to, 300);
            _draggedPos = _to;
            base.idx = _index; // setIdx
            _callFunc(_setting.onSlide, 300); // callback
        };

        var _touchmove = function(e) {

            var touches = e.originalEvent.touches;

            if (touches && touches.length) {

                var _bool = false;
                var _index = base.idx;

                var _detectLonger = function(){ // detect item is longer then screen size
                    var $el = base.$items.eq(base.idx);
                    _isLonger.current = ($el.length && $el.hasClass('is-longer')) ? true : false;
                };

                clearTimeout(_timer);

                _endX = touches[0].clientX; // 끝나는 지점 구하기
                _endY = touches[0].clientY; // 끝나는 지점 구하기
                _deltaX = _startX - _endX; // 델타 값 구하기
                _deltaY = _startY - _endY; // 델타 값 구하기

                _dir = (_deltaY < 0) ? -1 : 1; // up and down

                if (_dir < 0 && _isAnimating === true) return false;

                // 제스추어 드래그값 구하기
                _dragTo = _indexedPos - _deltaY; // 드래그 값 구하기
                _dragTo = (_dragTo > _scopeMove) ? _scopeMove : _dragTo; // 상단 pullback
                _dragTo = (_dragTo <= _maxPos) ? _maxPos : _dragTo; // 하단 pullback

                _detectLonger(); // detect longer








                var _boolLonger = (_isLonger.current === true && _prevIdx === base.idx && _dir > 0);

                // 셋팅에 따라 강제하기
                if (_setting.itemsHeight[base.idx] > 0 && _dir > 0) {
                    _boolLonger = true;
                } else {
                    _boolLonger = false;
                }















                if (_boolLonger === true) { // 내용이 길때
                    _index = base.idx + _dir; // set index
                    _draggedPos = _dragTo;
                    _translateY(_dragTo, 100);
                    var _line = 0 - (_itemsTop[_index] - _windowInnerHeight + _scopeMove); // 넘어가는 경계선
                    _timer = setTimeout(function(){
                        if (_draggedPos < _line) {
                            _goto(_index);
                        }
                    }, 400);
                } else { // 내용이 길지 않을때

                    if (_deltaX < _deltaY) {
                        _translateY(_dragTo, 0);
                    }


                    if (Math.abs(_deltaY) >= _scopeMove) { // over scope
                        base.$inner.off('touchmove', _touchmove);
                        _index = base.idx + _dir; // set index
                        _goto(_index);
                    } else {
                        _timer = setTimeout(function(){ // 해제
                            base.$inner.off('touchmove', _touchmove);
                            _translateY(_indexedPos, 300); // 원래 위치로
                        }, 400);
                    }

                }

            }
        };

        // var _color = '#'+Math.floor(Math.random()*16777215).toString(16);
        var _touchstart = function(e) {
            var touches = e.originalEvent.touches;
            if (_isAnimating === true) return false;
            if (touches && touches.length) {
                _timeNow = new Date().getTime(); // set time
                _prevIdx = base.idx; // set previous
                if (_timeNow - _timeLastAnim > 200){
                    _startX = touches[0].clientX; // 시작 지점 구하기
                    _startY = touches[0].clientY; // 시작 지점 구하기
                    if (_isLonger.current !== true) {
                        _indexedPos = 0 - _itemsTop[base.idx]; // 현재 포지션
                    } else {
                        _indexedPos = _draggedPos;
                    }
                    base.$inner.css('transition', 'transform 0ms ease 0s');
                    base.$inner.on('touchmove', _touchmove);
                    _timeLastAnim = _timeNow; // set last time
                }
            }
        };

        var _init = function(){

            _setting = $.extend({}, _defaults, _options); // set setting
            base.$inner = base.$wrapper.find(_setting.inner);
            base.$items = base.$inner.find(_setting.items);

            var _model = (function(){ // set model
                $('html, body').css(_setting.css[0]).toggleClass('is-flickr', true);
                base.$wrapper.css(_setting.css[1]).toggleClass('scrollflickr-wrapper', true);
                base.$inner.css(_setting.css[2]).toggleClass('scrollflickr-inner', true);
                base.$items.css(_setting.css[3]).toggleClass('scrollflickr-item', true);
            })();

            var _onResize = function(){ // on resize
                var i = 0,
                    _top = 0;
                _windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || $window.innerHeight();
                _itemsLength = base.$items.length;
                _scopeMove = parseInt($(window).height() / 7, 10);
                _itemsTop = [];
                _itemsHeight = [];
                _maxPos = 0;
                while (i < _itemsLength) {
                    var $this = base.$items.eq(i),
                        _height = _windowInnerHeight,
                        _childrenHeight = $this.children().height();
                    if (_childrenHeight > _height) {
                        _height = _childrenHeight;
                        $this.toggleClass('is-longer', true);
                    }
                    $this.css({
                        'top': _top,
                        'min-height': _height
                    }).attr('data-top', _top);
                    _itemsTop.push(_top);
                    _itemsHeight.push(_height);
                    _top = _top + _height;
                    i++;
                }
                base.$inner.height(_top);
                _maxPos = 0 - (_top - _windowInnerHeight);
                base.$wrapper.toggleClass('in-flickr', true);
                _callFunc(_setting.onResize, 300); // callback
            };
            $window.on('load resize', function(){
                _onResize();
            });
            base.$inner.on('touchstart', function(e){
                var $this = $(e.target),
                    _this = $this[0].tagName.toLowerCase(),
                    _parent = $this.parent()[0].tagName.toLowerCase();

                var _isFormEl = (_this === 'select' && _this === 'input') && (_parent === 'select' && _parent === 'input');
                var _preventDefault = false;
                var _skip = false;

                if (_isFormEl === true) {
                    _skip = true;
                }

                if ($this.parents('.pager').length) {
                    _skip = true;
                }

                if ($this.hasClass('skip-flickr') || $this.parents('.skip-flickr').length) {
                    _skip = true;
                }

                if (_preventDefault === true){
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (_skip === false) {
                    _touchstart(e);
                }

            });
        };

        return this.each(function(){
            _init();
        });

    };

})(jQuery, window, document, navigator.userAgent || navigator.vendor || window.opera);

$(function(){

    var $html = $('html');

    // $('#scrollFlickr').scrollFlickr({
    //     onSlide: function(base){
    //         var _idx = base.idx;
    //         var _bool = (_idx !== 0);
    //         $html.toggleClass('is-scrollDowned', _bool);
    //         $html.removeClass('is-flickr-slide-1 is-flickr-slide-2 is-flickr-slide-3 is-flickr-slide-4 is-flickr-slide-5 ');
    //         $html.toggleClass('is-flickr-slide-' + _idx, _bool);
    //     }
    // });

});
