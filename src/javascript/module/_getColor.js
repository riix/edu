(function($){
    /**
    * color 정보 수집
    * primary: "rgb(0, 125, 143)"
    * complement: "rgb(0, 192, 219)"
    * lighten: "rgb(255, 130, 112)"
    * darken: "rgb(15, 225, 255)"
    * isDark: true
    *
    * var $el = $('#skrollrVisual .pic');
    * $el.getColor($el, function(_colors){
    *     console.log('primary:' + _colors.primary);
    *     console.log('complement:' + _colors.complement);
    *     console.log('lighten:' + _colors.lighten);
    *     console.log('darken:' + _colors.darken);
    *     console.log('isDark:' + _colors.isDark);
    * });
    *
    * var $el = $('#masonry .module');
    *
    */
    $.fn.getColor = function(_callback, _options){

        var _defaults = {
            background: false,
            lighten: {
                lighten: 15,
                saturate: 20,
                alpha: 1
            },
            darken: {
                darken: 15,
                saturate: 20,
                alpha: 1
            }
        };

        var _opts = $.extend({}, _defaults, _options);

        this.each(function(){

            var _el = $(this);
            var $img = _el;

            // jquery.primaryColor.js
            // tinycolor.js
            if (!_el.length || typeof $.fn.primaryColor !== 'function' || typeof tinycolor !== 'function') return false;

            var _colors = {};

            var _callFunc = $.callFunc || function(_func, _obj, _param) { // callback 함수 호출하기
                _func = (typeof _func == 'string') ? window[_func] : _func;
                _param = (_param === null) ? '' : _param;
                if (_func && typeof _func == 'function') {
                    _func.call(null, _obj, _param);
                } else {
                    console.log('no exist function');
                }
            };

            var _core = function(_rgbColor){

                // 정수화 하기 위해 분해
                var i = 0,
                    _rgb = _rgbColor.split(',');
                while (i > 3) {
                    _rgb[i] = _rgb[i] * 1;
                    i++;
                }

                var _getComple = function() {
                    var _result = 'rgb(' + (255 - _rgb[0]) + ', ' + (255 - _rgb[1]) + ', ' + (255 - _rgb[2]) + ')';
                    return _result;
                };

                // tinycolor.js
                _colors.objPrimary = tinycolor('rgb(' + _rgb[0] + ',' + _rgb[1] + ',' + _rgb[2] + ')').setAlpha(1);
                _colors.isDark = _colors.objPrimary.isDark();
                _colors.primary = _colors.objPrimary.setAlpha(1).toRgbString();
                _colors.lighten = _colors.objPrimary.saturate(_opts.lighten.saturate).lighten(_opts.lighten.lighten).setAlpha(_opts.lighten.alpha).toRgbString();
                _colors.darken = _colors.objPrimary.saturate(_opts.darken.saturate).darken(_opts.darken.darken).setAlpha(_opts.darken.alpha).toRgbString();
                _colors.comple = _getComple();

                _callFunc(_callback, _el, _colors); // callback

                return _colors;

            };

            var _setTempImg = function(_target){
                var _bg = _target.css('background-image');
                _bg = _bg.replace('url("','');
                _bg = _bg.replace("url('","");
                _bg = _bg.replace('")','');
                _bg = _bg.replace("')","");
                var $el = $('<img src="' + _bg + '" />');
                return $el;
            };

            _opts.background = (_el.attr('src').indexOf('spacer') > -1) ? true : _opts.background;

            $img = (_opts.background === true) ? _setTempImg(_el) : $img;

            $img.primaryColor(function(_rgbColor){
                _core(_rgbColor);
            });

        });

    };

})(window.jQuery);
