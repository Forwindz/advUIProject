import {NodeUIData, ConnectionUIData, NodeGraphUIData} from "./ProgramUIData.js"
import Two from "./lib/two.js"

class ProgramUIRender{
    two = null;
    constructor(insertElement,twoParams){
        this.two = new Two(twoParams).appendTo(insertElement);
    }
}