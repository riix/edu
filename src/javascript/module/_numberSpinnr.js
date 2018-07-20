(function($) {

    'use strict';

    var MODULE = {
        name: 'numberSpinnr',
        title: '숫자 카운트 스피너',
        desc: '원하는 숫자만큼 증가하는 카운트 동작, tweenMax 필요',
        version: '1.0'
    };

    var _defaults = {
        easing: Power3.easeOut
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    /**
    * 숫자 카운팅 스피너
    */

    $.fn.numberSpinnr = function(_options){

        var _opts = $.extend({}, _defaults, _options);

        var _getData = function(_el, _attr, _default){ // custom data 구하기
            var _data = _el.attr('data-' + _attr);
            return (_data !== undefined) ? _data : _default;
        };

        return this.each(function(){

            var $this = $(this);

            var _timeline = new TimelineLite();

            var _on = function(_el){
                var _sandbox = {
                    current: 0
                };
                var _from = _getData(_el, 'spin-from', '0'),
                    _to = _getData(_el, 'spin-to', '100'),
                    _duration = _getData(_el, 'spin-duration', '0.5');
                var updateHandler = function(){
                    _el.text(_sandbox.current);
                };
                _sandbox.current = _from;
                _timeline = TweenLite.to(_sandbox, _duration, {
                    current: "+=" + _to,
                    roundProps: "current",
                    onUpdate: updateHandler,
                    ease: _opts.easing
                });
            };

            var _off = function(_el){
                if (typeof _timeline == 'object') {
                    _timeline.kill();
                }
                var _from = _getData(_el, 'spin-from', '0');
                _el.text(_from);
            }

            var _setHandler = function(_el){
                _el.on('in', function(){
                    _on(_el);
                });
                _el.on('out', function(){
                    _off(_el);
                });
            };
            _off($this); // reset
            _setHandler($this);
        });
    };

})(window.jQuery);

$(function(){

    var $spinner = $('.js-number-spinnr');

    if (!$spinner.length) return false;

    $spinner.numberSpinnr();

    setTimeout(function(){
        $spinner.filter('[data-spin-autoplay="true"]').trigger('in'); // trigger
    }, 100);

});
