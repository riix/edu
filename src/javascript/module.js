/**
* 필수 탑재
@prepros-prepend './module/_inView.js'
@prepros-prepend './module/_parallax.js'
// !prepros-prepend './module/_smoothScroll.js'
// !prepros-prepend './module/_distortion.js'

// !prepros-prepend './module/_pointer.js', 보강 필요
// !prepros-prepend './module/_paroller.js'
*/

/**
* 기본 탑재
// !prepros-prepend './module/_getColor.js'
// !prepros-prepend './module/_tilt.js'
// !prepros-prepend './module/_underline.js'
@prepros-prepend './module/_textMotion.func.js'
@prepros-prepend './module/_textMotion.js'
*/

/**
* 선별 탑재
@prepros-prepend './module/_colorMask.js'
// @!prepros-prepend './module/_imgPlaceHoldr.js'
// @!prepros-prepend './module/_blockReveal.js'
// @!prepros-prepend './module/_glassy.js'
// @!prepros-prepend './module/_numberSpinnr.js'
// @!prepros-prepend './module/_spidr.js'
// @!prepros-prepend './module/_cheez.js'
// @!prepros-prepend './module/_datepickr.js'
*/

$(function() {

    // var isBaseModule = function(_moduleName) { // 모듈이 호출되었는지 판단
    //     var _result = false,
    //         _module = window.plugins;
    //     if (_module !== undefined) {
    //         var _length = _module.length;
    //         for (var i = 0; i < _length; i++) {
    //             if (_module[i].name == _moduleName) {
    //                 _result = true;
    //             }
    //         }
    //     }
    //     return _result;
    // };
    //
    // console.info('init module', window.plugins);

    // if (isBaseModule('datepickr')) {
    //
    // }

});
