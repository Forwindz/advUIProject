
/**
 * Scaling interaction
 * the scale will be smoothed during operation
 */
class PanelScaleInteraction{
    panel; //root panel
    wheelSpeed = 0.05; //wheel speed, higher values => faster scaling
    approachSpeed = 0.05; //the animation that approach current scales
    #targetScale = 1.0; // target scale we animate to 
    #maxScale = 2.5;
    #minScale = 0.4;
    #dom;
    constructor(panel,dom){
        this.panel=panel;
        this.#dom=dom;
        this.#installPanel();
    }

    #installPanel(){
        let wheelFunc = (e)=>this.#onWheel(e);
        this.#dom.addEventListener("mousewheel",wheelFunc,true);
        this.#dom.addEventListener("DOMMouseScroll",wheelFunc,true); //for firefox
    }

    #onWheel(e){
        let dir = Math.sign(e.deltaY);
        this.targetScale+=dir*this.wheelSpeed;
    }

    #clampScale(){
        this.#targetScale = Math.max(this.#minScale,this.#targetScale);
        this.#targetScale = Math.min(this.#maxScale,this.#targetScale);
    }

    set maxScale(v){
        this.#maxScale = v;
        this.#clampScale();
    }

    set minScale(v){
        this.#minScale = v;
        this.#clampScale();
    }

    get maxScale(){return this.#maxScale};
    get minScale(){return this.#minScale};

    #scaleFunc = ()=>this.#approachScale();
    set targetScale(v){
        this.#targetScale = v;
        this.#clampScale();
        let d = this.#targetScale - this.currentScale;
        if(Math.abs(d)>0.01){
            setInterval(this.#scaleFunc,40);
        }
    }

    get targetScale(){
        return this.#targetScale;
    }

    set currentScale(v){
        this.panel.scene.scale=v;
    }

    get currentScale(){
        return this.panel.scene.scale;
    }

    #approachScale(){
        let d = this.targetScale - this.currentScale;
        if(Math.abs(d)>0.01){
            this.currentScale+= d*this.approachSpeed;
            this.panel.update();
        }else{
            clearInterval(this.#scaleFunc);
        }
    }
}

export {PanelScaleInteraction};