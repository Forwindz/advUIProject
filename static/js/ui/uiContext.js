import Two from "../lib/two.js"
import {removeArrayValue} from "../util/utils.js"

/**
 * Add bindings that will be executed only once,
 * useful when we update doms and need to do some new operations.
 * 
 */
class Context extends Two{

    #eventRecord = [];

    constructor(twoParams){
        super(twoParams);
        this.#eventRecord["afterUpdate"] = new Array();
    }

    bindOnce(event,callback){
        if(!(event in this.#eventRecord)){
            this.#eventRecord[event] = new Array();
            super.bind(event, (v)=>this.#callOnce(event,v));
        }
        this.#eventRecord[event].push(callback);
    }

    #callOnce(eventName,param){
        let funcs = this.#eventRecord[eventName];
        for(let i of funcs){
            i(param);
        }
        this.#eventRecord[eventName].length = 0; //clear array;
    }

    update(){
        super.update();
        for(const domComp of this.#domComps){
            if(!domComp.installedDom){
                domComp.installDom(this.rootDom);
            }
            domComp.updateDomInfo();
        }
        this.#callOnce("afterUpdate");
    }

    #domComps=[];

    addDomComp(comp){
        this.#domComps.push(comp);
    }

    removeDomComp(comp){
        removeArrayValue(this.#domComps,comp);
        comp.installedDom=false;
    }

    #rootDom=null;
    get rootDom(){
        if(this.#rootDom){
            return this.#rootDom;
        }
        return this.#rootDom = document.getElementById("two-0");
    }

    //abandoned
    // do not use these functions
    /*
    #layers = []

    #initLayer(count){
        for(let i=this.#layers.length;i<count;i++){
            this.#layers.push(this.makeGroup());
        }
    }
    add(shape, layer = null){
        if(layer==null){
            super.add(shape);
        }else{
            if(this.#layers.length<=layer){
                this.#initLayer(layer+1);
            }
            this.#layers[layer].add(shape);
        }
    }
*/
}

export function buildContext(insertElement,twoParams){
    //return new Two(twoParams).appendTo(insertElement);
    return new Context(twoParams).appendTo(insertElement);
}
