import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeGroupUI} from "./program/NodeGroupUI.js"
import {PathComponent} from "./ui/layouts/TwoComponents.js"

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

    let points = []
    points.push(new Two.Vector(0,0));
    points.push(new Two.Vector(0,50));
    points.push(new Two.Vector(50,0));
    points.push(new Two.Vector(100,100));
    points.push(new Two.Vector(300,500));
    points.push(new Two.Vector(700,600));
    //let curve = new PathComponent(context,points);
    //context.add(curve.shape);
    console.log(nodeGroupUI);
    context.update();
}