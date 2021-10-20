import StateMachine from "javascript-state-machine";
import {PathComponent} from "../ui/layouts/TwoComponents.js";
import EventPublisher from "../util/Events.js"
import ConnectionUI from "../program/ConnectionUI.js"
import {InputPort} from "../data/ProgramDefine.js"
import { removeArrayValue } from "../util/utils.js";
function createPortDragStateMachine(){
    let fsm = new StateMachine({
        init:'idle',
        data:{
            mouseEventData:null,
            lastDownPort:null,
            lastDownNode:null,
            lastUpPort:null,
            lastUpNode:null
        },
        transitions:[
            {name:"leftMouseDown",from:'idle',to:'selected'},
            {name:"leftMouseDown",from:'drag',to:'selected'},

            {name:"leftMouseDownExist",from:'idle',to:'selectedExist'}, //exist line
            {name:"leftMouseMove",from:'selectedExist',to:'dragExist'},
            {name:"leftMouseMove",from:'dragExist',to:'dragExist'},
            {name:"leftMouseUp",from:'selectedExist',to:'idle'},
            {name:"leftMouseUp",from:'dragExist',to:'idle'},
            {name:"leftMouseUpOutside",from:'dragExist',to:'idle'},

            {name:"leftMouseMove",from:'selected',to:'drag'},
            {name:"leftMouseMove",from:'drag',to:'drag'},
            {name:"leftMouseMove",from:'idle',to:'idle'},
            {name:"leftMouseUp",from:'drag',to:'idle'},
            {name:"leftMouseUp",from:'selected',to:'idle'},
            {name:"leftMouseUp",from:'idle',to:'idle'},
            {name:"leftMouseUpOutside",from:'drag',to:'idle'},
            {name:"leftMouseUpOutside",from:'selected',to:'idle'},
            {name:"leftMouseUpOutside",from:'idle',to:'idle'}
        ]
    });
    return fsm;
}

class PortDrag{
    fsm;
    panel; //reference to node group ui
    constructor(){
        this.fsm = createPortDragStateMachine();
        this.fsm.observe({
            onEnterDrag:()=>this.onEnterDrag(),
            onEnterDragExist:()=>this.onEnterDragExist(),
            onLeaveDrag:()=>this.onCompleteDrag(),
            onLeaveDragExist:()=>this.onCompleteDragExist(),
            onLeftMouseMove:()=>this.onKeepDraging()
        });
    }

    #installPort(node,port){
        let portDom = port.portIconUI.shapeDom;
        
