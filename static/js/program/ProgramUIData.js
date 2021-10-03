/**
 * In this file, we define the basic data for UI
 */

//import LayoutComponent from "../ui/layouts/LayoutComponent.js"

class UIBasic{
    renderData=[]; //Two.js objects
    rawData=null; //data model
    uiContext=null;
    layout=null;
    constructor(_context,data){
        this.uiContext = _context;
        this.rawData=data;
    }

    generateRenderData(){

    }

    setLayout(){

    }
}

class NodeUIData{
    rect={x:0,y:0};
}


export {UIBasic,NodeUIData};
