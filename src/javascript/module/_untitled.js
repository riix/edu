(function($) {

    'use strict';

    var MODULE = {
        name: 'untitled',
        version: '1.0'
    };

    var _defaults = {

    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

})(window.jQuery);
