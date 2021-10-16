import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeGroupUI} from "./program/NodeGroupUI.js"
import {PathComponent,TextEditComponent} from "./ui/layouts/TwoComponents.js"

function defineOneNode(){
    // test codes
    let node = new Define.Node();
    node.addInputPort("In1","float",1.00);
    node.addInputPort("Input2","float",32);
    node.addInputPort("Input3","int",32);
    node.addOutputPort("Out1","float");
    node.addOutputPort("Output2","int");
    node.addOutputPort("Output3---","vert");
    return node;
}
export function mainProgramming() {
    let elem = document.getElementById('test');
    let params = { width: 100, height: 100 };
    var context = buildContext(elem,params);

    let rootDom = document.getElementById("windowProgramming");
    let rect = rootDom.getBoundingClientRect();
    context.width = rect.width;
    context.height = rect.height;
    window.addEventListener("resize",
    ()=>{
        let rect = rootDom.getBoundingClientRect();
        context.width = rect.width-10;
        context.height = rect.height-10;
        context.update();
    });

    
    let a = new Define.NodeGraph();
    let nodeGroupUI = new NodeGroupUI(context,a);
    let node1 = defineOneNode();
    nodeGroupUI.addNode(node1,100,200);
    let node2 = defineOneNode();
    nodeGroupUI.addNode(node2,200,233);
    let node3 = defineOneNode();
    nodeGroupUI.addNode(node3,210,400);

    
    context.width=600;
    console.log(nodeGroupUI);
    context.update();
}