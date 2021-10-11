import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior} from "../data/ProgramDefine.js";
import TwoComp from "../ui/layouts/TwoComponents.js"
import {RectComponent} from "../ui/layouts/TwoComponents.js"
import {NodeUI} from "./NodeUI.js"
import AttrManager from "../util/ValueChangeManager.js"
import StateMachine from "javascript-state-machine";
import {dragStateMachine} from "../util/utils.js"
//https://github.com/jakesgordon/javascript-state-machine

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
        let posInfo = this.#nodeUIs[node.index].uiData.rect;
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

    /**
     * install interactions
     * Basic Interaction: (Left Mouse)
     *      Drag
     *      multi-Selection
     *      
     * For the whole panel:
     *      Drag
     *      deselect
     *      scale
     * 
     * @param {NodeUI} nodeUI 
     */
    installInteraction(nodeUI){
        let fsm = new StateMachine({
            init:'idle',
            transitions:[
                {name:"leftMouseDownItem",from:'idle',to:'selected'},
                {name:"leftMouseMove",from:'selected',to:'drag'},
                {name:"leftMouseUp",from:'drag',to:'selected'},
                {name:"cancelSelect",from:'selected',to:'idle'}
            ]
        });
        fsm.observe({
            onidle:function(){},
            onleftDown:function(){},
            ondrag:function(){}
        }
        );
    }

    processLeftMouseDown(){
        
    }
}

export {NodeGroupUI};