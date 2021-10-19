


class AssetsPopHideInteraction{

    
    shape;
    panel;
    #added=false;

    constructor(shape,panel){
        this.shape=shape;
        this.panel = panel;
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
        document.addEventListener("click",this.#processPanelClick.bind(this),false);
        this.shape.display=false;
    }

    #processPanelClick(e){
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