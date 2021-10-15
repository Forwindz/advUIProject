import StateMachine from "javascript-state-machine";
import {PathComponent} from "../ui/layouts/TwoComponents.js";
import EventPublisher from "../util/Events.js"
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
            {name:"leftMouseMove",from:'selected',to:'drag'},
            {name:"leftMouseUp",from:'drag',to:'idle'},
            {name:"leftMouseUpOutside",from:'drag',to:'idle'},
            {name:"leftMouseUp",from:'selected',to:'idle'},
            //other tramsotopms (for corner cases)
            {name:"leftMouseMove",from:'drag',to:'drag'},
            {name:"leftMouseMove",from:'idle',to:'idle'},
            {name:"leftMouseUp",from:'drag',to:'idle'},
            {name:"leftMouseUp",from:'idle',to:'idle'},
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
            onLeaveDrag:()=>this.onCompleteDrag(),
            onLeftMouseMove:()=>this.onKeepDraging()//,
            //onLeftMouseUpOutside:()=>this.onLeftMouseUpOutside()
        });
    }

    #installPort(node,port){
        let portDom = port.portIconUI.shapeDom;
        
        if(portDom==null){
            port.portIconUI.updateDom();
            portDom = port.portIconUI.shapeDom;
        }
        portDom.addEventListener("mousedown",(e)=>{
            //console.log("down "+this.fsm.state);
            this.fsm.mouseEventData = e;
            this.fsm.lastDownPort = port;
            this.fsm.lastDownNode = node;
            this.fsm.leftMouseDown();
        });
        portDom.addEventListener("mouseup",(e)=>{
            //console.log("up "+this.fsm.state);
            this.fsm.mouseEventData = e;
            this.fsm.lastUpPort = port;
            this.fsm.lastUpNode = node;
            this.fsm.leftMouseUp();
        });
        portDom.addEventListener("mousemove",(e)=>this.onMouseMove(e));
    }

    installNode(nodeUI){
        //console.log("Install UNode ");
        //console.log(nodeUI);
        for(const portUI of nodeUI.inputPortUIs){
            this.#installPort(nodeUI,portUI);
        }
        for(const portUI of nodeUI.outputPortUIs){
            this.#installPort(nodeUI,portUI);
        }
        nodeUI.shapeDom.addEventListener("mousemove",(e)=>this.onMouseMove(e));
        nodeUI.shapeDom.addEventListener("mouseup",(e)=>{
            this.onLeftMouseUpOutside(e);
        });
    }

    // input NodeGraphUI
    install(panel){
        //console.log(panel);
        
        let mdom=document;//panel.shapeDom;
        mdom.addEventListener("mouseup",(e)=>{
            this.onLeftMouseUpOutside(e);
        });

        mdom.addEventListener("mousemove",(e)=>this.onMouseMove(e));

        this.panel=panel;
        panel.newNodeUIEvent.add((source,nodeUI)=>this.onAddNode(source,nodeUI));
    }

    onMouseMove(e){
        //console.log("move "+this.fsm.state);
        this.fsm.mouseEventData = e;
        this.fsm.leftMouseMove();
    }

    onAddNode(panel,nodeUI){
        nodeUI.doAfterUpdateDom(
            ()=>this.installNode(nodeUI)
            );
    }

    newline = null;

    onEnterDrag(){
        //console.log("Enter drag "+this.fsm.state);
        // create a path and add to the panel
        let beginPos = this.fsm.lastDownPort.portIconUI.rect;
        let x = beginPos.x+beginPos.width/2;
        let y = beginPos.y+beginPos.height/2;
        let points = [new Two.Vector(x,y),new Two.Vector(x,y)];
        //console.log(this);
        this.newline = new PathComponent(this.panel.context,points);
        this.panel.addObject(this.newline);
        //TODO: draw a curve line :)
    }

    onKeepDraging(){
        if(this.fsm.state!="drag"){
            return; // The library does not support loop transition :(
                // And I have no time to refine the library :(
        }
        //console.log("KeepDrag "+this.fsm.state);
        let ps = this.newline.points;
        ps[1].x = this.fsm.mouseEventData.clientX;
        ps[1].y = this.fsm.mouseEventData.clientY;
        console.log(ps)
        this.newline.update();
        //TODO: connect!
    }

    onCompleteDrag(){
        //console.log("complete Drag "+this.fsm.state);
        let r=false;
        if(this.fsm.lastDownPort&&this.fsm.lastDownNode&&this.fsm.lastUpPort&&this.fsm.lastUpNode){
            r = this.panel.data.addConnection(
                this.fsm.lastDownPort.portData,
                this.fsm.lastDownNode.nodeData,
                this.fsm.lastUpPort.portData,
                this.fsm.lastUpNode.nodeData,
                );
        }
        if(r){
            let endPos = this.fsm.lastUpPort.portIconUI.rect;
            let x = endPos.x+endPos.width/2;
            let y = endPos.y+endPos.height/2;
            let ps = this.newline.points;
            ps[1].x = x;
            ps[1].y = y;
            console.log("End")
            console.log(ps)
            this.newline.update();
        }else{
            this.#removeCurrentLine();
        }
        this.newline=null;
    }

    onLeftMouseUpOutside(e){
        //console.log("move up empty "+this.fsm.state);
        this.fsm.mouseEventData = e;
        this.fsm.lastUpPort=this.fsm.lastUpNode = null;
        this.fsm.leftMouseUpOutside();
    }

    #removeCurrentLine(){
        //console.log("Remove Line "+this.fsm.state);
        let context = this.newline.context;
        context.remove(this.newline);
        this.newline=null;
        context.update();
    }

}

export default PortDrag;