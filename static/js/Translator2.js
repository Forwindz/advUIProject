import { Asset, AssetLibrary } from "./data/AssetLibrary";
import { Node, Port, InputPort, OutputPort, NodeGraph } from "./data/ProgramDefine";


class StrNode extends Node {
    updateTag = -1;

    constructor() {
        super();
    }

    translate(updateTag) {
        this.updateTag = updateTag;
    }

    getPortStr(name, updateTag) {
        console.log("GetPort " + this.name + " | " + name + " > " + updateTag);
        let port = this.inputPorts[name];
        console.log(this);
        if (port.connectInfo.length == 0) {
            if (port.defaultValue) {
                return port.defaultValue;
            } else {
                return "0";
            }
        } else {
            let c = port.connectInfo[0];
            if (c.outputNode.updateTag != updateTag) {
                c.outputNode.translate(updateTag);
            }
            return c.outputPort.tc;
        }
    }

    setPortStr(name, s) {
        console.log("SetPort " + this.name + " | " + name + " > " + s);
        console.log(this.outputPorts);
        this.outputPorts[name].tc = "(" + s + ")";
    }
}

class AddNode extends StrNode {

    defineNode() {
        this.name = "Add +";
        this.addInputPort("Var1", "", "0");
        this.addInputPort("Var2", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            this.getPortStr("Var1", t) + "+" + this.getPortStr("Var2", t)
        );
        super.translate(t);
    }
}


class SubNode extends StrNode {

    defineNode() {
        this.name = "Sub -";
        this.addInputPort("Minute", "", "0");
        this.addInputPort("- Minus", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            this.getPortStr("Minute", t) + "-" + this.getPortStr("Minus", t)
        );
        super.translate(t);
    }
}

class MulNode extends StrNode {

    defineNode() {
        this.name = "Multiply *";
        this.addInputPort("Var1", "", "0");
        this.addInputPort("Var2", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            this.getPortStr("Var1", t) + "*" + this.getPortStr("Var2", t)
        );
        super.translate(t);
    }
}

class DivNode extends StrNode {

    defineNode() {
        this.name = "Division /";
        this.addInputPort("Dividend", "", "0");
        this.addInputPort("/ Divisor", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            this.getPortStr("Dividend", t) + "/" + this.getPortStr("Divisor", t)
        );
        super.translate(t);
    }
}

class SinNode extends StrNode {

    defineNode() {
        this.name = "Sin ()";
        this.addInputPort("theta", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            "sin(" + this.getPortStr("theta", t) + ")"
        );
        super.translate(t);
    }
}

class CosNode extends StrNode {

    defineNode() {
        this.name = "Cos ()";
        this.addInputPort("theta", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            "cos(" + this.getPortStr("theta", t) + ")"
        );
        super.translate(t);
    }
}

class NumNode extends StrNode {

    defineNode() {
        this.name = "Number Input";
        this.addInputPort("Input", "", "0");
        this.addOutputPort("Output", "");
    }

    translate(t) {
        this.setPortStr("Output",
            this.getPortStr("Input", t)
        );
        super.translate(t);
    }
}


class UniformTimeNode extends StrNode {

    defineNode() {
        this.name = "Uniform Time";
        this.addOutputPort("Time", "");
    }

    translate(t) {
        this.setPortStr("Time", "time");
        super.translate(t);
    }
}

class UniformPosNode extends StrNode {

    defineNode() {
        this.name = "Uniform Position";
        this.addOutputPort("Position X", "");
        this.addOutputPort("Position Y", "");
    }

    translate(t) {
        this.setPortStr("Position X", "position.x");
        this.setPortStr("Position Y", "position.y");
        super.translate(t);
    }
}

class FinalOutputNode extends StrNode {
    defineNode() {
        this.name = "Output Color";
        this.addInputPort("RGB", "");
    }

    beginTranslate(t) {
        return this.getPortStr("RGB", t);
    }

    translate(t) {
        super.translate(t);
    }
}

class SplitRGBNode extends StrNode {

    defineNode() {
        this.name = "Split RGB";
        this.addInputPort("RGB", "", "vec3(0,0,0)");
        this.addOutputPort("R", "");
        this.addOutputPort("G", "");
        this.addOutputPort("B", "");
    }

    translate(t) {
        this.setPortStr("R", this.getPortStr("RGB", t) + ".r");
        this.setPortStr("G", this.getPortStr("RGB", t) + ".g");
        this.setPortStr("B", this.getPortStr("RGB", t) + ".b");
        super.translate(t);
    }
}

class UnionRGBNode extends StrNode {

    defineNode() {
        this.name = "Reform RGB";
        this.addOutputPort("RGB", "");
        this.addInputPort("R", "", "0");
        this.addInputPort("G", "", "0");
        this.addInputPort("B", "", "0");
    }

    translate(t) {
        this.setPortStr("RGB",
            "vec3(" + this.getPortStr("R", t) + "," + this.getPortStr("G", t) + "," + this.getPortStr("B", t) + ")"
        );
        super.translate(t);
    }
}


function genAssets() {
    let types = [
        AddNode, SubNode, MulNode, DivNode, UniformTimeNode, UniformPosNode, FinalOutputNode, SplitRGBNode, UnionRGBNode, CosNode, SinNode, NumNode
    ]
    let lib = new AssetLibrary();
    for (let tp of types) {
        let func = () => { return new tp; };
        let a = new Asset(tp.name, func);
        lib.addAsset(a);
    }
    return lib;
}

export {
    genAssets,
    AddNode, SubNode, MulNode, DivNode, UniformTimeNode, UniformPosNode, FinalOutputNode, SplitRGBNode, UnionRGBNode, CosNode, SinNode, NumNode
}