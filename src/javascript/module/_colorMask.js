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
