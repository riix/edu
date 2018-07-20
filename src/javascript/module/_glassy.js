(function($){

    'use strict';

    var MODULE = {
        name: 'glassy',
        title: 'glassy',
        desc: '유리 마스크 제공',
        version: '1.0'
    };

    var _defaults = {
        method: 'src',
        onComplete: function(_el, i){
            // console.log('imgPlaceHolder', i);
        }
    };

    MODULE.defaults = _defaults; // set default

    // window.plugins = (typeof window.plugins !== 'undefined') ? window.plugins : []; // global 변수에 저장
    // window.plugins.push(MODULE);

    var VERTEXT = 'varying vec2 vUv;\n';
        VERTEXT += 'void main() {\n';
        VERTEXT += '  vUv = uv;\n';
        VERTEXT += '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n';
        VERTEXT += '}';

    var FRAGMENT = 'varying vec2 vUv;\n';
        FRAGMENT += 'uniform sampler2D texture;\n';
        FRAGMENT += 'uniform sampler2D texture2;\n';
        FRAGMENT += 'uniform sampler2D disp;\n';
        FRAGMENT += 'uniform float dispFactor;\n';
        FRAGMENT += 'uniform float effectFactor;\n';
        FRAGMENT += 'void main() {\n';
        FRAGMENT += '    vec2 uv = vUv;\n';
        FRAGMENT += '    vec4 disp = texture2D(disp, uv);\n';
        FRAGMENT += '    vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);\n';
        FRAGMENT += '    vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);\n';
        FRAGMENT += '    vec4 _texture = texture2D(texture, distortedPosition);\n';
        FRAGMENT += '    vec4 _texture2 = texture2D(texture2, distortedPosition2);\n';
        FRAGMENT += '    vec4 finalTexture = mix(_texture, _texture2, dispFactor);\n';
        FRAGMENT += '    gl_FragColor = finalTexture;\n';
        FRAGMENT += '}';

    function mobileAndTabletcheck() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    function extendOptsDataset(_arr, _el){ // extend options by dataset
        var _array = _arr;
        var isJqueryObject = (_el instanceof jQuery); // check jquery object
        var camelToKebab = function(_str){
            return _str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        };
        for (var key in _array) {
            if (_array.hasOwnProperty(key)) {
                var newOpt = (isJqueryObject !== true) ? _el.dataset[key] : _el.data(camelToKebab(key));
                _array[key] = (newOpt !== undefined) ? newOpt : _array[key];
            }
        }
        return _array;
    };

    var HoverEffect = function() {

        var defaults = {
            el: null,
            displacement: '../resources/img/glassy/1.jpg',
            image1: null,
            image2: null,
            hover: true,
            intensity: 0.5,
            speedIn: 1.4,
            speedOut: 1.4,
            easing: Circ.easeOut
        };

        var init = function(options){

            var base = {
                el: null,
                imgSrc: [],
                displacementSrc: null
            };

            var opts = $.extend({}, defaults, options);

            var el = opts.el || console.warn("no parent");

            opts = extendOptsDataset(opts, el);

            // console.info(opts);

            var $images = $(el).find('img');

            base.imgSrc[0] = $images.eq(0).attr('src') || console.warn("first image missing");
            base.imgSrc[1] = $images.eq(0).attr('src') || console.warn("second image missing");

            var threeScene = null,
                threeCamera = null,
                threeWebGLrenderer = null;

            threeScene = new THREE.Scene();
            threeCamera = new THREE.OrthographicCamera(el.offsetWidth / -2, el.offsetWidth / 2, el.offsetHeight / 2, el.offsetHeight / -2, 1, 1000);
            threeWebGLrenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

            // three shader material
            var threeShaderMaterial = null;

            var build = function(){

                var _threeTextureLoader = new THREE.TextureLoader();

                _threeTextureLoader.crossOrigin = "";
                threeCamera.position.z = 1;
                threeWebGLrenderer.setPixelRatio = 1;
                threeWebGLrenderer.setClearColor(0xffffff, 0.0);
                threeWebGLrenderer.setSize(el.offsetWidth, el.offsetHeight);

                el.appendChild(threeWebGLrenderer.domElement);

                var _addToGPU = function(t) {
                    threeWebGLrenderer.setTexture2D(t, 0);
                };
                var _texture1 = _threeTextureLoader.load(base.imgSrc[0], function(texture) {
                    _addToGPU(texture);
                });
                var _texture2 = _threeTextureLoader.load(base.imgSrc[1], function(texture) {
                    _addToGPU(texture);
                });
                var _disp = _threeTextureLoader.load(opts.displacement);

                _texture1.anisotropy = threeWebGLrenderer.getMaxAnisotropy();
                _texture2.anisotropy = threeWebGLrenderer.getMaxAnisotropy();
                _disp.wrapS = _disp.wrapT = THREE.RepeatWrapping;

                // three shader material
                threeShaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        effectFactor: {
                            type: "f",
                            value: opts.intensity
                        },
                        dispFactor: {
                            type: "f",
                            value: 0.0
                        },
                        texture: {
                            type: "t",
                            value: _texture1
                        },
                        texture2: {
                            type: "t",
                            value: _texture2
                        },
                        disp: {
                            type: "t",
                            value: _disp
                        }
                    },
                    vertexShader: VERTEXT,
                    fragmentShader: FRAGMENT,
                    transparent: true,
                    opacity: 1.0
                });

                var _geometry = new THREE.PlaneBufferGeometry(el.offsetWidth, el.offsetHeight, 1),
                    _meshObj = new THREE.Mesh(_geometry, threeShaderMaterial);

                threeScene.add(_meshObj);
            };

            build();

            var toggle = {
                on: function(){
                    TweenMax.to(threeShaderMaterial.uniforms.dispFactor, opts.speedIn, {
                        value: 0.5,
                        ease: opts.easing
                    });
                },
                off: function(){
                    TweenMax.to(threeShaderMaterial.uniforms.dispFactor, opts.speedOut, {
                        value: 0,
                        ease: opts.easing
                    });
                }
            };

            var addEvents = function() {
                if (opts.hover !== true) return false;
                var _isMobile = mobileAndTabletcheck();
                var evtIn = (_isMobile === true) ? 'touchstart' : 'mouseenter',
                    evtOut = (_isMobile === true) ? 'touchend' : 'mouseleave';

                toggle.on();

                // el.addEventListener(evtIn, function(e) {
                //     e.preventDefault();
                //     toggle.off();
                // });
                // el.addEventListener(evtOut, function(e) {
                //     e.preventDefault();
                //     toggle.on();
                // });
                $(el).on('in', function(){
                    toggle.off();
                });
                $(el).on('out', function(){
                    toggle.on();
                });
                window.addEventListener("resize", function(e) {
                    threeWebGLrenderer.setSize(el.offsetWidth, el.offsetHeight);
                });
            };

            addEvents();

            var doAnimate = function() {
                requestAnimationFrame(doAnimate);
                threeWebGLrenderer.render(threeScene, threeCamera);
            };

            doAnimate();

        }

        return {
            init: function(options){
                init(options);
            }
        }
    };

    $.hoverEffect = new HoverEffect();

})(window.jQuery);

$(function(){

});
