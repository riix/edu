(function($){

    'use strict';

    var MODULE = {
        name: 'imgPlaceHoldr',
        title: 'imgPlaceHoldr',
        desc: '구축 편의를 위한 이미지 생성툴, 옵션을 통해 이미지/배경 구분, onComplete 함수 제공',
        version: '1.0'
    };

    var _defaults = {
        method: 'src',
        onComplete: function(_el, i){
            // console.log('imgPlaceHolder', i);
        }
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    $.fn.imgPlaceHoldr = function(_options){
        var _opts = $.extend({}, _defaults, _options);
        var _length = this.length;
        var callFunc = $.callFunc || function(_func, _obj, _param) { // callback 함수 호출하기
            _func = (typeof _func == 'string') ? window[_func] : _func;
            _param = (_param === null) ? '' : _param;
            if (_func && typeof _func == 'function') {
                _func.call(null, _obj, _param);
            } else {
                console.log('no exist function');
            }
        };
        var onImagesLoaded = $.onImagesLoaded || function(_el, _func, _args) { // on images loaded
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
        };
        this.each(function(i, _length){
            var $this = $(this),
                _w = Math.max($this.width(), 160),
                _h = Math.max($this.height(), 160),
                _src = 'https://picsum.photos/' + _w + '/' + _h + '?random&image=' + i;
            $this.attr('data-image', _src).addClass('init-img-placeholdr');
            if (_opts.method == 'background') {
                _src = 'url(' + _src + ')';
                $this.css('background-image', _src);
            } else {
                $this.attr('src', _src);
            }
            callFunc(_opts.onComplete, $this, i);
        });
    };
})(window.jQuery);

$(function(){
    $('.js-img-placeholdr').imgPlaceHoldr();
    $('.js-img-placeholdr-bg').imgPlaceHoldr({
        method: 'background'
    });
});
