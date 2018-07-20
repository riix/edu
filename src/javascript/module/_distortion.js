// <div id="unitPic" class="js-displace pic identity-wrap" data-displace-to="../resources/img/custom/elstyle_01.jpg" data-displace-texture="../resources/img/module/distortion_727x540.png">
//     <div class="js-color-mask mask-exit idx-1">
//         <img src="../resources/img/custom/brand_unit.jpg" alt="" class="js-color-mask-el" />
//     </div>
// </div>

var hoverEffect = function(_options) {

    if ($('html').hasClass('ie')) return false;

    var _defaults = {
        el: document.getElementsByClassName('js-displace')[0],
        imageFrom: null,
        imageTo: '../resources/img/custom/brand_visual_2.jpg',
        displaceImage: '../resources/img/module/displace.png',
        hover: true,
        intensity1: 0.05, // 1
        intensity2: 0.05, // 1
        angle1: Math.PI / 4,
        angle2: Math.PI / 2,
        speedIn: 1.6,
        speedOut: 1.2,
        easing: Expo.easeOut
    };

    var opts = $.extend({}, _defaults, _options);

    var $el = opts.el;
    var el = $el[0];

    if (opts.imageFrom === null) {
        opts.imageFrom = $el.find('img').attr('src');
    }

    // var vertex = `
    //     varying vec2 vUv;
    //     void main() {
    //       vUv = uv;
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //     }
    // `;

    var vertex = '';
    vertex += '        varying vec2 vUv;';
    vertex += '        void main() {';
    vertex += '          vUv = uv;';
    vertex += '          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );';
    vertex += '        }';

    var fragment = '';
    fragment += 'varying vec2 vUv;';
    fragment += '';
    fragment += 'uniform float dispFactor;';
    fragment += 'uniform sampler2D disp;';
    fragment += '';
    fragment += 'uniform sampler2D texture1;';
    fragment += 'uniform sampler2D texture2;';
    fragment += 'uniform float angle1;';
    fragment += 'uniform float angle2;';
    fragment += 'uniform float intensity1;';
    fragment += 'uniform float intensity2;';
    fragment += '';
    fragment += 'mat2 getRotM(float angle) {';
    fragment += '   float s = sin(angle);';
    fragment += '   float c = cos(angle);';
    fragment += '   return mat2(c, -s, s, c);';
    fragment += '}';
    fragment += '';
    fragment += 'void main() {';
    fragment += ' vec4 disp = texture2D(disp, vUv);';
    fragment += ' vec2 dispVec = vec2(disp.r, disp.g);';
    fragment += ' vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;';
    fragment += ' vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);';
    fragment += ' vec4 _texture1 = texture2D(texture1, distortedPosition1);';
    fragment += ' vec4 _texture2 = texture2D(texture2, distortedPosition2);';
    fragment += ' gl_FragColor = mix(_texture1, _texture2, dispFactor);';
    fragment += '}';

    var THREE = window.THREE;

    if (!el) {
        console.warn('Parent missing');
        return;
    }

    if (!(opts.imageFrom && opts.imageTo && opts.displaceImage)) {
        console.warn('One or more images are missing');
        return;
    }
    /////////////////////
    var base = {
        scene: null,
        camera: null,
        renderer: null,
        loader: null,
        texture1: null,
        texture2: null,
        disp: null,
        material: null,
        geometry: null,
        meshObj: null
    };

    ///////////////////// three scene and camera
    base.scene = new THREE.Scene();
    base.camera = new THREE.OrthographicCamera(
        el.offsetWidth / -2,
        el.offsetWidth / 2,
        el.offsetHeight / 2,
        el.offsetHeight / -2,
        1,
        1000
    );
    base.camera.position.z = 1;

    var doRender = function() { // This will be called by the TextureLoader as well as TweenMax.
        if (typeof base.renderer !== 'object') return false;
        base.renderer.render(base.scene, base.camera);
    };

    ///////////////////// renderer and loader

    // three renderer
    base.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false
    });
    base.renderer.setPixelRatio(window.devicePixelRatio);
    base.renderer.setClearColor(0xffffff, 0.0);
    base.renderer.setSize(el.offsetWidth, el.offsetHeight);

    // threeloader
    base.loader = new THREE.TextureLoader();
    base.loader.crossOrigin = '';

    ///////////////////// three texture and disp

    // three texture
    base.texture1 = base.loader.load(opts.imageFrom, doRender);
    base.texture2 = base.loader.load(opts.imageTo, doRender);
    base.texture1.magFilter = base.texture2.magFilter = THREE.LinearFilter;
    base.texture1.minFilter = base.texture2.minFilter = THREE.LinearFilter;

    // three disp
    base.disp = base.loader.load(opts.displaceImage, doRender);
    base.disp.wrapS = base.disp.wrapT = THREE.RepeatWrapping;

    ///////////////////// three scene (geometry, material)
    var _shaderMaterial = {
        uniforms: {
            intensity1: {
                type: 'f',
                value: opts.intensity1
            },
            intensity2: {
                type: 'f',
                value: opts.intensity2
            },
            angle1: {
                type: 'f',
                value: opts.angle1
            },
            angle2: {
                type: 'f',
                value: opts.angle2
            },
            dispFactor: {
                type: 'f',
                value: 0.0
            },
            texture1: {
                type: 't',
                value: base.texture1
            },
            texture2: {
                type: 't',
                value: base.texture2
            },
            disp: {
                type: 't',
                value: base.disp
            },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        // transel: true,
        opacity: 1.0
    };

    base.material = new THREE.ShaderMaterial(_shaderMaterial);
    base.geometry = new THREE.PlaneBufferGeometry(el.offsetWidth, el.offsetHeight, 1);
    base.meshObj = new THREE.Mesh(base.geometry, base.material);

    base.scene.add(base.meshObj);

    // el.appendChild(base.renderer.domElement);
    var $canvas = $(base.renderer.domElement);
    $canvas.css({
        'position': 'absolute',
        'top': 0,
        'left': 0
    });
    $el.append($canvas);
    $el.addClass('init-displace');

    var transitionIn = function() {
        TweenMax.to(base.material.uniforms.dispFactor, opts.speedIn, {
            value: 1,
            ease: opts.easing,
            onUpdate: doRender,
            onComplete: doRender
        });
    };

    var transitionOut = function() {
        TweenMax.to(base.material.uniforms.dispFactor, opts.speedOut, {
            value: 0,
            ease: opts.easing,
            onUpdate: doRender,
            onComplete: doRender
        });
    };

    if (opts.hover === true) {
        el.addEventListener('mouseenter', transitionIn);
        el.addEventListener('touchstart', transitionIn);
        el.addEventListener('mouseleave', transitionOut);
        el.addEventListener('touchend', transitionOut);
    }

    window.addEventListener('resize', function(e) {
        base.renderer.setSize(el.offsetWidth, el.offsetHeight);
    });

    this.next = transitionIn;
    this.previous = transitionOut;
};
