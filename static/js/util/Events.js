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

    notify(source, params){
        for (const subscriber of this.#subscribers){
            subscriber(source, params);
        }
    }
}

export default EventPublisher;