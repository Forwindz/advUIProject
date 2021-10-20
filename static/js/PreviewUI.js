/*
    Three.js in project "AdvUI Project"
    Author: 
    Date: Octorber 2021 (three.js r132)
*/
'use strict'

import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import * as Define from "./data/ProgramDefine.js"
import * as Translator from "./Translator.js"
import { buildContext } from "./ui/uiContext.js"
import { ShareData, sd } from "./ProgramUI.js"

let vertexShaderText = " \
varying vec2 vUv; \
\
void main()\
{\
    vUv = uv;\
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
    gl_Position = projectionMatrix * mvPosition;\
}\
" ;

let fragmentShaderText1 = "\
uniform float time;\
\
varying vec2 vUv;\
\
void main( void ) {\
\
    vec2 position = vUv;\
\
    float color = 0.0;\
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );\
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );\
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );\
    color *= sin( time / 10.0 ) * 0.5;\
\
    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );\
\
}\
" ;

fragmentShaderText1 = "\
uniform float time;\
\
varying vec2 vUv;\
\
void main( void ) {\
\
    vec2 position = vUv;\
\
    float color = 0.0;\
    //color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );\
    //color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );\
    //color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );\
    //color *= sin( time / 10.0 ) * 0.5;\
\
    gl_FragColor = vec4( 0,0,0, 1.0 );\
\
}\
" ;

let fragmentShaderText2 = "\
\
uniform float time;\
\
varying vec2 vUv;\
\
void main( void ) {\
    \
    vec2 position = - 1.0 + 2.0 * vUv;\
    \
    float red = abs( sin( position.x * position.y + time / 5.0 ) );\
    float green = abs( sin( position.x * position.y + time / 4.0 ) );\
    float blue = abs( sin( position.x * position.y + time / 3.0 ) );\
    gl_FragColor = vec4( red, green, blue, 1.0 );\
    \
}\
"

let fragmentShaderText21 = "\
\
uniform float time;\
\
varying vec2 vUv;\
\
void main( void ) {\
    \
    vec2 position = - 1.0 + 2.0 * vUv;\
    gl_FragColor = vec4( "


let fragmentShaderText22 = ", 1.0 );}"

let stats;

let camera, scene, renderer, clock;

let uniforms1 = {
    "time": { value: 1.0 }
};
let uniforms2;

let canvasWidth, canvasHeight;

let params;

let times=0;

const geometrys = [
    new THREE.SphereGeometry(0.5, 64, 64),
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
]


function init() {
    times++;
    const container = document.getElementById('windowPreview');

    canvasWidth = container.offsetWidth;// remember using offset but not inner or client
    canvasHeight = container.offsetHeight;
    console.log(canvasWidth + "_" + canvasHeight + "and " + window.innerWidth + "_" + window.innerHeight);
    const aspect = canvasWidth / canvasHeight;

    camera = new THREE.PerspectiveCamera(40, aspect, 1, 3000);
    camera.position.z = 4;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    


    // uniforms2 = {
    //     "time": { value: 1.0 },
    //     "colorTexture": { value: new THREE.TextureLoader().load('textures/disturb.jpg') }
    // };
    // uniforms2["colorTexture"].value.wrapS = uniforms2["colorTexture"].value.wrapT = THREE.RepeatWrapping;

    params = [
        [fragmentShaderText1, uniforms1]
        //,[fragmentShaderText2, uniforms1]
    ];
    reinstall();
    renderer = new THREE.WebGLRenderer({ canvas: container.domElement, antialias: true });
    renderer.setPixelRatio(container.devicePixelRatio);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    onWindowResize();

    window.addEventListener('resize', onWindowResize);
}

let mesh1=null;

function removeScene(){
    scene.remove("test");
}

function reinstall(){
    //
    params = [
        [fragmentShaderText1, uniforms1]
        //,[fragmentShaderText2, uniforms1]
    ];
    let i=0;
    //for (let i = 0; i < params.length; i++) 
    {

        const material = new THREE.ShaderMaterial({

            uniforms: params[0][1],
            vertexShader: vertexShaderText,
            fragmentShader: params[0][0]

        });

        const mesh = new THREE.Mesh(geometrys[0], material);
        mesh.position.x = i - (params.length - 1) / 2;
        mesh.position.y = i % 2 - 0.5;
        mesh.name = "test";
        scene.add(mesh);
        mesh1=mesh;
    }
}

function onWindowResize() {
    canvasWidth = document.getElementById('windowPreview').offsetWidth;
    canvasHeight = document.getElementById('windowPreview').offsetHeight;

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasWidth, canvasHeight);

}
function animate() {

    requestAnimationFrame(animate);
    if(sd.updated && sd.globalStr!=""){
        console.log("Updated!");
        params[0] = [fragmentShaderText21+sd.globalStr+fragmentShaderText22, uniforms1];
        params[0][0] = params[0][0].split("<br>").join("").split("<div>").join("").split("</div>").join("")
        const material = new THREE.ShaderMaterial({

            uniforms: params[0][1],
            vertexShader: vertexShaderText,
            fragmentShader: params[0][0]

        });
        console.log(params[0]);
        mesh1.material=material;
        sd.markFalse();
    }
    
    

    render();
    stats.update();

}

function render() {

    const delta = clock.getDelta();

    uniforms1["time"].value += delta * 5;
    // uniforms2[ "time" ].value = clock.elapsedTime;

    for (let i = 0; i < scene.children.length; i++) {

        const object = scene.children[i];

        object.rotation.y += delta * 0.5 * (i % 2 ? 1 : - 1);
        object.rotation.x += delta * 0.5 * (i % 2 ? - 1 : 1);

    }

    renderer.render(scene, camera);

}


export {
    init,
    animate,
}