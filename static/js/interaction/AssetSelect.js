class AssetSelect{

    constructor(shape){
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
                    shape.display=false;
                    e.stopPropagation();
                },true)
            });
        }
    }
    
}

export default AssetSelect;