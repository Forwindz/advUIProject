import Two from "../lib/two.js"

/**
 * Add bindings that will be executed only once,
 * useful when we update doms and need to do some new operations.
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
        this.#callOnce("afterUpdate");
    }

}

export function buildContext(insertElement,twoParams){
    //return new Two(twoParams).appendTo(insertElement);
    return new Context(twoParams).appendTo(insertElement);
}
