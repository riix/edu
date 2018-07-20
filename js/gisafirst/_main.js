$(function() {

    'use strict';

    var opts = { // 토글 설정
        method: 0, // 1:smoothstate, 2:pjax
        imagesLoaded: true, // 이미지 로드 후 동작
        smoothScroll: false, // false 면 동작하지 않음
        parallax: true, // false 면 동작하지 않음
    };

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body'),
        $container = $('#container');

    var settings = { // 기본 설정
        inView: {
            sceneMode: true, // isDark 등을 탐지 stickyTriggerMode
            scrollUp: {
                top: 0,
                bottom: 0
            },
            scrollDown: {
                top: 0,
                bottom: 0
            }
        },
        smoothScroll: {
            tweenMax: true
        },
        parallax: {
            speed: -2,
            center: true,
            round: true,
            vertical: true,
            horizontal: false
        },
        smoothState: {
            debug: true,
            prefetch: false,
            anchors: 'a',
            blacklist: '.no-ajax, a[href*=".jpg"], a[href*=".png"], a[href*=".jpeg"], a[href*=".pdf"]',
            scroll: true,
            cacheLength: 0,
        },
        pjax: {
            dataType: 'html',
            fragment: '#wrapper', // 위 주소를 받아와서 추출할 DOM
            container: '#wrapper', // 위에서 추출한 DOM 내용을 넣을 대상
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"
        }
    };

    var detectMobile = detectMobile || function() { // 모바일 체크
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    var throttle = (function() { // throttle
        var _timerThrottle;
        return function(_fn, _delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(_fn, _delay);
        };
    }());

    var debounce = debounce || function(func, wait, immediate) { // debonce
        var timeout;
        return function() {
            var context = this,
                args = arguments;
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

    function filterHasPrefix(_str, _prefix) { // 특정 문자열 prefix 제거후 반환
        _str = _str.split(' ').filter(function(item) {
            return item.lastIndexOf(_prefix, 0) !== 0;
        });
        _str = _str.join(' ').trim();
        return _str;
    };

    function removeClassHasPrefix(el, prefix) { // 특정 문자열 포함한 클래스명 제거
        el.className = filterHasPrefix(el.className, prefix);
    };

    var main = function() {

        var HTML = '<div class="md-overlay"></div><div class="md-indicator"><span></span><span></span><span></span><span></span></div>';

        var pathName = '', // 이동할 페이지 대표 이름
            flag = false; // 첫 로딩 후 변환

        var mySmoothState = null,
            myParallax = null,
            myInView = null,
            myScroll = null,
            myMap = null,
            myMarker = null;

        var sliderVisualA = null,
            sliderVisualB = null,
            sliderShops = null;

        var isMobile = window.isMobile || detectMobile(),
            browser = window.browser,
            oldie = (browser !== undefined && browser.indexOf('modern') < 0);

        var restartCSSAnim = function() {
            if (mySmoothState === null) return false;
            mySmoothState.restartCSSAnimations(); // Restart your animation
        };

        var getCleanPathName = function(_str) { // path 구하기
            var filterPathName = function(_str) { // 페이지 경로명 필터링
                if (_str.indexOf('/') > -1) { // 슬래쉬를 포함할 경우만
                    _str = _str.split('/');
                    _str = _str[_str.length - 2]; // 끝에서 2번째 반환
                }
                return _str;
            };
            var _result = (_str !== '') ? _str : $('#inner').attr('data-class').replace('page-', '') + '/';
            _result = filterPathName(_result);
            return _result;
        };

        var myUnderline = null;
        var myDisplace = [];

        var modules = {
            hoverSpin: function(_bool){
                var buildHoverSpin = function(_el){
                    var $items = (typeof _el == 'string') ? $(_el) : _el;
                    if (!$items.length || $items.hasClass('js-hover-spin')) return false;
                    for (var i = 0; i < $items.length; i++) {
                        var $this = $items.eq(i),
                            $span = $this.find('span'),
                            $clonePrev = $span.clone().addClass('prev'),
                            $cloneNext = $span.clone().addClass('next');
                        $this.addClass('js-hover-spin');
                        $span.addClass('default').after($cloneNext).after($clonePrev);
                    }
                };
                buildHoverSpin('#header li.d1');
            },
            underline: function(_bool) {
                if (_bool !== false) {
                    if (myUnderline !== null) { // refresh
                        myUnderline.refresh();
                    } else {
                        myUnderline = new Underline();
                    }
                } else {
                    if (myUnderline !== null) {
                        myUnderline.pause();
                    }
                }
            },
            slider: function(_bool, _case) {

                var $slider = $('#mainVisual');

                var initSlider = function($slider, _startDelay){
                    if (!$slider.length) return false;
                    var $items = $slider.find('.slider-item');
                    var itemLength = $items.length;
                    var idx = 0;
                    var $pagination = $slider.find('.pagination').children();
                    var $navigation = $slider.find('.navigation').children();
                    var timer = null;
                    var doSlide = function(_idx){
                        idx = _idx;
                        var $prev = $items.is('in');
                        $items.eq(_idx).toggleClass('in', true).siblings().removeClass('in');
                        $pagination.eq(_idx).toggleClass('in', true).siblings().removeClass('in');
                        autoPlay();
                    };
                    var autoPlay = function(){
                        clearTimeout(timer);
                        var _delay = (idx === 0 && _startDelay !== undefined) ? _startDelay : 6000;
                            timer = setTimeout(function(){
                            idx++;
                            if (idx > itemLength - 1){
                                idx = 0;
                            }
                            doSlide(idx);
                        }, _delay);
                    };
                    $pagination.on('click', function(e){
                        e.preventDefault();
                        var $this = $(e.target);
                        $this = ($this.is('a')) ? $this : $this.closest('a');
                        doSlide($this.index());
                    }).eq(0).trigger('click');
                    $navigation.on('click', function(e){
                        e.preventDefault();
                        var $this = $(e.target);
                        $this = ($this.is('a')) ? $this : $this.closest('a');
                        var _idx = idx;
                        if ($this.hasClass('prev')){
                            _idx--;
                        } else {
                            _idx++;
                        }
                        if (_idx > itemLength - 1){
                            _idx = 0;
                        } else if (_idx < 0){
                            _idx = itemLength - 1;
                        }
                        doSlide(_idx);
                    });
                    autoPlay();
                };

                initSlider($('#mainVisual'), 6000);
                initSlider($('#aboutSlider'));

                var partSlider = new Swiper('#partSlider', {
                    slidesPerView: 6,
                    spaceBetween: 0,
                    freeMode: true,
                    scrollbar: {
                      el: '.swiper-scrollbar',
                      // hide: true,
                    }
                    // speed: 1200,
                    // autoplay: false,
                    // initialSlide: 1,
                    // slidesPerView: 6,
                    // spaceBetween: 0,
                    // centeredSlides: true,
                    // loop: false
                });

                // var set = function() {
                //     var keyVisual = function(){
                //         var _el = document.getElementById('keyVisual');
                //         if (_el === null) return false;
                //         var $descs = $('#keyVisualDesc').children();
                //         sliderVisualA = new Swiper(_el, {
                //             allowTouchMove: true,
                //             autoplay: {
                //                 delay: 5000
                //             },
                //             speed: 1200,
                //             pagination: {
                //                 el: '.js-visual-a-paging',
                //                 type: 'bullets',
                //                 clickable: true
                //             },
                //             on: {
                //                 slideChange: function() {
                //                     var _prev = this.previousIndex,
                //                         _active = this.activeIndex;
                //                     var _dir = (_prev > _active) ? 'prev' : 'next';
                //                     if (_prev == _active) return false;
                //                     $descs.eq(_active).toggleClass(_dir, true).siblings().toggleClass('in prev next', false);
                //                     setTimeout(function() {
                //                         $descs.eq(_active).toggleClass('in', true);
                //                     }, 500);
                //                 }
                //             }
                //         });
                //         if ($('.js-visual-b').length) {
                //             sliderVisualB = new Swiper('.js-visual-b', {
                //                 allowTouchMove: true,
                //                 speed: 1200
                //             });
                //             sliderVisualA.controller.control = sliderVisualB;
                //             sliderVisualB.controller.control = sliderVisualA;
                //         }
                //     }
                //     var sliderShop = function(){
                //         var _el = document.getElementById('sliderShop');
                //         if (_el === null) return false;
                //         sliderShops = new Swiper(_el, {
                //             speed: 1200,
                //             autoplay: false,
                //             initialSlide: 1,
                //             slidesPerView: 3,
                //             spaceBetween: 0,
                //             centeredSlides: true,
                //             loop: false
                //         });
                //     };
                //     keyVisual();
                //
                //     if (oldie !== true) {
                //         sliderShop();
                //     }
                // };
                //
                // if (_bool === false) {
                //     if (typeof sliderVisualA == 'object' && sliderVisualA !== null) sliderVisualA.destroy();
                //     if (typeof sliderVisualB == 'object' && sliderVisualB !== null) sliderVisualB.destroy();
                //     if (typeof sliderShops == 'object' && sliderShops !== null) sliderShops.destroy();
                //     sliderVisualA = null;
                //     sliderVisualB = null;
                //     sliderShops = null;
                // } else {
                //     set();
                // }

            },
            inView: function(_bool) { // destroy 가 필요없음, refresh 로 대체
                if (_bool == false) return false; // destory 가 필요없음, refresh 로 대체
                if (myInView !== null) { // refresh
                    myInView.refresh();
                } else {
                    myInView = new InView('.container', settings.inView);
                }

                var $inview = $('.js-inview');
                $window.on('load scroll', function(){
                    $inview.each(function(){
                        var $this = $(this);
                        var _bool = $.isInview($this);
                        $this.toggleClass('is-inview', _bool);
                    });
                });

            },
            parallax: function(_bool) {
                if (_bool == false || opts.parallax !== true) return false; // destory 가 필요없음, refresh 로 대체
                if (myParallax !== null) {
                    myParallax.refresh();
                } else {
                    if (!document.getElementsByClassName('js-parallax-el').length) return false;
                    myParallax = new Rellax('.js-parallax-el', settings.parallax);
                    // $('.js-parallax-el').addClass('is-parallax-in is-parallax-after');
                    // $('.js-parallax-el').paroller({
                    //     factor: 0.2,            // multiplier for scrolling speed and offset, +- values for direction control
                    //     factorLg: 0.4,          // multiplier for scrolling speed and offset if window width is less than 1200px, +- values for direction control
                    //     type: 'foreground',     // background, foreground
                    //     direction: 'vertical' // vertical, horizontal
                    // });
                }
            },
            scroll: function(_bool) {
                if (_bool == false || opts.smoothScroll !== true) return false; // destory 가 필요없음, refresh 로 대체
                if (myScroll !== null) {
                    myScroll.refresh();
                } else {
                    if ($html.hasClass('windows')) { // 맥에서는 skip
                        myScroll = new SmoothScroll(settings.smoothScroll);
                    }
                }
            },
            mask: function(_bool) {
                // console.log('colorMask', _bool);
                $('.js-color-mask').colorMask({}, _bool);
            },
            displace: function(_bool) {
                myDisplace = [];
                var _initDisplace = function(){
                    if ($('html').hasClass('ie')) return false; // ie 는 skip
                    $('.js-displace').each(function(i){
                        var $this = $(this);
                        var _init = function(){
                            var $img = $this.find('img').eq(0),
                                _from = $img.attr('src') || $this.attr('data-displace-from') || '123',
                                _to = $this.attr('data-displace-to') || '../resources/img/custom/elstyle_01.jpg',
                                _texture =  $this.attr('data-displace-texture') || '../resources/img/module/displace.png';
                            myDisplace[i] = new hoverEffect({
                                el: $this,
                                imageFrom: _from,
                                imageTo: _to,
                                displaceImage: _texture
                            });
                        };
                        $this.imagesLoaded(_init);
                    });
                }
                if (_bool === true) {
                    _initDisplace();
                }
            },
            map: function(_bool, _idx) {
                var centers = [{
                        lat: 37.564698,
                        lng: 126.98171,
                        imgTops: '../resources/img/custom/map_tops_01.png',
                        imgDetail: '../resources/img/custom/map_detail_01.png'
                    },
                    {
                        lat: 37.515537,
                        lng: 126.904595,
                        imgTops: '../resources/img/custom/map_tops_02.png',
                        imgDetail: '../resources/img/custom/map_detail_02.png'
                    },
                    {
                        lat: 37.4904593,
                        lng: 126.9227782,
                        imgTops: '../resources/img/custom/map_tops_03.png',
                        imgDetail: '../resources/img/custom/map_detail_03.png'
                    }
                ];
                var $map = $('#map'),
                    optsMap = {
                        src: 'https://maps.googleapis.com/maps/api/js?key=',
                        apiKey: 'AIzaSyCxtozEW2iyzfBNP2dAyYi-53BLguWGlpg',
                        center: centers[_idx],
                        zoom: 18,
                        scrollwheel: false
                    };
                if (!$map.length) return false;
                _bool = (_bool !== false) ? true : false;
                var _reset = function() {
                    if (typeof myMap == 'object' && myMap !== null) return false;
                    $map.empty();
                    $map.toggleClass('in', false);
                };
                var _build = function() {
                    myMap = new google.maps.Map($map[0], optsMap);
                    myMarker = new google.maps.Marker({
                        position: optsMap.center,
                        map: myMap
                    });
                    $map.toggleClass('in', true);
                };
                var _setImg = function(){
                    // alert(optsMap.centers);
                    var _img = (pathName.indexOf('tops') > -1) ? centers[_idx].imgTops : centers[_idx].imgDetail;
                    $map.html('<img src="' + _img + '" />');
                    $map.toggleClass('in', true);
                }
                _reset();
                if (_bool === true) {
                    if (typeof google == 'undefined') {
                        $.getScript(optsMap.src + optsMap.apiKey, function() {
                            _build();
                        }).fail(function(){
                            _setImg();
                        });
                    } else {
                        _build();
                    }
                }
            },
            tilt: function(_bool) {
                $('.js-tilt').hoverTilt();
                // console.log('tilt');
                // $('.js-tilt').tilt({
                //     glare: true,
                //     scale: 1.1,
                //     maxGlare: .5
                // })
            },
            text: function(_bool) {
                // $('.js-text-motion').textMotion({
                //     autoPlay: true
                // });
            },
            onReady: function(_func) { // 페이지 렌더링 전
                // $window.scrollTop(0); // scrollTop
                modules.slider(true);
                modules.inView(true);
                if (typeof _func == 'function') _func.call();
            },
            onAfter: function(_func) { // 페이지 렌더링 후
                var _do = function() {
                    modules.parallax(true);
                    modules.scroll(true);
                    modules.mask(true);
                    modules.tilt(true);
                    modules.text(true);
                    modules.displace(true);

                    if (typeof _func == 'function') _func.call();
                    // console.log('loaded');
                };
                if (opts.imagesLoaded !== true) {
                    _do();
                } else {
                    imagesLoaded('#container', _do);
                }
            },
            off: function(_func) {
                modules.hoverSpin(false);
                modules.underline(false);
                modules.slider(false);
                modules.mask(false);
                modules.map(false);
                modules.tilt(false);
                modules.text(false);
                modules.displace(false);
                // destory 가 필요없음, refresh 로 대체
                // modules.scroll(false);
                // modules.parallax(false);
                // modules.inView(false);
                if (typeof _func == 'function') _func.call();
            }
        };

        var page = {
            visual: function() {


            },
            tilt: function() {

            },
            home: function() { // home

                this.visual();

                var swiperC = new Swiper('.js-swiper-home-c', {
                    speed: 400,
                    loop: true,
                    autoplay: {
                        delay: 5000
                    }
                });
                $document.on('click', '.js-swiper-home-c-prev', function() {
                    swiperC.slidePrev();
                });
                $document.on('click', '.js-swiper-home-c-next', function() {
                    swiperC.slideNext();
                });

                // home 갤러리
                var _gallery = function(e) {
                    var $this = $(e.target).closest('li'),
                        _idx = $this.index();
                    if ($this.is('.in')) return false;
                    $this.addClass('in').siblings().removeClass('in');
                    var _large = function() {
                        var $large = $('#galleryLarge .item.in');
                        $large.removeClass('ready in');
                        $large.siblings().addClass('ready');
                        setTimeout(function() {
                            $large.siblings().addClass('in');
                        }, 20);
                    };
                    var _small = function() {
                        var $small = $('#gallerySmall .item.in');
                        $small.removeClass('ready in');
                        $small.siblings().addClass('ready');
                        setTimeout(function() {
                            $small.siblings().addClass('in');
                        }, 20);
                    };
                    _large();
                    _small();
                };

                $document.on('click', '#galleryNav a', _gallery);


            },
            tops: function() {

                var swiperLive = new Swiper('#sliderLive', {
                    slidesPerView: 1,
                    speed: 400,
                    loop: true,
                    autoplay: {
                        delay: 5000
                    }
                });

                $document.on('click', '#sliderPager a', function(e){
                    var $this = $(e.target);
                    $this = $this.is('a') ? $this : $this.closest('a');
                    if ($this.hasClass('prev')) {
                        swiperLive.slidePrev();
                    } else {
                        swiperLive.slideNext();
                    }
                });

                var $sliderItems = $('#sliderMap .item'),
                    _length = $sliderItems.length,
                    _idx = 0;

                $document.on('click', '#sliderMap .navigation a', function(e) {
                    var $this = $(e.target);
                    $this = $this.is('a') ? $this : $this.closest('a');
                    if ($this.hasClass('prev')) {
                        _idx--;
                    } else {
                        _idx++;
                    }
                    if (_idx < 0) {
                        _idx = _length - 1
                    }
                    if (_idx >= _length) {
                        _idx = 0
                    }
                    $sliderItems.eq(_idx).addClass('in').siblings().removeClass('in');
                    modules.map(true, _idx);
                });
                modules.map(true, _idx);

            },
            eliden: function() {

            },
            detail: function() {
                var $sliderItems = $('#sliderMap .item'),
                    _length = $sliderItems.length,
                    _idx = 0;
                $document.on('click', '#sliderMap .navigation a', function(e) {
                    var $this = $(e.target);
                    $this = $this.is('a') ? $this : $this.closest('a');
                    if ($this.hasClass('prev')) {
                        _idx--;
                    } else {
                        _idx++;
                    }
                    if (_idx < 0) {
                        _idx = _length - 1
                    }
                    if (_idx >= _length) {
                        _idx = 0
                    }
                    $sliderItems.eq(_idx).addClass('in').siblings().removeClass('in');
                    modules.map(true, _idx);
                });
                modules.map(true, _idx);
            },
            elstyle: function() {

                $('#tilt').hoverTilt({
                    selector: '.item',
                    items: []
                });

            },
            init: function() {

                // console.log(flag);
                if (flag === true) { // 최초 실행시는 skip
                    removeClassHasPrefix($body[0], 'page-');
                    $body.addClass('page-' + pathName);
                }

                modules.hoverSpin(true); // hoverSpin

                var doNavigation = function(_idx) { // do navigation
                    var $navigation = $('#header li.d1');
                    // $navigation.removeClass('in');
                    // if (_idx !== undefined) {
                    //     $navigation.eq(_idx).addClass('in');
                    // }
                    modules.underline(true); // underline;
                };

                switch (pathName) {
                    case 'home':
                        doNavigation();
                        this.home();
                        break;
                    case 'tops':
                        doNavigation(0);
                        this.tops();
                        break;
                    case 'eliden':
                        doNavigation(1);
                        this.eliden();
                        break;
                    case 'eliden_detail':
                        doNavigation(1);
                        this.detail();
                        break;
                    case 'elstyle':
                        doNavigation(2);
                        this.elstyle();
                        break;
                    case 'detail':
                        doNavigation(2);
                        this.detail();
                        break;
                    default:
                }
            },
            out: function() { // 페이지 나갈때
                pathName = getCleanPathName(pathName); // pathName 구하기
                removeClassHasPrefix($body[0], 'bg-'); // bg로 시작되는 클래스 제거
                $body.addClass('bg-' + pathName);
                $html.addClass('is-indicator');
                $html.removeClass('is-enter');
                $container.addClass('is-exiting'); // Add your CSS animation reversing class
            },
            in: function() { // 페이지 로딩 시작
                // modules.off(); // module off
                if (myUnderline !== null) {
                    myUnderline.pause();
                }
            },
            progress: function() {
                modules.off(); // module off
            },
            ready: function() { // 페이지 로딩 완료
                page.init(); // init page
                modules.onReady(); // module on ready
                $container.removeClass('is-exiting'); // Remove your CSS animation reversing class
            },
            after: function() {
                modules.onAfter(function() {
                    $html.removeClass('is-indicator');
                    $html.addClass('is-enter');;
                    flag = true;
                }); // modules on after
            }
        };

        var initSmoothState = function() {
            var _options = {
                anchors: 'a.js-pjax',
                onBefore: function($currentTarget, $container) {
                    pathName = $currentTarget.attr('href'); // path 이름 구하기
                    page.out();
                },
                onStart: {
                    duration: 1200, // How long this animation takes
                    render: function($container) {
                        page.in();
                        // console.log('start');
                    }
                },
                onProgress: {
                    duration: 0, // How long this animation takes
                    render: function($container) {
                        page.progress();
                        // console.log('start2');
                    }
                },
                onReady: {
                    duration: 10,
                    render: function($container, $newContent) {
                        if ($newContent !== undefined) {
                            $container.html($newContent); // Inject the new content
                        }
                        page.ready();
                    }
                },
                onAfter: function($container, $newContent) {
                    page.after();
                }
            };
            var _option = $.extend({}, settings.smoothState, _options);
            mySmoothState = $container.smoothState(_option).data('smoothState');
        };

        var myPjax = null;

        var initPjax = function() {
            if (!$.support.pjax) return false;
            $document.on('click', '.js-pjax', function(e) {
                e.preventDefault();
                var $this = $(e.target);
                $this = $this.is('a') ? $this : $this.closest('a');
                pathName = $this.attr('href'); // path 이름 구하기
                var _pjaxOpts = $.extend({}, settings.pjax, {
                    url: pathName // 앵커태그가 이동할 주소 추출
                });
                page.out();
                setTimeout(function() {
                    $.pjax(_pjaxOpts);
                }, 1200);
            });
            $document.on('pjax:beforeSend', function(e, xhr, textStatus, options) {

            });
            $document.on('pjax:send', function(e, xhr, textStatus, options) {

            });
            $document.on('pjax:complete', function(e, xhr, textStatus, options) {
                page.in();
            });
            $document.on('pjax:end', function(e, xhr, textStatus, options) {
                page.ready();
                setTimeout(function() {
                    page.after();
                }, 100);
            });
        };

        var initDocument = (function() { // 강제 실행

            $body.append(HTML); // draw html

            page.in();

            if (pathName == '') { // 최초 실행시
                pathName = getCleanPathName(pathName);
            }

            setTimeout(function() {
                page.ready();
            }, 10);

            setTimeout(function() {
                page.after();
            }, 100);

            if (opts.method === 1) {
                initSmoothState();
                // console.log('mode: smoothState');
            } else if (opts.method === 2) {
                initPjax();
                // console.log('mode: pjax');
            }

        })();

    };

    main();

    $window.on('scroll', function(){
        var _scrollTop = $window.scrollTop();
        var _bool = (_scrollTop > 10);
        $html.toggleClass('is-scroll-downed', _bool);
    });

    $('.js-text-motion').textMotion({
        lettering: 'words'
    });
    $('.js-text-motion-lines').textMotion({
        lettering: 'lines'
    });
    setTimeout(function(){
        $('.js-text-motion').trigger('in.textMotion');
    }, 20);
    setTimeout(function(){
        $('.js-text-motion-lines').trigger('in.textMotion');
    }, 800);
});
