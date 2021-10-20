import {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior,Port,InputPort,OutputPort} from "../data/ProgramDefine.js"


//TODO: extend as a TwoCompenent, if I have time (for better coding structure)
//Currently, these are processed in Node UI
//Also, if there are too many layouts, efficiency can also be a problem for us
class PortUI{
    portData=null;
    portTextUI = null;
    portIconUI = null;
    portInput = null;

    constructor(portData){
        this.portData = portData;
    }

    processUI(){
        if(this.portInput){
            this.portInput.textdiv.addEventListener("input",
            (v)=>{
                let value = this.portInput.textdiv.innerHTML;
                this.portData.defaultValue=value;
                console.log(value);
            })
        }
    }

    #isConnected=false;
    set isConnected(v){
        this.#isConnected=v;
        this.updateConnectState();
    }

    updateConnectState(){
        console.log(this.#isConnected);
        if(this.#isConnected){
            if(this.portIconUI instanceof InputPort){
                this.portIconUI.styleTag="inPortIconConnect";
                if(this.portInput){
                    this.portInput.styleTag="inPortDefaultConnect";
                }
            }else{
                this.portIconUI.styleTag="outPortIconConnect";
            }
        }else{
            if(this.portIconUI instanceof InputPort){
                this.portIconUI.styleTag="inPortIcon";
                if(this.portInput){
                    this.portInput.styleTag="inPortDefault";
                }
            }else{
                this.portIconUI.styleTag="outPortIcon";
            }
        }
        this.portIconUI.update();
    }
}

export default PortUI;