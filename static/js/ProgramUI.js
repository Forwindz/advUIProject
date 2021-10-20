import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeGroupUI} from "./program/NodeGroupUI.js"
import {PathComponent,TextEditComponent} from "./ui/layouts/TwoComponents.js"
import {PanelDragInteraction} from "./interaction/PanelDrag.js"
import {PanelScaleInteraction} from "./interaction/PanelScale.js"
import AssetsUI from "./program/AssetsUI.js"
import {Asset, AssetLibrary} from "./data/AssetLibrary.js"

import AssetsPopHideInteraction from "./interaction/AssetPopHide.js"
import AssetSelect from "./interaction/AssetSelect.js"

export function mainProgramming() {
    let elem = document.getElementById('test');
    let rootDom = document.getElementById("windowProgramming");
    let rect = rootDom.getBoundingClientRect();
    let params = { width: rect.width, height: rect.height };
    var context = buildContext(elem,params);
    window.addEventListener("resize",
    ()=>{
        let rect = rootDom.getBoundingClientRect();
        context.width = rect.width-10;
        context.height = rect.height-10;
        context.update();
    });
    
    context.update();
    
    loadData(context);

    let svgDom = rootDom.firstElementChild;
    var drag = new PanelDragInteraction();
    drag.install(context,svgDom);

    var scale = new PanelScaleInteraction(context,svgDom);
    
    window.oncontextmenu=function(e){
        e.preventDefault();
    }
}

function defineOneNode(){
    // test codes
    let node = new Define.Node();
    node.addInputPort("In1","float",1.00);
    node.addInputPort("Input2","float",32);
    node.addInputPort("Input3","int");
    node.addOutputPort("Out1","float");
    node.addOutputPort("Output2","int");
    node.addOutputPort("Output3---","vert");
    return node;
}


function loadData(context){
    let a = new Define.NodeGraph();
    let nodeGroupUI = new NodeGroupUI(context,a);
    let node1 = defineOneNode();
    nodeGroupUI.addNode(node1,100,200);
    let node2 = defineOneNode();
    nodeGroupUI.addNode(node2,200,233);
    let node3 = defineOneNode();
    nodeGroupUI.addNode(node3,210,400);

    let lib = createAssets();
    let libUI = new AssetsUI(context,lib);
    nodeGroupUI.addObject(libUI);
    libUI.rect.x=400;
    libUI.rect.y=500;
    console.log(nodeGroupUI);
    context.update();

    let assetInteraction1 = new AssetsPopHideInteraction(libUI,nodeGroupUI);
    let assetInteraction2 = new AssetSelect(libUI,nodeGroupUI);

}

function createAssets(){
    let lib = new AssetLibrary();
    lib.addAsset(new Asset("Name1",defineOneNode));
    lib.addAsset(new Asset("Name2",defineOneNode));
    lib.addAsset(new Asset("Name3",defineOneNode));
    lib.addAsset(new Asset("Name4",defineOneNode));
    lib.addAsset(new Asset("Name5",defineOneNode));
    return lib;
}