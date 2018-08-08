/*
* 주석
*/

// 주석

/**
* 기본 탑재
@prepros-prepend './plugin/jquery.easing.1.3.min.js'
http://gsgd.co.uk/sandbox/jquery/easing/

@prepros-prepend './plugin/imagesloaded-4.1.4.min.js'
https://imagesloaded.desandro.com/

@prepros-prepend './plugin/swiper-4.2.0.custom.js'
http://www.idangero.us/swiper/

@prepros-prepend './plugin/jquery.selectric.js'
http://selectric.js.org/
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
