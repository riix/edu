(function($) {

    var MODULE = {
        name: 'spidr',
        title: '마우스 반응 벡터 그래픽',
        desc: '마우스 위치에 반응하는 Anime 플러그인',
        version: '1.0'
    };

    var _defaults = {
        pointLength: 15 // 포인트 개수
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.fn.spidr = function(_options){
        this.each(function(){

            var baseEl = $(this);

            var _opts = $.extend({}, _defaults, _options);

            var width,
                height,
                baseEl,
                canvas,
                ctx,
                points,
                target;

            var _rgb = '255, 255, 255';
            var _isPlay = true;

            // Util
            function getDistance(p1, p2) { // 거리를 체크함
                return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
            };

            function _build() {

                width = window.innerWidth;
                height = window.innerHeight;
                target = {
                    x: width / 2,
                    y: height / 2
                };

                baseEl.css('height', height + 'px');

                canvas = baseEl.find('canvas').eq(0)[0];
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');

                var Circle = function(pos, rad, color) {
                    var _this = this;

                    // constructor
                    (function() {
                        _this.pos = pos || null;
                        _this.radius = rad || null;
                        _this.color = color || null;
                    })();

                    this.draw = function() {
                        if (!_this.active)
                            return;
                        ctx.beginPath();
                        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(' + _rgb + ',' + _this.active + ')';
                        ctx.fill();
                    };
                }

                // create points
                points = [];
                for (var x = 0; x < width; x = x + width / _opts.pointLength) {
                    for (var y = 0; y < height; y = y + height / _opts.pointLength) {
                        var px = x + Math.random() * width / _opts.pointLength;
                        var py = y + Math.random() * height / _opts.pointLength;
                        var p = {
                            x: px,
                            originX: px,
                            y: py,
                            originY: py
                        };
                        points.push(p);
                    }
                }

                // for each point find the 5 closest points
                for (var i = 0; i < points.length; i++) {
                    var closest = [];
                    var p1 = points[i];
                    for (var j = 0; j < points.length; j++) {
                        var p2 = points[j]
                        if (!(p1 == p2)) {
                            var placed = false;
                            for (var k = 0; k < 5; k++) {
                                if (!placed) {
                                    if (closest[k] == undefined) {
                                        closest[k] = p2;
                                        placed = true;
                                    }
                                }
                            }

                            for (var k = 0; k < 5; k++) {
                                if (!placed) {
                                    if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                        closest[k] = p2;
                                        placed = true;
                                    }
                                }
                            }
                        }
                    }
                    p1.closest = closest;
                }

                // assign a circle to each point
                for (var i in points) {
                    var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(' + _rgb + ',0.3)');
                    points[i].circle = c;
                }
            }

            // Event handling
            function _handler() {
                if (!('ontouchstart' in window)) {
                    window.addEventListener('mousemove', mouseMove);
                }
                window.addEventListener('resize', resize);
            }

            function mouseMove(e) {
                var posx = posy = 0;
                if (e.pageX || e.pageY) {
                    posx = e.pageX;
                    posy = e.pageY;
                } else if (e.clientX || e.clientY) {
                    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                target.x = posx;
                target.y = posy;
            }

            _isPlay = true;

            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                baseEl.css('height', height + 'px');
                canvas.width = width;
                canvas.height = height;
            };

            function animate() {
                if (_isPlay === true) {
                    ctx.clearRect(0, 0, width, height);
                    for (var i in points) {
                        // detect points in range
                        if (Math.abs(getDistance(target, points[i])) < 4000) {
                            points[i].active = 0.3;
                            points[i].circle.active = 0.6;
                        } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                            points[i].active = 0.1;
                            points[i].circle.active = 0.3;
                        } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                            points[i].active = 0.02;
                            points[i].circle.active = 0.1;
                        } else {
                            points[i].active = 0;
                            points[i].circle.active = 0;
                        }

                        drawLines(points[i]);
                        points[i].circle.draw();
                    }
                }
                requestAnimationFrame(animate);
            }

            var _anime;

            function shiftPoint(p) {

                var i = 1 + 1 * Math.random();
                var x = parseInt(p.originX - 50 + Math.random() * 100, 10);
                var y = parseInt(p.originY - 50 + Math.random() * 100, 10);

                if (p === undefined) return false;

                _anime = anime({
                    targets: p,
                    x: x,
                    y: y,
                    easing: 'easeInOutSine'
                });

                _anime.complete = function(){
                    shiftPoint(p);
                }
            }

            // Canvas manipulation
            function drawLines(p) {
                if (!p.active)
                    return;
                for (var i in p.closest) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.closest[i].x, p.closest[i].y);
                    ctx.strokeStyle = 'rgba(' + _rgb + ',' + p.active + ')';
                    ctx.stroke();
                }
            }

            // animation
            function _animation() {
                animate();
                for (var i in points) {
                    shiftPoint(points[i]);
                }
            }

            // Main
            _build();
            _animation();
            _handler();

        });
    };

})(window.jQuery);
