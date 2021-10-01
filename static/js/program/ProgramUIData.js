/**
 * In this file, we define the basic data for UI
 */
import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior} from "../data/ProgramDefine.js";
import ValueChangeManager from "../util/ValueChangeManager.js";
import TwoComp from "../ui/layouts/TwoComponents.js"
import FlowLayout from "../ui/layouts/FlowLayout.js"
import LayoutComponent from "../ui/layouts/LayoutComponent.js"

class UIBasic{
    renderData=[]; //Two.js objects
    rawData=null; //data model
    uiContext=null;
    layout=null;
    constructor(_context){
        this.uiContext = _context;
    }

    generateRenderData(){

    }

    setLayout(){

    }
}

/**
 * Styles
 */

class PortUIStyle{
    //static defaultStyle = new PortStyle(); // I want static const!!! :(
    portHeight = 25;
    portWidth = 25;
    portTextPadding = 5;
    portTextColor = [0,0,0];
};

class NodeUIStyle{
    backGroundColor = [30,30,30];
    StrokeColor = [20,20,20];
    margin = [5,5,5,5];//top,left,bottom,right
    titleHeight = 30;
}

var defaultPortStyle = new PortUIStyle();
var defaultNodeStyle = new NodeUIStyle();
/**
 * This class generate rendering data for views
 * Also control interactions
 * For view parts, Two.js will render everything per frame, with openGL
 * Or with DOM (SVG elements)
 * Therefore, this class is mainly designed for install rendering elements and interactions
 */
class NodeUIControl extends UIBasic{
    constructor(_context){
        super(_context);
        //TODO: add style change listener
    }

    #x=0;
    #y=0;
    #w=0;
    #h=0;
    
    nodeStyle=defaultNodeStyle;
    portStyle=defaultPortStyle;

    nodePanelUI;
    /**
     * How to draw:
     *      _____________
     *      |    Name    |
     *      □ P1         |
     *  ____□ P2         |
     *  | 5 □ P3         |
     *  --- |         P4 □
     *      |         P5 □
     *      --------------
     * 
     * 
     * 
     */
    generateRenderData(){
        if (!this.nodeStyle){

        }
        this.#generateUI();
        

    }

    #generateUI(){
        const two = this.uiContext;
        TwoComp.setContext(two);
        let nodePanelComp = TwoComp.makeEmptyComponent();
        let layout = new FlowLayout();
        nodePanelComp.layout=layout;

        let nodeTitle = TwoComp.makeText("Title");
        nodePanelComp.addObject(nodeTitle,{newline:false,align:FlowLayout.AlignType.CENTER});
        for(const portKey of Object.keys(this.rawData.inputPorts)){
            let portIcon = TwoComp.makeRectangle(0,0,9,9,5,5,5,5);
            let portText = TwoComp.makeText(portKey);
            nodePanelComp.addObject(portIcon,{newline:true,align:FlowLayout.AlignType.LEFT});
            nodePanelComp.addObject(portText,{newline:false,align:FlowLayout.AlignType.LEFT});
        }
        
        for(const portKey of Object.keys(this.rawData.outputPorts)){
            let portIcon = TwoComp.makeRectangle(0,0,9,9,5,5,5,5);
            let portText = TwoComp.makeText(portKey);
            nodePanelComp.addObject(portText,{newline:true,align:FlowLayout.AlignType.RIGHT});
            nodePanelComp.addObject(portIcon,{newline:false,align:FlowLayout.AlignType.RIGHT});
        }
        console.log(this.rawData.inputPorts);
        console.log(layout);

        layout.reLayout();

        this.nodePanelUI = nodePanelComp;
    }

}

class ConnectionUIData extends UIBasic{
    connectionData = null;
    lineStyle = null;
    constructor(_connectionData){
        this.connectionData=_connectionData;
    }
}

export{NodeUIControl}
