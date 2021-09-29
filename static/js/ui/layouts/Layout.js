import LayoutComponent from "./LayoutComponent";
import removeArrayValue from "../util/utils.js"
class Layout{
    constructor(){

    }
    #objs=[]
    #dirty=false;

    addObject(obj,constrain){
        obj.layout = this;
        obj.layoutConstrain = constrain;
        this.#objs.push(obj);
    }

    removeObject(obj){
        obj.layout = null;
        removeArrayValue(this.#objs,obj);
    }

    reLayout(){
        this.#dirty=false;
    }

    invalid(){
        this.#dirty=true;
    }

    isValid(){
        return this.#dirty;
    }
}