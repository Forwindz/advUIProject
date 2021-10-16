import {PathComponent} from "../ui/layouts/TwoComponents.js";
import AttrManager from "../util/ValueChangeManager.js"
import {NodeConnectInfo} from "../data/ProgramDefine.js"
class ConnectionUI extends PathComponent{

    #connectionData = new NodeConnectInfo();
    nodeGraph = null;
    #portUIs = [null,null];
    #nodeUIs = [null,null];
    #nodeListeners = [null,null];

    constructor(context){
        super(context,[new Two.Vector(0,0),new Two.Vector(0,0)]);
        this.doAfterUpdateDom(()=>this.newline.shapeDom.style.pointerEvents="none");
    }

    set connectionData(v){
        this.#connectionData = v;
        if(v && this.nodeGraph){
            if(v.inputNode && v.inputPort){
                this.setPort(1,this.nodeGraph.getInputPortUIIcon(v.inputNode,v.inputPort));
            }
            if(v.outputNode && v.outputPort){
                this.setPort(0,this.nodeGraph.getInputPortUIIcon(v.outputNode,v.outputPort));
            }
            
        }
    }

    get connectionData(){
        return this.#connectionData;
    }

    setFirstPort(nodeUI,portUI){
        this.setPort(0,nodeUI,portUI);
    }

    setLastPort(nodeUI,portUI){
        this.setPort(1,nodeUI,portUI);
    }

    // directly set position, and unbind the port
    setPoint(index,x,y){
        if(this.#nodeListeners[index]){
            AttrManager.removePropertyListener(nodeUI.rect,"x",this.#nodeListeners[index]);
            AttrManager.removePropertyListener(nodeUI.rect,"y",this.#nodeListeners[index]);
            this.#nodeListeners[index]=null;
        }
        this.updatePoint(index,x,y);
        this.#nodeUIs[index] = null;
        this.#portUIs[index] = null;
/*
        if(index==1){
            this.#connectionData.inputNode = null;
            this.#connectionData.inputPort = null;
        }else if (index==0){
            this.#connectionData.outputNode = null;
            this.#connectionData.outputPort = null;
        }*/
    }

    // bind curve ends to the port center
    setPort(index,nodeUI,portUI){
        if(this.#nodeListeners[index]){
            AttrManager.removePropertyListener(nodeUI.rect,"x",this.#nodeListeners[index]);
            AttrManager.removePropertyListener(nodeUI.rect,"y",this.#nodeListeners[index]);
        }
        this.#nodeUIs[index] = nodeUI;
        this.#portUIs[index] = portUI;
        
        this.updatePointFromPort(index);
        let listener=(v)=>{this.updatePointFromPort(index);}
        AttrManager.addPropertyListener(nodeUI.rect,"x",listener);
        AttrManager.addPropertyListener(nodeUI.rect,"y",listener);
        this.#nodeListeners[index]=listener; //hold reference
/*
        if(index==1){
            this.#connectionData.inputNode = nodeUI.nodeData;
            this.#connectionData.inputPort = portUI.portData;
        }else if (index==0){
            this.#connectionData.outputNode = nodeUI.nodeData;
            this.#connectionData.outputPort = portUI.portData;
        }*/
    }

    updatePointFromPort(index){
        let absPos = this.#portUIs[index].portIconUI.getAbsoluteCanvasPos();
        let x = absPos.x+absPos.width/2;
        let y = absPos.y+absPos.height/2;
        if(index==1){
            this.updatePoint(this.points.length-1,x,y);
        }else{
            this.updatePoint(index,x,y);
        }
    }

    updatePoint(index=0,x,y){
        this.points[index].x = x;
        this.points[index].y = y;
        this.update();
    }



}


export default ConnectionUI;