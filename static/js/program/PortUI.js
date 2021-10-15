

//TODO: extend as a TwoCompenent, if I have time (for better coding structure)
//Currently, these are processed in Node UI
//Also, if there are too many layouts, efficiency can also be a problem for us
class PortUI{
    portData=null;
    portTextUI = null;
    portIconUI = null;

    constructor(portData){
        this.portData = portData;
    }
}

export default PortUI;