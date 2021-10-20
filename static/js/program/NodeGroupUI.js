import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior} from "../data/ProgramDefine.js";
import TwoComp from "../ui/layouts/TwoComponents.js"
import {RectComponent} from "../ui/layouts/TwoComponents.js"
import {NodeUI} from "./NodeUI.js"
import AttrManager from "../util/ValueChangeManager.js"
import StateMachine from "javascript-state-machine";
import PortDrag from "../interaction/PortDrag.js"
import EventPublisher from "../util/Events.js";
import Two from "../lib/two.js";
import {removeArrayValue} from "../util/utils.js"
import AltDelete from "../interaction/AltDelete.js";

//https://github.com/jakesgordon/javascript-state-machine

class NodeGroupUI extends RectComponent{
    
    nodeUIs=[]; // a dictionary to store node UI Component
    data=null;
    portDragInteraction = new PortDrag();
    newNodeUIEvent = new EventPublisher();
    altDeleteInteraction = new AltDelete(this);
    connectionUIs = {};

    constructor(_context, data){
        super(_context, null);
        this.initGroup();
        data.eventAddNode.add((source,params)=>this.addNodeUI(params));
        data.eventRemoveNode.add((source,params)=>this.removeNodeUI(params));
        this.data=data;
        this.#generateUI();
        this.doAfterUpdateDom(()=>{
            if(!this.shapeDom){
                return;
            }
            this.portDragInteraction.install(this);
        });
        
    }


    #generateUI(){
        //TODO: add exists node
    }

    addNode(node,x=0,y=0){
        this.data.addNode(node);
        let posInfo = this.nodeUIs[node.index].uiData.rect;
        posInfo.x =x;
        posInfo.y=y;
    }

    addConnectionUI(connectionUI){
        this.connectionUIs[connectionUI.connectionData.toString()]=connectionUI;
    }

    addNodeUI(node,x=0,y=0){
        // add node ui
        console.log("Add node");
        let nodeUI = new NodeUI(this.context,node);
        this.addObject(nodeUI);
        this.nodeUIs[node.index] = nodeUI;
        nodeUI.uiData.rect.x=x;
        nodeUI.uiData.rect.y=y;
        this.altDeleteInteraction.install(nodeUI);
        this.newNodeUIEvent.notify(this,nodeUI);
    }

    removeNode(node){
        this.data.removeNode(node);
    }

    removeNodeUI(node){
        console.log("Remove node");
        let connections = node.getAllConnections();
        for(const c of connections){
            let cui = this.connectionUIs[c.toString()];
            cui.removeFromScene();
        }
        let nodeUI=this.nodeUIs[node.index];
        delete this.nodeUIs[node.index];
        nodeUI.removeFromScene();
        this.update();
    }

    getNodeUI(node){
        return this.nodeUIs[node.index];
    }

    getInputPortUIIcon(node,port){
        return this.nodeUIs[node.index].getInputPortUIIcon(port);
    }

    getOutputPortUIIcon(node,port){
        return this.nodeUIs[node.index].getOutputPortUIIcon(port);
    }

    getPortUIIcon(node,port){
        return this.nodeUIs[node.index].getPortUIIcon(port);
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
}

export {NodeGroupUI};