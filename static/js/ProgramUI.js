import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import { buildContext } from "./ui/uiContext.js"
import { NodeGroupUI } from "./program/NodeGroupUI.js"
import { PathComponent, TextEditComponent } from "./ui/layouts/TwoComponents.js"
import { PanelDragInteraction } from "./interaction/PanelDrag.js"
import { PanelScaleInteraction } from "./interaction/PanelScale.js"
import AssetsUI from "./program/AssetsUI.js"
import { Asset, AssetLibrary } from "./data/AssetLibrary.js"

import AssetsPopHideInteraction from "./interaction/AssetPopHide.js"
import AssetSelect from "./interaction/AssetSelect.js"

import { genAssets, UniformTimeNode, UniformPosNode, FinalOutputNode } from "./Translator2.js"



export function mainProgramming() {
    let elem = document.getElementById('test');
    let rootDom = document.getElementById("windowProgramming");
    let rect = rootDom.getBoundingClientRect();
    let params = { width: rect.width, height: rect.height };
    var context = buildContext(elem, params);
    window.addEventListener("resize",
        () => {
            let rect = rootDom.getBoundingClientRect();
            context.width = rect.width - 10;
            context.height = rect.height - 10;
            context.update();
        });

    context.update();

    loadData(context);

    let svgDom = rootDom.firstElementChild;
    var drag = new PanelDragInteraction();
    drag.install(context, svgDom);

    var scale = new PanelScaleInteraction(context, svgDom);

    window.oncontextmenu = function (e) {
        e.preventDefault();
    }
}

function defineOneNode() {
    // test codes
    let node = new Define.Node();
    node.addInputPort("In1", "float", 1.00);
    node.addInputPort("Input2", "float", 32);
    node.addInputPort("Input3", "int");
    node.addOutputPort("Out1", "float");
    node.addOutputPort("Output2", "int");
    node.addOutputPort("Output3---", "vert");
    return node;
}

var times = 0;

function loadData(context) {
    let nodeGroup = new Define.NodeGraph();
    let nodeGroupUI = new NodeGroupUI(context, nodeGroup);
    //let node1 = defineOneNode();
    //nodeGroupUI.addNode(node1,100,200);
    //let node2 = defineOneNode();
    //nodeGroupUI.addNode(node2,200,233);
    //let node3 = defineOneNode();
    //nodeGroupUI.addNode(node3,210,400);
    let node1 = new UniformTimeNode();
    let node2 = new UniformPosNode();
    let node3 = new FinalOutputNode();
    nodeGroupUI.addNode(node1, 100, 200);
    nodeGroupUI.addNode(node2, 100, 400);
    nodeGroupUI.addNode(node3, 500, 300);
    let lib = createAssets();
    let libUI = new AssetsUI(context, lib);
    nodeGroupUI.addObject(libUI);
    libUI.rect.x = 400;
    libUI.rect.y = 500;
    console.log(nodeGroupUI);
    context.update();


    let f = () => { compile(nodeGroup, times); times++; };
    nodeGroup.eventAddNode.add(f);
    nodeGroup.eventRemoveNodeAfter.add(f);
    nodeGroup.eventConnectNode.add(f);
    nodeGroup.eventDisconnectNode.add(f);

    let assetInteraction1 = new AssetsPopHideInteraction(libUI, nodeGroupUI);
    let assetInteraction2 = new AssetSelect(libUI, nodeGroupUI);
}

class ShareData{
    updated = false;
    globalStr="";
    markFalse(){
        this.updated=false;
    }
}

var sd = new ShareData();

function compile(nodeGraph, t) {
    let fnode = null;
    console.log("Compile " + t);
    for (const node of nodeGraph.nodes) {
        if (node instanceof FinalOutputNode) {
            fnode = node;
            break;
        }
    }
    if (!fnode) {
        return;
    }
    let s = fnode.beginTranslate(t);
    console.log(s);

    sd.globalStr = s;
    sd.updated=true;
}

function createAssets() {
    let lib = genAssets();
    //lib.addAsset(new Asset("Name1",defineOneNode));
    //lib.addAsset(new Asset("Name2",defineOneNode));
    //lib.addAsset(new Asset("Name3",defineOneNode));
    //lib.addAsset(new Asset("Name4",defineOneNode));
    //lib.addAsset(new Asset("Name5",defineOneNode));
    return lib;
}

export {
    ShareData,sd
}
