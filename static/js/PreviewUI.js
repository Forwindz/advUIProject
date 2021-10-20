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

let stats;

let camera, scene, renderer, clock;

let uniforms1, uniforms2;

let canvasWidth, canvasHeight;


function init() {
    const container = document.getElementById('windowPreview');

    canvasWidth = container.offsetWidth;// remember using offset but not inner or client
    canvasHeight = container.offsetHeight;
    console.log(canvasWidth + "_" + canvasHeight + "and " + window.innerWidth + "_" + window.innerHeight);
    const aspect = canvasWidth / canvasHeight;

    camera = new THREE.PerspectiveCamera(40, aspect, 1, 3000);
    camera.position.z = 4;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const geometrys = [
        new THREE.SphereGeometry(0.5, 64, 64),
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
    ]


    uniforms1 = {
        "time": { value: 1.0 }
    };

    // uniforms2 = {
    //     "time": { value: 1.0 },
    //     "colorTexture": { value: new THREE.TextureLoader().load('textures/disturb.jpg') }
    // };
    // uniforms2["colorTexture"].value.wrapS = uniforms2["colorTexture"].value.wrapT = THREE.RepeatWrapping;

    const params = [
        [fragmentShaderText1, uniforms1],
        [fragmentShaderText2, uniforms1]
    ];

    for (let i = 0; i < params.length; i++) {

        const material = new THREE.ShaderMaterial({

            uniforms: params[i][1],
            vertexShader: vertexShaderText,
            fragmentShader: params[i][0]

        });

        const mesh = new THREE.Mesh(geometrys[i], material);
        mesh.position.x = i - (params.length - 1) / 2;
        mesh.position.y = i % 2 - 0.5;
        scene.add(mesh);

    }

    renderer = new THREE.WebGLRenderer({ canvas: container.domElement, antialias: true });
    renderer.setPixelRatio(container.devicePixelRatio);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    onWindowResize();

    window.addEventListener('resize', onWindowResize);


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



function test() {
    let elem = document.getElementById('test');
    let rootDom = document.getElementById("windowProgramming");
    let rect = rootDom.getBoundingClientRect();
    let params = { width: rect.width, height: rect.height };
    var context = buildContext(elem, params);

    const globalGraph = new Define.NodeGraph();
    globalGraph.addNode(Translator.ResultNode());
    globalGraph.addNode(Translator.ColorNode());
    globalGraph.addNode(Translator.AbsNode())
    globalGraph.addNode(Translator.SinNode());
    globalGraph.addNode(Translator.PlusNode());
    globalGraph.addNode(Translator.TimesNode());
    globalGraph.addNode(Translator.TimesNode());
    globalGraph.addNode(Translator.InputNode("time"));
    globalGraph.addNode(Translator.InputNode("5.0"));
    globalGraph.addNode(Translator.InputNode("position.y"));
    globalGraph.addNode(Translator.InputNode("position.x"));

    console.log("Nodes loaded");
    // Output Text
    let text = [];
    let count = 0;
    for (let no of globalGraph.getNodes()) {

        let op = no.getType();
        switch (op) {
            case 0: { //IN
                let t = no.outputPorts["Output"].defaultValue;
                console.log(t);
                console.log(text);
                break;
            }
            case 1: { //Out
                console.log(no.inputPorts);
                text[count] = no.inputPorts["Result"].defaultValue;
                count++;
                console.log(text[count]);
                break;
            }
            case 2: { //Color
                text = no.inputPorts["Red"].defaultValue + text + ";";
                console.log(text);
                break;
            }
            case 3: { // PLUS
                let t = no.inputPorts["Input1"].defaultValue + " + " + no.inputPorts["Input2"].defaultValue;
                console.log(t);
                console.log(text);
                break;
            }
            case 4: { // MINUS
                console.log(no.inputPorts);
                let t = no.inputPorts["Input1"].defaultValue + " - " + no.inputPorts["Input2"].defaultValue;
                console.log(t);
                console.log(text);
                break;
            }
            case 5: { // TIMES
                let t = no.inputPorts["Input1"].defaultValue + " * " + no.inputPorts["Input2"].defaultValue;
                console.log(t);
                console.log(text);
                break;
            }
            case 6: { // DIVIDE
                let t = no.inputPorts["Input1"].defaultValue + " // " + no.inputPorts["Input2"].defaultValue;
                console.log(t);
                console.log(text);
                break;
            }
            case 7: { // SIN
                let t = "sin(" + no.inputPorts["input"].defaultValue + ")";
                console.log(t);
                console.log(text);
                break;
            }
            case 8: { // COS
                text = "cos(" + no.inputPorts["input"].defaultValue + ")";
                console.log(text);
                break;
            }
            case 9: { // ABS
                let t = "abs(" + no.inputPorts["input"].defaultValue + ")";
                text = t;
                console.log(text);
                break;
            }

        }

    }

    context.update();
    console.log(text);


}


export {
    init,
    animate,
    test
}
