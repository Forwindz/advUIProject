// basically in this file we define all the types of nodes for calculation translation

import * as Define from "./data/ProgramDefine.js"


// define Node for "+" calculation
function ColorNode() {
    let node = new Define.Node();
    node.name = "RGBvalue";
    node.type = OPERATOR.COLOR;
    node.addInputPort("Red", "string", "float red =");
    node.addInputPort("Green", "string", "float green =");
    node.addInputPort("Blue", "string", "float blue =");
    node.addOutputPort("res=", "0.0");
    return node;
}

function ResultNode() {
    let node = new Define.Node();
    node.name = "Result";
    node.type = OPERATOR.OUT;
    node.addInputPort("Result", "string", "gl_FragColor = vec4( red, green, blue, 1.0 );");
    return node;
}

function InputNode(param) {
    let node = new Define.Node();
    node.name = "Input";
    node.type = OPERATOR.IN;
    node.addOutputPort("Output", param);
    return node;

}

function AbsNode() {
    let node = new Define.Node();
    node.name = "abs()";
    node.type = OPERATOR.ABS;
    node.addInputPort("input", "string", "abs(");
    node.addOutputPort("res=", "0.0")
    return node;
}

function SinNode() {
    let node = new Define.Node();
    node.name = "sin()";
    node.type = OPERATOR.SIN;
    node.addInputPort("input", "string", "sin(");
    node.addOutputPort("res=", "0.0")
    return node;
}

function DivideNode() {
    let node = new Define.Node();
    node.name = "\\";
    node.type = OPERATOR.DIVIDE;
    node.addInputPort("Input1", "string", "0.0");
    node.addInputPort("Input2", "string", "0.0");
    node.addOutputPort("res=", "0.0")
    return node;
}

function TimesNode() {
    let node = new Define.Node();
    node.name = "*";
    node.type = OPERATOR.TIMES;
    node.addInputPort("Input1", "string", "0.0");
    node.addInputPort("Input2", "string", "0.0");
    node.addOutputPort("res=", "0.0")
    return node;
}

function PlusNode() {
    let node = new Define.Node();
    node.name = "+";
    node.type = OPERATOR.PLUS;
    node.addInputPort("Input1", "string", "0.0");
    node.addInputPort("Input2", "string", "0.0");
    node.addOutputPort("res=", "0.0")
    return node;
}

const OPERATOR = {
    IN: 0,
    OUT: 1,
    COLOR: 2,
    PLUS: 3,
    MINUS: 4,
    TIMES: 5,
    DIVIDE: 6,
    SIN: 7,
    COS: 8,
    ABS: 9,
}


export {
    ColorNode,
    ResultNode,
    InputNode,
    SinNode,
    AbsNode,
    DivideNode,
    TimesNode,
    PlusNode,
    OPERATOR
}

