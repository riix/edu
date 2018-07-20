(function($) {

    'use strict';

    "version: 0.1";

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    var isOpend = false; // 중복 방지 해제

    var Modal = function() {

        // base for return object
        var base = {
            $el: null, // modal
            $inner: null, // modal inner
            $title: null, // title
            $buttons: null, // buttons
            $anchor: null, // anchor
            progressObj: null, // progress bar object
            progress: 100, // progress percent
            width: 0,
            height: 0
        };

        // setting
        var _setting = {
            name: 'modalr', // component name
            selectorAjaxContainer: '.inner-wrapper', // selector ajax load element's container
            console: false, // active console
            html: [
                '<div id="modal" class="md-modal"><div class="md-content">',
                '<h3 class="title"><a href="javascript:;">Modal Dialog</a></h3>',
                '<div id="modalInner" class="popup"><div class="inner-wrapper"></div></div>',
                '<div class="section-buttons"></div>',
                '<a href="javascript:;" class="md-close close"><span class="icon"><em>Close</em></span></a>',
                '</div>',
                '</div>'
            ],
            title: 'Modal', // 제목
            text: '<p>처리중입니다.</p>', // 내용
            buttonSubmit: false, // 확인버튼 출력여부
            buttonConfirm: false, // 컨펌버튼 출력여부
            buttonCancel: false, // 취소버튼 출력여부
            buttonClose: true, // 닫기버튼 출력여부
            closeOnSubmit: true, // 확인 클릭 시 닫기
            dragAndMove: true, // drag and move 기능
            indicator: true, // indicator
            labelSubmit: '확인', // 확인버튼 레이블
            labelConfirm: '확인', // 컨펌버튼 레이블
            labelCancel: '취소', // 취소버튼 레이블
            labelClose: '닫기', // 닫기버튼 레이블
            messageOnSubmit: '확인을 클릭하시면 저장됩니다.\n실행하시겠습니까?', // 실행전 메시지
            onlyOnce: true, // 중복 실행 방지
            overlay: true, // overlay 유무
            overlayCloser: true, // overlayCloser 유무
            perspective: false, // perspective 유무
            print: false, // print 기능 유무
            position: null, // 'left bottom'
            size: null, // '200x500'
            sizeMax: '1220x1024', // max width, max height
            focusFormEl: true, // focus to form element
            fx: 'fx-9', // effect
            fullSize: false, // 전체화면
            onInit: function(base) {
                // 생성시 실행
                common.log('init');
            },
            onComplete: function(base) { // 팝업 완료시 실행
                common.log('complete');
            },
            onSubmit: function(base) { // 확인 버튼 클릭시 실행
                common.log('submit');
            },
            onCancel: function(base) { // 취소 버튼 클릭시 실행
                common.log('cancel');
            },
            progress: false, // progress 동작 유무
            initProgress: function() { // progress 생성
                if (typeof Nanobar === 'function') {
                    var _id = 'modalProgressBar';
                    $('#' + _id).off().remove();
                    base.progressObj = new Nanobar({ // progress bar
                        bg: '#cda326',
                        id: _id
                    });
                    $('#' + _id).addClass('progressbar');
                }
            },
            onProgress: function(base) { // progress 진행시 호출
                if (typeof Nanobar === 'function' && typeof base.progressObj == 'object') {
                    base.progressObj.go(base.progress); // percent
                }
            }
        };

        var params,
            _opts;

        var REGSIZE = /^(\d{1,4})x(\d{1,4})$/;

        var _transitionEndEventName = 'webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend transitionEnd',
            _animEndEventName = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend animationEnd';

        var _is = { // detect object
            lteIE10: !!window.ActiveXObject, // IE, lte 10
            gteIE10: (!!window.navigator.msPointerEnabled), // IE, gte 10
            cssanimations: !$html.hasClass('no-cssanimations'),
            animating: false
        };

        var _delay = [];

        _delay.second = 300; // 찰나, 효과를 위해서 확보 되어야 함, 300ms 가 css 모션 기준
        _delay.second = (_is.lteIE10 === true || _is.gteIE10 === true) ? 300 : _delay.second; // ie 대응, 찰나 수정
        _delay.anim = _delay.second + 10; // 가상 애니메이션 지연 시간, 콜백이나 핸들링 지연에 사용

        var _timer = { // timer object
            modal: null,
            overlay: null,
            progressComplete: null,
            beforeComplete: null,
            forceComplete: null
        };

        /**
         * common func.
         */
        var common = {
            // console log
            log: function(_obj) {
                if (_setting.console !== true || typeof console !== 'object' || typeof console.log !== 'function') return false;
                console.log(_setting.name + ':' + _obj);
            },
            // console info
            info: function(_obj) {
                if (_setting.console !== true || typeof console !== 'object' || typeof console.info !== 'function') return false;
                console.info(_setting.name + ':' + _obj);
            },
            // callback
            callFunc: function(_func, _bool, _param) {
                if (_bool !== undefined && _bool === false) return false;
                _func = (typeof _func == 'string') ? window[_func] : _func;
                _param = (_param === null) ? '' : _param;
                if (_func && $.isFunction(_func)) {
                    _func.call(null, base, _param);
                } else {
                    common.log('no exist function');
                }
            },
            returnAnchor: function(_el) {
                var $el = (_el[0].tagName !== undefined && _el[0].tagName.toLowerCase() !== 'a') ? _el.closest('a') : _el;
                return $el;
            },
            progress: function(_func, _el) {
                var $imgs = _el.find('img');
                var _length = $imgs.length,
                    _blocker = 0,
                    _percent = 0;
                var _callback = function(num) { // callback
                    base.progress = num;
                    common.callFunc(_func);
                    if (num >= 100) { // complete
                        _timer.progressComplete = setTimeout(function() {
                            $html.removeClass('is-indicator');
                            util.setPosition();
                        }, _delay.anim);
                    }
                };
                var _core = function(i) {
                    var $img = $imgs.eq(i);
                    if ($img.length > 0) {
                        $('<img />', {
                            'src': $img.attr('src')
                        }).one('load', function() {
                            _percent = Math.max(parseInt((i / _length) * 100, 10), 5);
                            _callback(_percent); // going
                            _core(i + 1);
                        }).error(function() {
                            _core(i + 1);
                        });
                    } else {
                        if (_blocker <= 1) {
                            _blocker++;
                            _callback(100); // complete
                        }
                    }
                };
                if (_length < 0) {
                    _callback(100);
                } else {
                    _callback(5); // start
                    _core(0);
                }
            }
        };

        /**
         * utilities
         */
        var util = {

            getParam: function(_params) {
                var $anchor = null; // reset
                if (_params[0] !== null && typeof _params[0] == 'object') { // _params = event
                    $anchor = $(_params[0].target);
                    $anchor = common.returnAnchor($anchor);
                } else {
                    common.log('_params[0] is must be event object');
                }
                params = _params[1];
                _opts = $.extend({}, _setting, params);

                _opts.html = _opts.html.join('');
                base.$anchor = $anchor;

                console.info('modal option', _opts);

            },

            // set button
            setButton: function(_type) {
                var $button = null;
                var $div = base.$buttons;
                var _submit = _opts.buttonSubmit, // 확인버튼
                    _confirm = _opts.buttonConfirm, // 컨펌버튼
                    _cancel = _opts.buttonCancel, // 취소버튼
                    _close = _opts.buttonClose; // 닫기버튼
                $div.empty();
                if (_submit === true || _confirm === true || _cancel === true) {
                    if (_submit === true) {
                        $button = $('<a href="javascript:;" class="button primary submit"><span>' + _opts.labelSubmit + '</span></a>');
                        $div.append($button);
                    }
                    if (_confirm === true) {
                        $button = $('<a href="javascript:;" class="button primary confirm"><span>' + _opts.labelConfirm + '</span></a>');
                        $div.append($button);
                    }
                    if (_cancel === true) {
                        $button = $('<a href="javascript:;" class="button cancel"><span>' + _opts.labelCancel + '</span></a>');
                        $div.append($button);
                    }
                    $div.addClass('in');
                } else {
                    if (_close === true) {
                        $button = $('<a href="javascript:;" class="button close"><span>' + _opts.labelClose + '</span></a>');
                        $div.append($button);
                        $div.addClass('in');
                    }
                }
                // 인쇄기능
                if (_opts.print === true) {
                    $button = $('<a href="javascript:;" class="button md-print"><span><i class="fonti um-print"></i><em>인쇄하기</em></span></a>');
                    base.$el.find('.title').after($button);
                }
            },

            // set size
            setSize: function() {

                var $el = base.$el,
                    $inner = base.$inner;

                var _setInnerScroll = function() {

                    var _buttonsHeight = (base.$buttons.children().length) ? base.$buttons.outerHeight() : 0;
                    var _innerHeight = $el.innerHeight() - base.$title.innerHeight() - _buttonsHeight;

                    // $inner.css({
                    $('#modalInner').css({
                        'height': _innerHeight,
                        'overflow': 'auto',
                        'overflow-x': 'hidden'
                    });

                    if ($html.hasClass('is-sm') && ($inner.height() < $inner.children().eq(0).height())) {
                        $inner.css('overflow-y', 'scroll');
                    }

                };

                if (_opts.fullSize === true) { // _opts. full size
                    base.$el.addClass('fx-full');
                    _setInnerScroll();
                    return false;
                }

                var _toWidth = 0,
                    _toHeight = 0;

                base.width = $el.width();
                base.height = $el.height();

                if (_opts.size !== undefined && _opts.size !== null && REGSIZE.test(_opts.size)) { // set size
                    var _size = _opts.size.split('x');
                    _toWidth = _size[0];
                    _toHeight = _size[1];
                }

                if (_opts.sizeMax !== undefined && _opts.sizeMax !== null && REGSIZE.test(_opts.sizeMax)) { // set max size
                    var _sizeMax = _opts.sizeMax.split('x');
                    _toWidth = Math.min(_toWidth, _sizeMax[0]);
                    _toHeight = Math.min(_toHeight, _sizeMax[1]);
                    _toWidth = Math.min(_toWidth, $window.width());
                    _toHeight = Math.min(_toHeight, $window.height());
                }

                if (_toWidth > 0) {
                    base.width = _toWidth;
                    $el.css('width', _toWidth);
                }

                if ($html.hasClass('is-sm')) { // 모바일 창 제한
                    var _windowHeight = $window.height(),
                        _windowWidth = $window.width();
                    if (_windowHeight - 100 < _toHeight ) {
                        _toHeight = _windowHeight;
                    }
                    if (_windowWidth - 100 < _toWidth ) {
                        _toWidth = _windowWidth;
                    }
                }

                if (_toHeight > 0) {
                    base.height = _toHeight;
                    $el.css('height', _toHeight);
                    _setInnerScroll();
                }

            },

            // set perspective
            setPerspective: function(_bool) {
                if (_opts.perspective === false) return false; // _opts
                $html.toggleClass('md-perspective', _bool);
            },

            // set position
            setPosition: function() {
                if (_opts.fx === 'fx-7' || _opts.fx === 'fx-12') return false; // _opts.
                var $el = base.$el;
                var _width = $el.width(),
                    _height = $el.height();
                var _top,
                    _left,
                    _classArrow;
                var _setPositionCenter = function() { // 중앙 정렬
                    if (_opts.fullSize === true) {
                        return false; // fullSize 일 때
                    }

                    if ($html.hasClass('csstransforms')) {
                        $el.css({
                            'transform': 'translate(-50%, -50%)'
                        });
                    } else {
                        $el.css({
                            'margin-left': 0 - (_width / 2),
                            'margin-top': 0 - (_height / 2)
                        });
                    }

                };
                var _setPosition = function() { // 위치 지정
                    var _anchorOffset = base.$anchor.offset(),
                        _anchorTop = parseInt(_anchorOffset.top, 10),
                        _anchorLeft = parseInt(_anchorOffset.left, 10);
                    if (_opts.position == 'left bottom') { // 위치 지정시
                        _classArrow = 'arrow';
                        _top = (_anchorTop - $el.height() - 10);
                        _left = _anchorLeft;
                    }
                    $el.addClass(_classArrow);
                    $el.css({
                        'position': 'absolute',
                        'z-index': 99,
                        'top': _top,
                        'left': _left
                    });
                };
                if (_opts.position !== null) {
                    _setPosition();
                } else {
                    _setPositionCenter();
                }
            },

            // toggle display overlay
            toggleOverlay: function(_bool) {
                if (_opts.overlay === false || _opts.position !== null) return false; // _opts.
                $html.toggleClass('is-overlay', _bool);
            },

            // drag and drop
            dragMove: function(_bool) {
                if (_opts.dragAndMove === false || _opts.fullSize) return false; // _opts.

                var _windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                    _windowWidth = $window.width();

                var _selector = '.md-modal h3.title', // handler selector
                    _class = 'is-handle-clicked';
                var $handler = $(_selector).eq(0);
                var $el = $handler.parents('.md-modal');
                var _scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // scroll
                var _map = { // _map, 경계선 제한
                    north: _scrollTop,
                    south: _scrollTop + _windowHeight - $el.height(),
                    west: _windowWidth - $el.width(),
                    east: 0
                };
                var _reset = function(e) { // reset
                    e.preventDefault();
                    $el.toggleClass(_class, false);
                    $document.off('.draggr-sub');
                };
                var _hander = function(e) {
                    var _offset = $handler.offset(), // 정확한 좌표 탐지를 위한 보정 장치
                        _marginX = e.pageX - _offset.left,
                        _marginY = e.pageY - _offset.top;
                    $el.toggleClass(_class, true);
                    $document.one('mouseup.draggr-sub', _selector, _reset);
                    $document.one('mouseup.draggr-sub', _reset);
                    $document.on('mousemove.draggr-sub', function(e) {
                        e.preventDefault();
                        if ($el.hasClass(_class) !== true) return false;
                        var _x = e.pageX - _marginX, // 정확한 좌표 탐지를 위한 보정 장치
                            _y = e.pageY - _marginY;
                        // _map, 경계선 제한
                        _x = (_x < _map.east) ? _map.east : _x;
                        _x = (_x > _map.west) ? _map.west : _x;
                        _y = (_y < _map.north) ? _map.north : _y;
                        _y = (_y > _map.south) ? _map.south : _y;
                        $el.offset({
                            left: _x, // 정확한 좌표 탐지를 위한 보정 장치
                            top: _y
                        });
                    });
                };
                var _init = function() {
                    $handler.css('cursor', 'move');
                    $document.off('.draggr .draggr-sub');
                    $document.on('mousedown.draggr', _selector, _hander);
                };
                if (_bool === true) {
                    _init(); // init
                } else {
                    $document.off('.draggr .draggr-sub'); // destroy
                }
            },

            // print
            print: function(_bool) {
                $html.addClass('is-print-modal');
                var _confirm = confirm('[' + _opts.title + '] 창을 프린터로 출력합니다.\n\n출력 옵션이 나타나지 않을 경우\n브라우저 인쇄기능을 선택해주세요.\n\n인쇄하시겠습니까?');
                if (_confirm === true) window.print();
                return false;
            }

        };
        /**
         * modeling
         */
        var model = {

            // do reset modal
            reset: function() {
                $('#modal').remove(); // reset model
                var _resetElement = function() { // reset element
                    base.$el = $(_opts.html).prependTo('body');
                    base.$inner = base.$el.find('.inner-wrapper');
                    base.$title = base.$el.find('.title');
                    base.$buttons = base.$el.find('.section-buttons');
                    base.$close = base.$el.find('.md-close');
                };
                _resetElement(); // reset element
                $html.toggleClass('is-modal is-overlay', false); // turn off modal
            },

            // destroy
            destroy: function() {
                if (_is.animating === true) return false; // detect animating
                model.toggle(false);
            },

            // do focus
            setFocus: function(_bool) { // 정리 필요
                var $anchor = base.$anchor,
                    $title = base.$title,
                    $el = base.$el,
                    $input = $el.find('input, select, textarea');
                if (_bool === true) {
                    $el.attr('tabindex', '1').focus();
                    $title.children().focus();
                    if ($input.length && _opts.focusFormEl === true) {
                        $input.eq(0).focus();
                    }
                } else if ($anchor !== null) {
                    $anchor.focus();
                }
            },

            // set handler
            handler: function(_bool) {

                $document.off('.modal'); // set off handler

                var _isOverlayCloser = false; // 오버레이 클릭

                var _destroy = function() {
                    model.destroy();
                };

                if (_bool === true) {

                    $document.on('click.modal', '#modal a.close', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _destroy();
                    });

                    $document.on('click.modal', '#modal .submit', function(e) {
                        common.callFunc(_opts.onSubmit);
                        if (_opts.closeOnSubmit === true) _destroy();
                    });

                    $document.on('click.modal', '#modal .confirm', function(e) {
                        var _confirm = confirm(_opts.messageOnSubmit);
                        if (_confirm === true) {
                            common.callFunc(_opts.onSubmit);
                            if (_opts.closeOnSubmit === true) _destroy();
                        }
                    });

                    $document.on('click.modal', '#modal .cancel', function(e) {
                        common.callFunc(_opts.onCancel);
                        _destroy();
                    });

                    $('.md-close').on('focusout.modal', function(e) {
                        base.$title.children().focus();
                    });

                    $document.on('click.modal', '#modal .md-print', function(e) {
                        e.preventDefault();
                        util.print();
                    });


                    _timer.overlay = setTimeout(function() { // 중복 실행 방지

                        if (_opts.overlayCloser === true) _isOverlayCloser = true;

                        // 오버레이 클릭시 닫기
                        $document.on('click.modal', '#overlay', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (_isOverlayCloser === true) _destroy();
                        });

                    }, _delay.anim);
                }
            },

            // do open
            open: function() {

                if (_is.animating === true) return false; // detect animating

                var $el = base.$el,
                    $title = base.$title,
                    $close = base.$close;

                $el.addClass(_opts.fx); // set fx class
                $title.children().html(_opts.title + '<span class="sr-only"> 레이어</span>'); // set title
                $close.find('em').text(_opts.title + ' 레이어 닫기');

                if (_opts.indicator === true) $html.addClass('is-indicator'); // indicator

                if (_opts.progress === true) { // progress
                    common.callFunc(_opts.initProgress); // init
                    common.progress(_opts.onProgress, $el); // set progress, when next build
                }

                util.setButton(); // set button
                util.setSize(); // set size
                util.setPosition(); // set position

                model.toggle(true);

                common.callFunc(_opts.onInit); // on init callback

            },

            resetTimer: function() { // reset timer object
                clearTimeout(_timer.modal);
                clearTimeout(_timer.overlay);
                clearTimeout(_timer.beforeComplete);
                clearTimeout(_timer.forceComplete);
            },

            toggle: function(_bool) { // toggle modal

                var $el = base.$el;
                var _blocker = 0;

                _is.animating = true;

                model.resetTimer(); // reset timer object

                var _core = function(_str) {

                    if (_blocker >= 1) return false;

                    _blocker++;

                    $el.off(_transitionEndEventName); // transition 감지 해제

                    _timer.beforeComplete = setTimeout(function() {

                        _is.animating = false;

                        $html.toggleClass('is-modal', _bool);
                        $el.toggleClass('is-modal-complete', _bool);

                        $html.removeClass('is-print-modal'); // reset print class

                        util.setPerspective(_bool); // set perspective
                        util.dragMove(_bool); // drag and move

                        model.resetTimer(); // reset timer object
                        model.handler(_bool); // set handler
                        model.setFocus(_bool); // set focus

                        common.callFunc(_opts.onComplete, _bool); // callback

                        if (_opts.progress === false) $html.removeClass('is-indicator'); // progress 기능 없을때 indicator 강제 제거

                        if (_bool === true) {

                            $el.toggleClass('md-show', _bool);

                        } else { // turn off 시 clean

                            $el.remove();

                            isOpend = false; // 중복 방지 해제
                        }

                    }, 10);

                };

                if (_bool === true) {

                    if (_is.cssanimations === true) { // transition 감지, off 일때는 force 방식으로 _core 호출

                        $el.one(_transitionEndEventName, function() {

                            _core('transitionend');
                        });

                    }

                }

                _timer.modal = setTimeout(function() {

                    if (_bool === true) util.setPerspective(_bool); // set perspective, true 일 경우 먼저 실행

                    $el.toggleClass('md-show', _bool);
                    util.toggleOverlay(_bool); // toggle overlay

                    _timer.forceComplete = setTimeout(function() { // off 일때는 force 방식으로 _core 호출

                        _core('force');

                    }, _delay.anim);

                }, _delay.second);
            }
        };
        /**
         * build contents
         */

        var build = {

            html: function() {
                base.$inner.html(_opts.text);
                model.open();
            },

            ajax: function(_callback) {

                var $sandbox = $('<div />'),
                    $firstchild,
                    $inner;

                var _selector = _opts.selectorAjaxContainer, // ajax load page fragment selector
                    _src = _opts.text,
                    _html;

                var _core = function(_data) {

                    $sandbox.html(_data);
                    $firstchild = $sandbox.find('div').eq(0);
                    $inner = $sandbox.find(_selector);
                    $sandbox = ($inner.length) ? $inner : $firstchild;
                    base.$inner.html($sandbox.html());
                    model.open();

                };

                try {
                    $sandbox.load(_src, function(data, status, xhr) { // ajax load
                        _core(data);
                    });
                } catch (e) {
                    common.log(e.message);
                }
            },

            clone: function(_callback) {
                var $target = $(_opts.text);
                if (!$target.length) {
                    common.log('there is no element');
                    return false;
                }
                base.$inner.html($target.html());
                model.open();
            },

            iframe: function(_callback) {
                var $iframe = $('<iframe src="' + _opts.text + '" class="iframe" frameborder="0" width="400" height="400" marginwidth="0" marginheight="0" scrolling="no" />');
                base.$inner.append($iframe);
                model.open();
            },

            image: function(_callback) {
                base.$inner.html(_opts.text);
                model.open();
            },

            movie: function(_callback) {
                var $iframe = $('<iframe src="' + _opts.text + '" class="iframe" frameborder="0" width="400" height="400" marginwidth="0" marginheight="0" scrolling="no" />');
                base.$inner.append($iframe);
                _opts.title = 'VOD ' + _opts.title;
                base.$el.addClass('is-vod');
                if (_opts.size === null) _opts.size = '800x600';
                model.open();
            }

        };
        /**
         * structure
         */
        var modal = function(_arg, _type) {

            util.getParam(_arg);

            if (isOpend === true) return false; // 중복 방지

            isOpend = (_opts.onlyOnce === true) ? true : false;

            model.reset();

            switch (_type) {
                case 'clone':

                console.info('modal option', _opts);

                    build.clone();
                    break;
                case 'ajax':
                    build.ajax();
                    break;
                case 'iframe':
                    build.iframe();
                    break;
                case 'image':
                    build.image();
                    break;
                case 'movie':
                    build.movie();
                    break;
                case 'artist':
                    build.ajax();
                    break;
                default:
                    build.html();
                    break;
            }
        };
        /**
         * public method
         */
        return {
            close: function() {
                model.destroy();
            },
            html: function() {
                modal(arguments, 'html');
            },
            clone: function() {
                modal(arguments, 'clone');
            },
            ajax: function() {
                modal(arguments, 'ajax');
            },
            iframe: function() {
                modal(arguments, 'iframe');
            },
            image: function() {
                modal(arguments, 'image');
            },
            movie: function() {
                modal(arguments, 'movie');
            },
            artist: function() {
                modal(arguments, 'artist');
            }
        };
    };

    // make jquery object
    $.modal = new Modal();


})(window.jQuery);

