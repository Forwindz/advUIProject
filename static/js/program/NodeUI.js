import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior,Port,InputPort,OutputPort} from "../data/ProgramDefine.js";
import AttrManager from "../util/ValueChangeManager.js"
import TwoComp from "../ui/layouts/TwoComponents.js";
import {RectComponent} from "../ui/layouts/TwoComponents.js";
import FlowLayout from "../ui/layouts/FlowLayout.js";
import {PortUIStyle,NodeUIStyle,defaultNodeStyle,defaultPortStyle} from "./Styles.js";
import {NodeUIData} from "./ProgramUIData.js";
import StateMachine from "javascript-state-machine";
import {DragInteraction} from "../interaction/Drag.js"
import PortUI from "./PortUI.js"
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
    inputPortUIs={};
    outputPortUIs={};
    
    nodeStyle=defaultNodeStyle;
    portStyle=defaultPortStyle;

    #portShape=[];

    dragInteraction = new DragInteraction();
    constructor(_context, data){
        super(_context, null);
        this.initGroup();
        this.nodeData = data;
        this.generateRenderData();
        //bind data
        AttrManager.addAllPropertiesListener(this.uiData.rect,
            (v)=>{
                this.rect.x=this.uiData.rect.x;
                this.rect.y=this.uiData.rect.y;
                this.context.update();
            }
            );
        //Interaction
        this.doAfterUpdateDom(()=>{
            if(!this.shapeDom){
                return;
            }
            this.dragInteraction.install(this,this.uiData.rect);
        });
        console.log(this);
        
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
        nodeTitle.setPadding(8,0,12,0);
        this.addObject(nodeTitle,{newline:false,align:FlowLayout.AlignType.CENTER});
        
        for(const portKey of Object.keys(this.nodeData.inputPorts)){
            let portIcon = TwoComp.makeRectangle(this.context,0,0,9,9,0,5,15,5);
            let portText = TwoComp.makeText(this.context,portKey);
            portText.setPadding(0,0,0,5);
            this.addObject(portIcon,{newline:true,align:FlowLayout.AlignType.LEFT|FlowLayout.AlignType.TOP});
            this.addObject(portText,{newline:false,align:FlowLayout.AlignType.LEFT|FlowLayout.AlignType.TOP});
            this.#portShape.push(portIcon);

            let pui = new PortUI(this.nodeData.inputPorts[portKey]);
            pui.portTextUI = portText;
            pui.portIconUI = portIcon;
            this.inputPortUIs[portKey]=(pui);
        }
        
        for(const portKey of Object.keys(this.nodeData.outputPorts)){
            let portIcon = TwoComp.makeRectangle(this.context,0,0,9,9,0,5,15,5);
            let portText = TwoComp.makeText(this.context,portKey);
            portText.setPadding(0,5,0,0);
            this.addObject(portText,{newline:true,align:FlowLayout.AlignType.RIGHT|FlowLayout.AlignType.TOP});
            this.addObject(portIcon,{newline:false,align:FlowLayout.AlignType.RIGHT|FlowLayout.AlignType.TOP});
            this.#portShape.push(portIcon);

            let pui = new PortUI(this.nodeData.outputPorts[portKey]);
            pui.portTextUI = portText;
            pui.portIconUI = portIcon;
            this.outputPortUIs[portKey]=(pui);
        }
        
        this.layout.reLayout();
    }

    getPorts(){
        return this.#portShape;
    }

    getPortUIIcon(port){
        if(port instanceof InputPort){
            return this.getInputPortUIIcon(port);
        }else if (port instanceof OutputPort){
            return this.getOutputPortUIIcon(port);
        }
        return null;
    }

    getInputPortUIIcon(port){
        return this.inputPortUIs[port.name].portIconUI;
    }

    getOutputPortUIIcon(port){
        return this.outputPortUIs[port.name].portIconUI;
    }

}

export {NodeUI};