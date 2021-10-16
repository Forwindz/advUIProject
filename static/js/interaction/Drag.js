import StateMachine from "javascript-state-machine";

function createDragStateMachine(){
    let fsm = new StateMachine({
        init:'idle',
        data:{
            mouseEventData:null
        },
        transitions:[
            {name:"leftMouseDown",from:'idle',to:'selected'},
            {name:"leftMouseMove",from:'selected',to:'drag'},
            {name:"leftMouseUp",from:'drag',to:'idle'},
            {name:"leftMouseUp",from:'selected',to:'idle'},
            {name:"leftMouseUp",from:'idle',to:'idle'},
            
            {name:"leftMouseMove",from:'drag',to:'drag'},
            {name:"leftMouseMove",from:'idle',to:'idle'}
        ]
    });
    return fsm;
}

class DragInteraction{
    fsm;
    beginX=0;
    beginY=0;
    orgX=0;
    orgY=0;
    pos=null; // include x, y, suggest to use getter and setter to react the new values
    constructor(dom=null,pos=null){
        this.fsm = createDragStateMachine();
        this.fsm.observe({
            onLeftMouseMove:()=>{
                if(this.fsm.state!="drag"){
                    return;
                }
                let tempx=this.fsm.mouseEventData.clientX;
                let tempy=this.fsm.mouseEventData.clientY;
                let dx = tempx-this.beginX;
                let dy = tempy-this.beginY;
                this.pos.x=dx+this.orgX;
                this.pos.y=dy+this.orgY;
            },
            onLeftMouseDown:()=>{
                this.beginX=this.fsm.mouseEventData.clientX;
                this.beginY=this.fsm.mouseEventData.clientY;
                this.orgX=this.pos.x;
                this.orgY=this.pos.y;
            }
        });
        if(!dom || !pos){
            return;
        }
        this.install(shapeDom,pos);
    }

    install(shapeDom,pos){
        shapeDom.addEventListener("mousedown",(e)=>{
            this.fsm.mouseEventData = e;
            this.fsm.leftMouseDown();
        });
        shapeDom.addEventListener("mouseup",(e)=>{
            this.fsm.mouseEventData = e;
            this.fsm.leftMouseUp();
        });
        // to avoid extremely fast movement, 
        let func=(e)=>{
            this.fsm.mouseEventData = e;
            this.fsm.leftMouseMove();
        };
        document.addEventListener("mousemove",func);
        shapeDom.addEventListener("mousemove",func);
        this.pos = pos; //hold reference
    }

}


export {DragInteraction}