$(function(){

    var $document = $(document);

    var returnAnchor = function(_el) { // return anchor element
        var $el = (_el[0].tagName !== undefined && _el[0].tagName.toLowerCase() !== 'a') ? _el.closest('a') : _el;
        return $el;
    };

    // get inline custom data
    var getCustomData = function(e) {

        var _result = {};

        var _defaults = {
            name: null,
            selectorAjaxContainer: null, // ajax loading page pragment
            console: null,
            html: null,
            title: null, // 제목
            text: null, // 내용
            buttonSubmit: null, // 확인버튼 출력여부
            buttonConfirm: null, // 컨펌버튼 출력여부
            buttonCancel: null, // 취소버튼 출력여부
            buttonClose: null, // 닫기버튼 출력여부
            closeOnSubmit: null, // 확인 클릭 시 닫기
            dragAndMove: true, // drag and move 기능
            indicator: null, // indicator
            labelSubmit: null, // 확인버튼 레이블
            labelConfirm: null, // 컨펌버튼 레이블
            labelCancel: null, // 취소버튼 레이블
            labelClose: null, // 닫기버튼 레이블
            messageOnSubmit: null, // 확인 전 메시지
            onlyOnce: null, // 중복 실행 방지
            overlay: null, // overlay 유무
            overlayCloser: null, // overlayCloser 유무
            perspective: null, // perspective
            position: null, // 'left bottom'
            print: null,
            size: null, // '200x500'
            sizeMax: null, // max width, max height
            focusFormEl: null, // focus to form element
            fx: null, // effect
            fullSize: null, // 전체화면
            onInit: null, // 생성시 실행
            onComplete: null, // 팝업 완료시 실행
            onSubmit: null, // 확인 버튼 클릭시 실행
            onCancel: null, // 취소 버튼 클릭시 실행
            progress: null, // progress 기능 설정
            initProgress: null, // progress 생성
            onProgress: null // progress 진행시 호출
        };

        var $this = $(e.target);

        $this = returnAnchor($this); // return anchor element

        $.each(_defaults, function(key, val) { // get custom data
            var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase(), // buttonSubmit 을 button-submit 등으로 camelCase 를 hipen 구조로 변환
                _data = $this.data(_key);
            if (_data !== undefined) _result[key] = _data;
        });

        return _result;

    };

    // set handler
    var _handler = function(e) {

        var $this = returnAnchor($(e.target)), // return anchor element
            _class = $this.attr('class');

        var _preventDefault = function(e) { // prevent default
            e.preventDefault();
            e.stopPropagation();
        };

        if (_class !== undefined) {
            if (_class.match('js-modal-html')) {
                _preventDefault(e);
                $.modal.html(e, getCustomData(e));
            } else if (_class.match('js-modal-image')) {
                _preventDefault(e);
                $.modal.html(e, getCustomData(e));
            } else if (_class.match('js-modal-clone')) {
                _preventDefault(e);
                $.modal.clone(e, getCustomData(e));
            } else if (_class.match('js-modal-ajax')) {
                _preventDefault(e);
                $.modal.ajax(e, getCustomData(e));
            } else if (_class.match('js-modal-close')) {
                _preventDefault(e);
                $.modal.close(e);
            } else if (_class.match('js-modal-movie')) {
                _preventDefault(e);
                $.modal.movie(e, getCustomData(e));
            }
        }

    };

    $document.on('click', _handler); // set handler

});
