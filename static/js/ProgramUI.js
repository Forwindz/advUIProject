import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeUIControl} from "./program/ProgramUIData.js"

function defineOneNode(){
    // test codes
    let node = new Define.Node();
    node.addInputPort("In1","float");
    node.addInputPort("Input2","float");
    node.addOutputPort("Out1","float");
    node.addOutputPort("Output2","int");
    return node;
}
export function mainProgramming() {
    var elem = document.getElementById('test');
    let params = { width: 800, height: 800 };
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
    let node1 = defineOneNode();
    a.addNode(node1);
    let nodeUI = new NodeUIControl(context);
    nodeUI.rawData=node1;
    console.log(nodeUI);
    nodeUI.generateRenderData();
    context.update();
}