import StateMachine from "javascript-state-machine";

function createDragStateMachine(){
    let fsm = new StateMachine({
        init:'idle',
        data:{
            mouseEventData:null,
            lastState:"idle"
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
            this.fsm.leftMouseDown();
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
        if(lastState!="selected"){
            return;
        }
        let e = this.fsm.mouseEventData;
        let newr = this.panel.getRelativePos(e.clientX,e.clientY);
        if(newr.x>0){
            if(!this.shape.display){
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