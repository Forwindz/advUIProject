import Two from "./lib/two.js"
import * as Define from "./data/ProgramDefine.js"
import {buildContext} from "./ui/uiContext.js"
import {NodeUIControl} from "./program/ProgramUIData.js"
export function mainProgramming() {
    var elem = document.getElementById('test');
    let params = { width: 285, height: 200 };
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

    nodeUI = new NodeUIControl();
    nodeUI.context = context;
    nodeUI.generateRenderData();
    two.update();
    let a = new Define.NodeGraph();
    console.log(a);
}