

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
}

export default PortUI;