import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior} from "../data/ProgramDefine.js";
import ValueChangeManager from "../util/ValueChangeManager.js";
import TwoComp from "../ui/layouts/TwoComponents.js";
import {RectComponent} from "../ui/layouts/TwoComponents.js";
import FlowLayout from "../ui/layouts/FlowLayout.js";
import {PortUIStyle,NodeUIStyle,defaultNodeStyle,defaultPortStyle} from "./Styles.js";
import {NodeUIData} from "./ProgramUIData.js";
/**
 * This class generate rendering data for views
 * Also control interactions
 * For view parts, Two.js will render everything per frame, with openGL
 * Or with DOM (SVG elements)
 * Therefore, this class is mainly designed for install rendering elements and interactions
 */
class NodeUI extends RectComponent{
    

    uiData = new NodeUIData();
    nodeData;
    
    nodeStyle=defaultNodeStyle;
    portStyle=defaultPortStyle;

    constructor(_context, data){
        super(_context, new Two.Rectangle(0,0,1,1));
        this.nodeData = data;
        //TODO: add style change listener
        ValueChangeManager.install(this.uiData.rect);
        this.generateRenderData();
        //bind data
        this.uiData.rect.addAllPropertiesListener(
            (v)=>{
                this.rect.x=this.uiData.rect.x;
                this.rect.y=this.uiData.rect.y;
            }
            );
    }
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
            //TODO: setup styles
        }
        this.#generateUI();
    }

    #generateUI(){
        this.layout=new FlowLayout();

        //title 
        let nodeTitle = TwoComp.makeText(this.context,"Title");
        this.addObject(nodeTitle,{newline:false,align:FlowLayout.AlignType.CENTER});
        
        for(const portKey of Object.keys(this.nodeData.inputPorts)){
            let portIcon = TwoComp.makeRectangle(this.context,0,0,9,9,5,5,5,5);
            let portText = TwoComp.makeText(this.context,portKey);
            this.addObject(portIcon,{newline:true,align:FlowLayout.AlignType.LEFT});
            this.addObject(portText,{newline:false,align:FlowLayout.AlignType.LEFT});
        }
        
        for(const portKey of Object.keys(this.nodeData.outputPorts)){
            let portIcon = TwoComp.makeRectangle(this.context,0,0,9,9,5,5,5,5);
            let portText = TwoComp.makeText(this.context,portKey);
            this.addObject(portText,{newline:true,align:FlowLayout.AlignType.RIGHT});
            this.addObject(portIcon,{newline:false,align:FlowLayout.AlignType.RIGHT});
        }

        console.log(this.layout);
        console.log(this);
        this.layout.reLayout();
    }

}

export {NodeUI};