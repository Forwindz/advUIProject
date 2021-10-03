import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeGroupUI} from "./program/NodeGroupUI.js"

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
/*
    var circle = two.makeCircle(72, 100, 50);
    var rect = two.makeRectangle(213, 100, 100, 100);
    
    // The object returned has many stylable properties:
    circle.fill = '#FF8000';
    circle.stroke = 'orangered'; // Accepts all valid css color
    circle.linewidth = 5;
    
    rect.fill = 'rgb(0, 200, 255)';
    rect.opacity = 0.75;
    rect.noStroke();
    */
    // Don't forget to tell two to render everything
    // to the screen
    
    let a = new Define.NodeGraph();
    let nodeGroupUI = new NodeGroupUI(context,a);
    let node1 = defineOneNode();
    nodeGroupUI.addNode(node1,100,200);
    let node2 = defineOneNode();
    nodeGroupUI.addNode(node2,200,233);
    let node3 = defineOneNode();
    nodeGroupUI.addNode(node3,210,400);

    console.log(nodeGroupUI);
    context.update();
}