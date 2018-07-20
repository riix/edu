// ------------------------------------------
// Pointer.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function(root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) { // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) { // require('jQuery') returns a factory that requires window to build a jQuery instance, we normalize how we use modules that require this pattern but the window provided is a noop if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else { // Browser globals
        root.Pointer = factory(jQuery);
    }
})(this, function($) {

    var Pointer = function(el, options) {

        var base = Object.create(Pointer.prototype);

        var $circle = $('<div class="circle"></div>');

        $circle.css({
            'position': 'absolute',
            'z-index': '1',
            'width': '100px',
            'height': '100px',
            'top': '50%',
            'left': '50%',
            'margin': '-50px 0 0 -50px',
            'background-color': 'rgba(0, 0, 0, .5)',
            'border-radius': '80%',
            'backface-visibility': 'hidden'
        });

        $circle.appendTo($('body'));

        function moveCircle(e) {
        	TweenLite.to($circle, 0.2, {
            css: {
              left: e.pageX,
              top: e.pageY
            }
          });
        }

        var _isOver = false;
        var _isLink = false;
        var $el = null;

        var _toggle = function(){
            if (_isOver === true) {
                $circle.css({
                    'background-color': 'rgba(255, 255, 255, .5)'
                });
            } else {
                $el = null;
                $circle.css({
                    'background-color': 'rgba(0, 0, 0, .5)'
                });
            }
        };

        $(document).on('mouseenter', 'a', function(e){
            var $el = $(e.target);
            _isOver = true;
            _toggle();
        });

        $(document).on('mouseleave', 'a', function(e){
            _isOver = false;
            _toggle();
        });

        $(window).on('mousemove', moveCircle);

        var $anchors = $('a, span');
        var _offsets = [];
        $anchors.each(function(i){
            var $this = $(this);
            var _offset = $this.offset();
            var  _left = _offset.left.toFixed(2) * 1;
            var _top = _offset.top;
            var _width = $this.width();
            var _height = $this.height();
            _offsets[i] = {
                x:  _left,
                x2: _left + _width,
                y: _top,
                y2: _top + _height
            };
        });

        console.log(_offsets);

        $circle.on('click', function(e){
            e.preventDefault();
            $.each(_offsets, function(i){
                var _this = this;
                if (e.pageX > _this.x && e.pageX < _this.x2) {
                    if (e.pageY > _this.y && e.pageY < _this.y2) {
                        $anchors.eq(i).trigger('click');
                    }
                }
            });
        });

        return base;
    };

    return Pointer;

});

$(function(){
    var pointer = new Pointer();
});
