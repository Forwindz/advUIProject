import StateMachine from "javascript-state-machine";

function createDragStateMachine(){
    let fsm = new StateMachine({
        init:'idle',
        data:{
            mouseEventData:null,
            lastState:"idle"
        },
        transitions:[
            {name:"rightMouseDown",from:'idle',to:'selectedRight'},
            {name:"leftMouseDown",from:'idle',to:'selectedLeft'},
            {name:"leftMouseMove",from:'selectedRight',to:'drag'},
            {name:"leftMouseMove",from:'selectedLeft',to:'drag'},
            {name:"leftMouseUp",from:'drag',to:'idle'},
            {name:"leftMouseUp",from:'selectedLeft',to:'idle'},
            {name:"leftMouseUp",from:'selectedRight',to:'idle'},
            {name:"leftMouseUp",from:'idle',to:'idle'},
            
            {name:"leftMouseMove",from:'drag',to:'drag'},
            {name:"leftMouseMove",from:'idle',to:'idle'}
        ]
    });
    return fsm;
}


class AssetsPopHideInteraction{

    
    shape;
    panel;
    fsm;
    #added=false;

    constructor(shape,panel){
        this.shape=shape;
        this.panel = panel;
        this.fsm = createDragStateMachine();
        if(this.shape && this.panel){
            shape.doAfterUpdateDom(this.#install.bind(this));
            panel.doAfterUpdateDom(this.#install.bind(this));
        }
    }

    #install(){
        if(this.#added || !this.shape.shapeDom || !this.panel.shapeDom){
            return;
        }
        this.#added=true;
        this.fsm.observe({
            onLeftMouseUp:this.#processPanelClick.bind(this)
        });
        document.addEventListener("mousedown",(e)=>{
            this.fsm.mouseEventData=e;
            this.fsm.lastState = this.fsm.state;
            
            if(e.button!=2){
                this.fsm.leftMouseDown();
            }else{
                this.fsm.rightMouseDown();
            }
            
        },false);
        document.addEventListener("mouseup",(e)=>{
            this.fsm.mouseEventData=e;
            this.fsm.lastState = this.fsm.state;
            this.fsm.leftMouseUp();
        },false);
        document.addEventListener("mousemove",(e)=>{
            this.fsm.mouseEventData=e;
            this.fsm.lastState = this.fsm.state;
            this.fsm.leftMouseMove();
        },false);
        this.shape.display=false;
    }

    #processPanelClick(){
        let lastState = this.fsm.lastState;
        let e = this.fsm.mouseEventData;
        let newr = this.panel.getRelativePos(e.clientX,e.clientY);
        if(newr.x>0){
            if(!this.shape.display && lastState=="selectedRight"){
                this.shape.rect.x = newr.x;
                this.shape.rect.y = newr.y;
                this.shape.update();
                this.shape.display=true;
            }else{
                this.shape.display=false;
            }
        }else{
            this.shape.display=false;
        }
    }

    
}

export default AssetsPopHideInteraction