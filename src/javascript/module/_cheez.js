(function($) {

    'use strict';

    var MODULE = {
        name: 'cheez',
        title: 'cheez',
        desc: 'svg 객체 생성으로 container에 사선 표현',
        version: '1.0'
    };

    var _defaults = { // options
        height: 100,
        zindex: 1, // or null
        item: {
            method: 'prepend',
            opacity: 1,
            left: null,
            right: null,
            fill: null
        },
        onComplete: function(){
            // console.log('init cheeze');
        }
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.fn.cheez = function(_items, _options){

        this.each(function(){

            if (_items === undefined) return false;

            var base = { // base
                $el: $(this)
            };

            var _prepends = [], // prepend group 객체
                _appends = []; // append group 객체


            var _opts = $.extend({}, _defaults, _options); // settings

            var _supportSVG = true, // support svg
                _itemIdx = 0, // item index
                _itemLength = _items.length, // item length
                _zindex = _opts.zindex; // zindex

            // support svg
            // _supportSVG = (typeof Modernizr == 'object' && (Modernizr.svg === false || Modernizr.svg === undefined)) ? false : true;

            var _css = [{ // css
                'position': 'relative'
            },{
                'position': 'absolute',
                'left': 0,
                'right': 0
            },{
                'position':'relative',
                'height': '100px'
            },{
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'right': 0,
                'bottom': 0
            }];

            var i = 0;

            while(i < _itemLength){
                var $this = _items[i];
                if ($this.method == 'prepend'){
                    _prepends.push($this);
                } else {
                    _appends.push($this);
                }
                i++;
            }

            var _extend = function(a, b) { // Helper vars and functions.
        		for ( var key in b ) {
        			if( b.hasOwnProperty( key ) ) {
        				a[key] = b[key];
        			}
        		}
        		return a;
        	};

            /** From https://davidwalsh.name/javascript-debounce-function.
            * var myEfficientFn = debounce(function() {
            *   // All the taxing stuff you do
            * }, 250);
            * window.addEventListener('resize', myEfficientFn);
            */
        	var _debounce = function(func, wait, immediate) {
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

            var _callFunc = function(_func, _bool, _param) { // callback
                if (_bool !== undefined && _bool === false) return false;
                _func = (typeof _func == 'string') ? window[_func] : _func;
                _param = (_param === null) ? '' : _param;
                if (_func && typeof _func == 'function') {
                    _func.call(null, base, _param);
                } else {
                    console.log('no exist function');
                }
            };

            var _getWrapHtml = function(_html){
                var _result = '<div class="cheez-container ' + 'is-support-svg-' + _supportSVG + '">';
                if (_supportSVG === true) {
                    _result += '<div class="cheez-wrap">';
                    _result += '<div class="cheez-inner" style="height: 10vh;">';
                    _result += '<svg xmlns="http://www.w3.org/2000/svg" class="cheez-svg"';
                    _result += 'width="100%"';
                    _result += 'height="100%"';
                    _result += 'viewBox="0 0 100 100"';
                    _result += 'preserveAspectRatio="none">';
                    _result += _html;
                    _result += '</svg></div></div>';
                }
                _result += '</div>';
                return _result;
            };

            var _style = function(_el) { // style
                if (_supportSVG === true) {
                    _css[2].height = _opts.height;
                    if (_zindex !== null){
                        _css[1].zIndex = _zindex;
                        _css[3].zIndex = _zindex + 1;
                    }
                    _el.css(_css[0])
                    .children().css(_css[1])
                    .children().css(_css[2])
                    .children().css(_css[3]);
                } else {
                    _el.css({
                        'height': _opts.height
                    });
                }
            };

            var _getPoints = function(method, left, right){ // polygon points 구하기
                var _result = '';
                if (method =='prepend') { // uppper
                    if (left !== null) {
                        _result = '0,' + (100 - left) +' 100,100 0,100'; // 왼쪽 상단이 올라간 형태
                    }
                    if (right !== null) {
                        _result = '100,' + (100 - right) +' 100,100 0,100'; // 오른쪽 상단이 올라간 형태
                    }
                } else { // downer
                    if (left !== null) {
                        _result = '0,0 100,0 0,' + left; // 왼쪽 하단이 내려간 형태
                    }
                    if (right !== null) {
                        _result = '0,0 100,0 100,'+ right; // 오른쪽 하단이 내려간 형태
                    }
                }
                return _result;
            };

            var build = function(items, _method){

                var $wrap = null,
                    _polyHtml = '';

                $.each(items, function(i){

                    if (_supportSVG !== true) return false;

                    var _this = items[i],
                        _points,  // polygon points
                        _fill;

                    _itemIdx += 1; // item index

                    _this = $.extend({}, _opts.item, _this);

                    _points = _getPoints(_method, _this.left, _this.right); // polygon points 구하기
                    _fill = base.$el.css('backgroundColor');
                    _fill = (_fill == 'transparent' || _fill == 'rgba(0, 0, 0, 0)') ? '#fff' : _fill;
                    _fill = (_this.fill !== null) ? _this.fill : _fill;

                    _polyHtml += '<polygon class="cheez-polygon cheez-polygon-' + _itemIdx +'" points="'+ _points +'" style="'; // polygon html 구하기
                    _polyHtml += 'fill: '+ _fill +';';
                    _polyHtml += 'opacity: '+ _this.opacity +';';
                    _polyHtml += '" />';

                    if (_itemIdx >= _itemLength) { // callback
                        base.$el.toggleClass('is-cheez-complete', true);
                        _callFunc(_opts.onComplete);
                    }

                });

                $wrap = $(_getWrapHtml(_polyHtml)); // get wrapper
                $wrap.toggleClass('is-cheez-' + _method, true); // add classname

                if (_method =='prepend') { // uppper
                    _css[1].bottom = 0;
                    _style($wrap);
                    $wrap.prependTo(base.$el);
                } else { // downer
                    _css[1].top = 0;
                    _style($wrap);
                    $wrap.appendTo(base.$el);
                }

            };

            var init = function(){
                if (_prepends.length) {
                    build(_prepends, 'prepend');
                }
                if (_appends.length) {
                    build(_appends, 'append');
                }
            };

            init();

        });

    };

})(window.jQuery);

$(function(){

    var _cheezDefaults = [{
        method: 'prepend', // 왼쪽 상단이 올라간 형태
        opacity: 1,
        left: 80
    }, {
        method: 'prepend', // 오른쪽 상단이 올라간 형태
        opacity: 0.5,
        right: 80
    }, {
        method: 'append', // 왼쪽 하단이 내려온 형태
        opacity: 0.5,
        left: 80
    }, {
        method: 'append', // 오른쪽 하단이 내려온 형태
        opacity: 1,
        right: 80
    }];

    $('.js-cheez').cheez(_cheezDefaults, {
        height: 80
    });

});
