$(function() {

    'use strict';

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    var _initDemo = function(){ // demo system
        var _module = module || window.plugins, // global var module
            _location = window.location.href;
        if (_module === undefined) return false;
        var $el = null,
            _length = _module.length,
            _html = {
                select: '<option>선택</option>',
                name: '',
                title: '',
                desc: '',
                options: ''
            },
            _css = {
                'position': 'fixed',
                'z-index': '1100',
                'top': '100px',
                'right': '20px'
            };
        var _core = function(){
            for (var key in _module) {
                var _this = _module[key],
                    _boolCurrent = (_location.indexOf(_this.name) > -1),
                    _selected = (_boolCurrent === true) ? 'selected' : '',
                    _options = _this.defaults; // options
                if (_this.name.indexOf('untitled') <= -1) {
                    _html.select += '<option value="_' + _this.name + '.html" ' + _selected + '>' + _this.name + '</option>';
                }
                if (_boolCurrent === true) {
                    _html.name = _this.name; // title
                    _html.title = _this.title; // title
                    _html.desc = _this.desc; // desc
                    _html.version = _this.version; // version
                    if (_options !== undefined) { // options
                        _html.options += '<dl>';
                        for (var key in _options) {
                            _html.options += '<dt>' + key + '</dt><dd>'+ _options[key] + '</dd>';
                        }
                        _html.options += '</dl>';
                    }
                }
            }
            _html.select = '<select>' + _html.select + '</select>';
            _html = '<div id="demoNavigation"><div class="inner">' + _html.select + '<p class="subject">' + _html.title + '</p><p class="version">ver. ' + _html.version + '</p><p class="desc">' + _html.desc + '</p><div class="options">' + _html.options + '</div></div></div>';
            $('#title').text(_html.name); // document title
            $el = $(_html).css(_css); // set element
        };
        _core();
        $body.prepend($el);
        $el.find('select').on('change', function(e) {
            var _val = $(e.target).val();
            if (_val.indexOf('html') > -1) {
                window.location.href = _val;
            }
        });
    };

    _initDemo(); // demo 실행

});
