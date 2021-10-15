import * as utils from "./utils.js"
class EventPublisher{
    #subscribers=[];
    constructor(){

    }

    add(listener){
        this.#subscribers.push(listener);
    }

    remove(listener){
        utils.removeArrayValue(this.#subscribers,listener);
    }

    notify(source=null, params=null){
        for (const subscriber of this.#subscribers){
            subscriber(source, params);
        }
    }

    clear(){
        this.#subscribers=[];
    }
}

export default EventPublisher;