import StateMachine from "javascript-state-machine";

function createDragStateMachine(){
    let fsm = new StateMachine({
        init:'idle',
        data:{
            mouseEventData:null,
            lastDownShape:null
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
    #shape;
    #listener;
    pos=null; // include x, y, suggest to use getter and setter to react the new values
    constructor(shape=null,pos=null){
        this.fsm = createDragStateMachine();
        this.fsm.observe({
            onLeftMouseMove:this.onLeftMouseMove.bind(this),
            onLeftMouseDown:this.onLeftMouseDown.bind(this),
            onEnterSelected:this.onEnterSelected.bind(this)
        });
        if(!shape || !pos){
            return;
        }
        this.install(shape,pos);
    }

    onLeftMouseMove(){
        if(this.fsm.state!="drag"){
            return;
        }
        let tempx=this.fsm.mouseEventData.clientX;
        let tempy=this.fsm.mouseEventData.clientY;
        // scaling dx&dy
        let dx = (tempx-this.beginX)/this.#shape.context.scene.scale;
        let dy = (tempy-this.beginY)/this.#shape.context.scene.scale;
        this.pos.x=dx+this.orgX;
        this.pos.y=dy+this.orgY;
    }

    onLeftMouseDown(){
        this.beginX=this.fsm.mouseEventData.clientX;
                this.beginY=this.fsm.mouseEventData.clientY;
                this.orgX=this.pos.x;
                this.orgY=this.pos.y;
    }

    onEnterSelected(){
        this.fsm.lastDownShape.setTop();
    }

    install(shape,pos){
        let shapeDom = shape.shapeDom;
        shapeDom.addEventListener("mousedown",this.mousedown.bind(this),true);
        shapeDom.addEventListener("mouseup",this.mouseup.bind(this));
        // to avoid extremely fast movement, 
        let func=this.mousemove.bind(this);
        this.#listener=func;
        document.addEventListener("mousemove",func);
        shapeDom.addEventListener("mousemove",func);
        this.#shape=shape;
        this.pos = pos; //hold reference
    }

    mousedown(e){
        this.fsm.mouseEventData = e;
        this.fsm.lastDownShape = this.#shape;
        this.fsm.leftMouseDown();
        e.stopPropagation(); //avoid to pass to the panel
    }

    mouseup(e){
        this.fsm.mouseEventData = e;
        this.fsm.leftMouseUp();
    }

    mousemove(e){
        this.fsm.mouseEventData = e;
        this.fsm.leftMouseMove();
    }

    uninstall(){
        let shapeDom = this.#shape.shapeDom;
        shapeDom.removeEventListener("mousedown",this.mousedown.bind(this));
        shapeDom.removeEventListener("mouseup",this.mouseup.bind(this));
        // to avoid extremely fast movement, 
        document.removeEventListener("mousemove",this.#listener);
        shapeDom.removeEventListener("mousemove",this.#listener);
    }

}


export {DragInteraction}