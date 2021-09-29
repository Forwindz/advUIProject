import Two from "two";
import ValueChangeManager from "../util/ValueChangeManager.js";

/**
 * Component for layouts,
 * input is a render object
 */
class LayoutComponent{
    rect = {x:0,y:0,width:0,height:0};//stored position info
    padding = {top:0,left:0,bottom:0,right:0};
    prefSize = {width:0,height:0};//preferred size, use by default
    layoutConstrain;

    constructor(){
        //ValueChangeManager.install(this.rect);
        ValueChangeManager.install(this.padding);
        ValueChangeManager.install(this.prefSize);
        //this.rect.addAllPropertiesListener((v)=> this.invalidLayout());
        this.padding.addAllPropertiesListener((v)=> this.invalidLayout());
        this.prefSize.addAllPropertiesListener((v)=> this.invalidLayout());
    }

    father;
    layout = null;
    get father(){
        return this.father;
    }
    /**
     * @param {LayoutComponent} v
     */
    set father(v){
        if(father==this.father){
            return;
        }
        oldFather = this.father;
        this.father=v;
        // invalid layouts
        if(oldFather){
            oldFather.invalidLayout();
        }
        if(this.father){
            this.father.invalidLayout();
        }
    }

    /**
     * @param {Layout} v
     */
    set layout(v){
        oldLayout = this.layout;
        this.layout=v;
        this.invalidLayout();
        if(oldLayout){
            oldLayout.invalid();
        }
    }

    invalidLayout(){
        if(this.layout){
            this.layout.invalid();
        }
        this.father.invalid();
    }

    
    
}

export default LayoutComponent;