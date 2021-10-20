
class AltDelete{
    panel;

    constructor(panel){
        this.panel=panel;
    }

    install(shape){
        if(!shape.shapeDom){
            shape.doAfterUpdateDom(()=>this.install(shape));
            return;
        }
        shape.shapeDom.addEventListener("mousedown",(e)=>{
            console.log(e)
            if(e.altKey){
                this.panel.removeNode(shape.nodeData);
            }
        },true)
    }
}

export default AltDelete;