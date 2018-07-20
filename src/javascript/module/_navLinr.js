(function($){

    'use strict';

    var MODULE = {
        name: 'navLinr',
        title: '활성 네비게이션 표시',
        desc: '네비게이션 활성 표시를 추적하여 선을 그림',
        version: '1.0'
    };

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.navLinr = function(){ // gnb 상단 줄 긋기

        var $nav = $('#header .nav'),
            $links = $nav.find('li'),
            $active = $nav.is('.in'),
            $el = $('<div id="navLinr"><span></span><span></span></div>'),
            $span = $el.children(),
            $this = null,
            _isHover = false,
            _timer = null,
            _delay = 500;

        var _css = {
            ready: {
                'position': 'fixed',
                'z-index': '1',
                'left': '0',
                'top': '0',
                'height': '7px',
                'opacity': '0',
                'margin-top': '-2px',
                'background-color': '#b7272f',
                'transition': 'opacity .3s'
            },
            complete: {
                'opacity': '1',
                'transition': 'all .3s'
            }
        };

        var _moveTo = function(_target){
            $el.toggleClass('done', false);
            var _top = $nav.height();
            var _opacity = function(_bool){
                if (_bool === true){
                    $span.css('opacity', 1);
                } else {
                    $span.css('opacity', 0);
                }
            };
            if (!_target.length) {
                $el.toggleClass('in', false);
                _opacity(false);
            } else {
                $el.toggleClass('in', true);
                _opacity(true);
                var _target = _target.find('span'),
                    _left = _target.offset().left,
                    _width = _target.width();
                $span.stop().css({
                    width: _width,
                    left: 0,
                    top: _top,
                    transform: 'translate3d('+ _left + 'px, 0 ,0)'
                });
            }
        };

        $links.hover(function(){
            _isHover = true;
            $this = $(this);
            _moveTo($this);
        }, function(){
            _isHover = false;
        });

        var _repeat = function(){
            clearTimeout(_timer);
            _delay = 1000;
            _timer = setTimeout(function(){
                if (_isHover !== true) {
                    $this = null;
                    _moveTo($active);
                }
                _repeat();
            }, _delay);
        };

        _repeat();

        $window.on('load.navLinr resize.navLinr navlinr', function(){
            $active = $nav.find('.in');
            _moveTo($active);
        });

        var build = function(){
            $span.css(_css.ready);
            $body.prepend($el);
        };

        var after = function(){
            $span.css(_css.complete);
        };

        build();

        setTimeout(function(){
            after();
        }, 500);

    };

})(window.jQuery);

$(function(){
    $.navLinr();
});
