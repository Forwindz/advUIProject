import AttrManager from "../../util/ValueChangeManager.js"
import { removeArrayValue } from "../../util/utils.js";
/**
 * Component for layouts,
 * input is a render object
 */
class LayoutComponent{
    rect = {x:0,y:0,width:0,height:0};//stored position info
    padding = {top:0,left:0,bottom:0,right:0};
    prefSize = {width:0,height:0};//preferred size, use by default
    objs= new Array();
    constrain;

    constructor(){
        AttrManager.addAllPropertiesListener(this.padding,(v)=> this.invalidLayout());
        AttrManager.addAllPropertiesListener(this.prefSize,(v)=> this.invalidLayout());
    }

    #father = null;
    #layout = null;

    get father(){
        return this.#father;
    }
    /**
     * @param {LayoutComponent} v
     */
    set father(v){
        if(v==this.#father){
            return;
        }
        let oldFather = this.#father;
        this.#father=v;
        // invalid layouts
        if(oldFather){
            oldFather.invalidLayout();
            removeArrayValue(oldFather.objs,this);
        }
        if(this.#father){
            this.#father.invalidLayout();
            this.#father.objs.push(this);
        }
    }

    /**
     * @param {Layout} v
     */
    set layout(v){
        let oldLayout = this.#layout;
        this.#layout=v;
        if(v){
            this.#layout.objs=this.objs;
            this.#layout.curObj=this;
            this.invalidLayout();
        }
        if(oldLayout){
            oldLayout.objs=[];
            oldLayout.curObj=null;
            oldLayout.invalid();
        }
    }

    get layout(){
        return this.#layout;
    }

    invalidLayout(){
        if(this.#layout){
            this.#layout.invalid();
        }
        if(this.#father){
            this.#father.invalidLayout();
        }
    }

    addObject(obj,constrain=null){
        obj.constrain=constrain;
        obj.father=this;
    }

    removeObject(obj){
        obj.layout = null;
        obj.father = null;
    }

    
    
}

export default LayoutComponent;