        if(portDom==null){
            port.portIconUI.updateDom();
            portDom = port.portIconUI.shapeDom;
        }
        portDom.addEventListener("mousedown",(e)=>{
            this.fsm.mouseEventData = e;
            this.fsm.lastDownPort = port;
            this.fsm.lastDownNode = node;
            this.fsm.lastUpPort = null;
            this.fsm.lastUpNode = null;
            let portd = port.portData;
            if(portd instanceof InputPort && portd.connectInfo.length>0){
                this.fsm.leftMouseDownExist();
            }else{
                this.fsm.leftMouseDown();
            }
            e.stopPropagation();//avoid pass to node & panel, own the focus
        },true);
        portDom.addEventListener("mouseup",(e)=>{
            this.fsm.mouseEventData = e;
            this.fsm.lastUpPort = port;
            this.fsm.lastUpNode = node;
            this.fsm.leftMouseUp();
        });
        portDom.addEventListener("mousemove",(e)=>{
            this.onMouseMove(e)
        });
    }

    installNode(nodeUI){
        for(const portUI of Object.values(nodeUI.inputPortUIs)){
            this.#installPort(nodeUI,portUI);
        }
        for(const portUI of Object.values(nodeUI.outputPortUIs)){
            this.#installPort(nodeUI,portUI);
        }
        nodeUI.shapeDom.addEventListener("mousemove",(e)=>this.onMouseMove(e));
        nodeUI.shapeDom.addEventListener("mouseup",(e)=>{
            this.onLeftMouseUpOutside(e);
        });
    }

    // input NodeGraphUI
    install(panel){
        let mdom=document;//panel.shapeDom;
        
        mdom.addEventListener("mouseup",(e)=>{
            this.onLeftMouseUpOutside(e);
        });

        mdom.addEventListener("mousemove",(e)=>this.onMouseMove(e),false);

        this.panel=panel;
        panel.newNodeUIEvent.add((source,nodeUI)=>this.onAddNode(source,nodeUI));
    }

    onMouseMove(e){
        this.fsm.mouseEventData = e;
        this.fsm.leftMouseMove();
    }

    onAddNode(panel,nodeUI){
        nodeUI.doAfterUpdateDom(
            ()=>this.installNode(nodeUI)
            );
    }

    newline = null;
    #lastSelectLineEnd = 0;
    #lastConnectionData = null;
    onEnterDrag(){
        this.newline = new ConnectionUI(this.panel.context);
        this.newline.panelUI=this.panel;
        this.newline.setFirstPort(this.fsm.lastDownNode,this.fsm.lastDownPort);
        this.panel.addObject(this.newline);
    }

    onEnterDragExist(){
        let port = this.fsm.lastDownPort.portData;
        this.fsm.lastDownPort.isConnected=false;
        let data = port.connectInfo[0];
        let line = this.panel.connectionUIs[data.toString()];
        this.newline = line;
        this.#lastSelectLineEnd = line.unbindPort(port);
        port.connectInfo = port.connectInfo.splice(0,1);
        delete this.panel.connectionUIs[data.toString()];
        this.panel.data.removeConnection(data);
        this.#lastConnectionData =data;
        console.log(this.#lastSelectLineEnd)
    }

    // The library does not support loop transition :(
    onKeepDraging(){
        if(this.fsm.state=="drag"){
            let absPos = this.panel.getAbsoluteDomPos();
            let x = (this.fsm.mouseEventData.clientX-absPos.x)/this.scale-1;
            let y = (this.fsm.mouseEventData.clientY-absPos.y)/this.scale-1;
            this.newline.setPoint(1,x,y);
        }else if(this.fsm.state=="dragExist"){
            let absPos = this.panel.getAbsoluteDomPos();
            let x = (this.fsm.mouseEventData.clientX-absPos.x)/this.scale-1;
            let y = (this.fsm.mouseEventData.clientY-absPos.y)/this.scale-1;
            this.newline.setPoint(this.#lastSelectLineEnd,x,y);
        }
    }

    onCompleteDrag(){
        let r=null;
        if(this.fsm.lastDownPort&&this.fsm.lastDownNode&&this.fsm.lastUpPort&&this.fsm.lastUpNode){
            r = this.panel.data.addConnectionNoOrder(
                this.fsm.lastDownPort.portData,
                this.fsm.lastDownNode.nodeData,
                this.fsm.lastUpPort.portData,
                this.fsm.lastUpNode.nodeData,
                );
            
        }
        if(r){
            this.newline.setLastPort(this.fsm.lastUpNode,this.fsm.lastUpPort);
            this.newline.connectionData = r;
            this.panel.addConnectionUI(this.newline);
            console.log("Connected");
        }else{
            this.#removeCurrentLine();
            console.log("Failed Connection");
        }
        this.fsm.lastUpPort=this.fsm.lastUpNode = null;
        this.newline=null;
    }

    onCompleteDragExist(){
        let r=null;
        
        if(this.fsm.lastUpPort&&this.fsm.lastUpNode){
            r = this.panel.data.addConnectionNoOrder(
                this.#lastConnectionData.outputPort,
                this.#lastConnectionData.outputNode,
                this.fsm.lastUpPort.portData,
                this.fsm.lastUpNode.nodeData,
                );
            
        }
        if(r){
            this.newline.setPort(this.#lastSelectLineEnd, this.fsm.lastUpNode,this.fsm.lastUpPort);
            this.newline.connectionData = r;
            this.panel.addConnectionUI(this.newline);
            console.log("Connected");
        }else{
            this.#removeCurrentLine();
            console.log("Failed Connection");
        }
        this.fsm.lastUpPort=this.fsm.lastUpNode = null;
        this.newline=null;
    }

    onLeftMouseUpOutside(e){
        this.fsm.mouseEventData = e;
        this.fsm.leftMouseUpOutside();
    }

    #removeCurrentLine(){
        this.panel.removeObject(this.newline);
        this.newline.removeFromScene();
        this.newline=null;
    }

    get scale(){
        return this.panel.context.scene.scale;
    }

}

export default PortDrag;