import {PathComponent} from "../ui/layouts/TwoComponents.js";
import AttrManager from "../util/ValueChangeManager.js"
import {NodeConnectInfo} from "../data/ProgramDefine.js"
class ConnectionUI extends PathComponent{

    panelUI=null;
    #connectionData = new NodeConnectInfo();
    #portUIs = [null,null];
    #nodeUIs = [null,null];
    #nodeListeners = [null,null];
    #phyPoints=[];
    #phySprings=[];
    #notInit=true;

    sampleLength=50; //TODO: automatically adjust samples

    constructor(context){
        super(context,[new Two.Vector(0,0),new Two.Vector(0,1),new Two.Vector(1,0),new Two.Vector(1,1),new Two.Vector(1,1),new Two.Vector(1,1),new Two.Vector(1,1)]);
        this.doAfterUpdateDom(()=>{
            this.shapeDom.style.pointerEvents="none";
            this.styleTag = "connectLine";
            console.log("Add Style!");
        });
        
        this.#phyPoints.push(this.context.phyContext.addPoint(this.points[0],true));
        for(let i=1;i<this.points.length-1;i++){
            this.#phyPoints.push(this.context.phyContext.addPoint(this.points[i],false));
        }
        this.#phyPoints.push(this.context.phyContext.addPoint(this.points[this.points.length-1],true));
        for(let i=0;i<this.points.length-1;i++){
            this.#phySprings.push(this.context.phyContext.addSpring(this.#phyPoints[i],this.#phyPoints[i+1]));
        }

        for(let i=1;i<this.points.length-1;i++){
            this.#phySprings.push(this.context.phyContext.addForceToPoint({x:-10000,y:-10000},this.#phyPoints[i]));
        }
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
        let portIndex=index;
        if(index==1){
            index=this.points.length-1;
        }
        
        if(this.#nodeListeners[portIndex]){
            let nodeUI = this.#nodeUIs[portIndex];
            AttrManager.removePropertyListener(nodeUI.rect,"x",this.#nodeListeners[portIndex]);
            AttrManager.removePropertyListener(nodeUI.rect,"y",this.#nodeListeners[portIndex]);
            nodeUI.phyObj.removeAvoid(this.#phyPoints);
            this.#nodeListeners[portIndex]=null;
        }
        this.updatePoint(index,x,y);
        this.#nodeUIs[index] = null;
        this.#portUIs[index] = null;
    }

    // bind curve ends to the port center
    setPort(index,nodeUI,portUI){
        if(this.#nodeListeners[index]){
            let nodeUIOld = this.#nodeUIs[index];
            AttrManager.removePropertyListener(nodeUIOld.rect,"x",this.#nodeListeners[index]);
            AttrManager.removePropertyListener(nodeUIOld.rect,"y",this.#nodeListeners[index]);
            nodeUIOld.phyObj.removeAvoid(this.#phyPoints);
            this.#nodeListeners[index]=null;
        }
        this.#nodeUIs[index] = nodeUI;
        this.#portUIs[index] = portUI;
        
        this.updatePointFromPort(index);
        let listener=(v)=>{this.updatePointFromPort(index);}
        AttrManager.addPropertyListener(nodeUI.rect,"x",listener);
        AttrManager.addPropertyListener(nodeUI.rect,"y",listener);
        nodeUI.phyObj.addAvoid(this.#phyPoints);
        this.#nodeListeners[index]=listener; //hold reference
    }

    unbindPort(port){
        let inds = [0,this.points.length-1];
        for(const i of inds){
            let p = i==0?0:1;
            if(this.#portUIs[p].portData==port){
                this.setPoint(i,this.points[i].x,this.points[i].y);
                return p;
            }
        }
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
        if(!this._validDom){
            this.updateDom();
        }
        this.setTop();
        this.points[index].x = x;
        this.points[index].y = y;
        //Linear interpolation, the middle points
        if(index==0 && this.#notInit){
            let p0=this.points[index];
            for(let i=1;i<this.points.length;i++){
                let pcur = this.points[i];
                pcur.x = p0.x;
                pcur.y = p0.y;
            }
            this.#notInit=false;
        }else if(index==0 || index ==this.points.length-1){
            let p0=this.points[0];
            let p1=this.points[this.points.length-1];
            let pd = {x:p1.x-p0.x,y:p1.x-p0.x};
            let len = Math.sqrt(pd.x*pd.x+pd.y*pd.y);
            let springLength = len/(this.points.length-1)*0.75;
            let springk = 0.2;
            if(len<30){
                springk *= (len/30.0);
            }
            for(const spring of this.#phySprings){
                spring.orgLength=springLength;
                spring.enable = len>20;
                spring.k = springk;
            }
            let interp = 1.0/(this.points.length-1);
            //let strength = 1/(Math.max(10,len)/100.0);
            for(let i=1;i<this.points.length-1;i++){
                let t=interp*i;
                let sp=this.#phySprings[this.points.length-1+i-1];
                sp.refPoint.x=p1.x*t+p0.x*(1-t);
                sp.refPoint.y=p1.y*t+p0.y*(1-t);
                //sp.strength = strength*strength;
            }
        }
        this.update();
    }

    removeFromScene(){
        //unbind all uis
        this.setPoint(0,this.points[0].x,this.points[0].y);
        let ind = this.points.length-1;
        this.setPoint(1,this.points[ind].x,this.points[ind].y);
        this.context.phyContext.removes(this.#phyPoints);
        this.context.phyContext.removes(this.#phySprings);
        super.removeFromScene();
    }

    



}


export default ConnectionUI;