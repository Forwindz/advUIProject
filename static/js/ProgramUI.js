import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeGroupUI} from "./program/NodeGroupUI.js"
import {PathComponent,TextEditComponent} from "./ui/layouts/TwoComponents.js"

function defineOneNode(){
    // test codes
    let node = new Define.Node();
    node.addInputPort("In1","float");
    node.addInputPort("Input2","float");
    node.addOutputPort("Out1","float");
    node.addOutputPort("Output2","int");
    node.addOutputPort("Output3---","vert");
    return node;
}
export function mainProgramming() {
    var elem = document.getElementById('test');
    let params = { width: 800, height: 800 };
    //params = { fullscreen:true };
    //var two = new Two(params).appendTo(elem);
    var context = buildContext(elem,params);
    
    let a = new Define.NodeGraph();
    let nodeGroupUI = new NodeGroupUI(context,a);
    let node1 = defineOneNode();
    nodeGroupUI.addNode(node1,100,200);
    let node2 = defineOneNode();
    nodeGroupUI.addNode(node2,200,233);
    let node3 = defineOneNode();
    nodeGroupUI.addNode(node3,210,400);

    let textEdit = new TextEditComponent(context);
    textEdit.rect.x=50;
    textEdit.rect.y=20;
    nodeGroupUI.nodeUIs[0].addObject(textEdit);
    //nodeGroupUI.addObject(textEdit);

    console.log(nodeGroupUI);
    context.update();
}