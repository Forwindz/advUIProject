import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior} from "../data/ProgramDefine.js";
import TwoComp from "../ui/layouts/TwoComponents.js"
import {RectComponent} from "../ui/layouts/TwoComponents.js"
import {NodeUI} from "./NodeUI.js"
import AttrManager from "../util/ValueChangeManager.js"

class NodeGroupUI extends RectComponent{
    
    #nodeUIs=[]; // a dictionary to store node UI Component
    data=null;
    constructor(_context, data){
        super(_context, null);
        this.initGroup();
        data.eventAddNode.add((source,params)=>this.addNodeUI(params));
        this.data=data;
        this.#generateUI();
    }


    #generateUI(){
        //TODO: add exists node
    }

    addNode(node,x=0,y=0){
        this.data.addNode(node);
        const posInfo = this.#nodeUIs[node.index].rect;
        posInfo.x =x;
        posInfo.y=y;
    }

    addNodeUI(node,x=0,y=0){
        // add node ui
        console.log("Add node");
        let nodeUI = new NodeUI(this.context,node);
        this.#nodeUIs[node.index] = nodeUI;
        nodeUI.uiData.rect.x=x;
        nodeUI.uiData.rect.y=y;
        this.addObject(nodeUI);
    }
}

export {NodeGroupUI};