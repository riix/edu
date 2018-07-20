/*
* 주석
*/

// 주석

/**
* 기본 탑재
@prepros-prepend '../../resources/js/lib/jquery.easing.1.3.min.js'
http://gsgd.co.uk/sandbox/jquery/easing/

@prepros-prepend '../../resources/js/lib/TweenMax-1.20.4.min.js'
@prepros-prepend '../../resources/js/lib/TweenMax.ScrollToPlugin.min.js'
@prepros-prepend '../../resources/js/lib/jquery.gsap-0.1.12.min.js'
https://greensock.com/tweenmax

@prepros-prepend '../../resources/js/lib/three.custom.js'
https://github.com/gijsroge/tilt.js

@prepros-prepend './plugin/js.cookie-2.2.0.min.js'
https://github.com/js-cookie/js-cookie 

@prepros-prepend './plugin/imagesloaded-4.1.4.min.js'
https://imagesloaded.desandro.com/

@prepros-prepend './plugin/jquery.smoothState.custom.js'
https://github.com/miguel-perez/smoothState.js

@prepros-prepend '../../resources/js/lib/jquery.pjax.js'
https://github.com/defunkt/jquery-pjax

@prepros-prepend './plugin/jquery.lettering-0.7.0.custom.min.js'
https://github.com/davatron5000/Lettering.js

@prepros-prepend './plugin/tinycolor-1.4.1.min.js'
https://github.com/bgrins/TinyColor
// 컬러값 포맷 변환

@prepros-prepend './plugin/jquery.primarycolor-1.2.2.min.js'
https://github.com/rythgs/jquery.primarycolor.js
// 배경색 탐지

@prepros-prepend './plugin/swiper-4.2.0.custom.js'
http://www.idangero.us/swiper/

*/

/*
!prepros-prepend './plugin/tilt.jquery-1.1.19.js'
https://github.com/gijsroge/tilt.js

!prepros-prepend '../../resources/js/lib/anime-2.20.min.js'
https://github.com/juliangarnier/anime

!prepros-prepend './plugin/jquery.nanoscroller-0.8.7.min.js'
https://github.com/jamesflorentino/nanoScrollerJS

!prepros-prepend './plugin/alertify-0.3.11.min.js'
https://github.com/fabien-d/alertify.js

!prepros-prepend './plugin/modaal-0.3.1.min.js'
https://github.com/imsky/holder

!prepros-prepend './plugin/holder-2.9.4.min.js'
https://github.com/imsky/holder
*/

/**
* 선별 탑재

*/

$(function(){

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    var initPlugin = {
        // pjax: function(_bool){
        //     if (typeof $.pjax == 'function' && _bool !== false) return false;
        //     $document.on('click', 'a.pjax', function(e){ // pjax라는 클래스를 가진 앵커태그가 클릭되면,
        //         var $this = $(this);
        //         $.pjax({
        //             url: $this.attr('href'), // 앵커태그가 이동할 주소 추출
        //             fragment: '#container', // 위 주소를 받아와서 추출할 DOM
        //             container: '#container' // 위에서 추출한 DOM 내용을 넣을 대상
        //         });
        //         return false;
        //     });
        // }
    }
    // initPlugin.pjax(true); // pjax

});
