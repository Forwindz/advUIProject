import LayoutComponent from "./LayoutComponent";
import removeArrayValue from "../util/utils.js"
class Layout{
    constructor(){

    }

    #dirty=false;

    addObject(obj){
        obj.layout = this;
    }

    removeObject(obj){
        obj.layout = null;
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