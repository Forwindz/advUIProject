class AssetSelect{
    #panel;
    constructor(shape, panel){
        this.#panel=panel;
        shape.doAfterUpdateDom(()=>this.install(shape));
    }

    install(shape){
        for(const k in shape.uis){
            console.log("Install select "+k)
            let s = shape.uis[k];
            s.doAfterUpdateDom(()=>{
                s.shapeDom.addEventListener("click",
                (e)=>{
                    //add listener
                    console.log("Click Item " + s.data.name);
                    let r = this.#panel.getRelativePos(e.clientX,e.clientY);
                    let scale = this.#panel.context.scene.scale;
                    this.#panel.addNode((s.data.data)(),r.x/scale,r.y/scale);
                    shape.display=false;
                    e.stopPropagation();
                },true)
            });
        }
    }
    
}

export default AssetSelect;