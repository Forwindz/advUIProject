
/**
 * This file define some data structure for the Node system
 * 
 * Each Node include some Port
 * OutputPort connects to InputPort
 * 
 */



/**
 * Define types
 * Some types accept other types input
 * Like int -> float, childClass -> fatherClass
 */
class TypeBehavior{
    name="type";
    acceptableInput=[];
}

class NodeConnectInfo{
    inputNode =null;
    inputPort =null;
    outputNode=null;
    outputPort=null;
    constructor(_inputPort,_inputNode,_outputPort,_outputNode){
        this.inputNode=_inputNode;
        this.inputPort = _inputPort;
        this.outputNode = _outputNode;
        this.outputPort = _outputPort;
    }
}
/**
 * We do not use templates here,
 * Because dynamic changes of node is really common in such programming system
 * For example, the node might change, when we deliver different types of data to the node
 * Therefore, we put every thing together
 *      at a cost of memory and running efficiency
 *      for the flexiblity and Scalability
 * 
 * Reference: https://wiki.blender.org/wiki/Source/Nodes/NodeInterfaceFramework
 */
class Node{
    name="Node";
    inputPorts=[];
    outputPorts=[];

    constructor(){
        this.defineNode();
    };

    defineNode() {
        
    }

    addInputPort(_name,_typeName,_defaultValue=null){
        let port = new InputPort(_name,_typeName,_defaultValue);
        this.inputPorts[_name]=port;
    }

    addOutputPort(_name,_typeName){
        let port = new OutputPort(_name,_typeName);
        this.outputPorts[_name]=port;
    }

    /**
     * When execute, invoke this, return outputs
     * @param {Array} _inputs 
     */
    onExecution(_inputs){

    }

    /**
     * Fire the event, if the node is connected
     * @param {NodeConnectInfo, Node} connectInfo 
     */
    onConnect(connectInfo, nodeDetail){

    }

    index=0;
    forwardNodes=[];
    backwardNodes=[];

    connectNode(connectInfo){
        //TODO: write connection
    }
}

/**
 * A series of nodes form a graph
 */
class NodeGraph{
    nodes=[];
    constructor(){

    }

    addNode(_node){
        this.nodes.push(node);
    }
}

/**
 * Port: input/output/or a constant input
 * port can be connected to port, only if types are compatitable
 */
class Port{
    name='port';
    typeName="int";
    connection = null;

    constructor(_name,_type){
        this.name=_name;
        this.typeName=_type;
    }
}

class InputPort extends Port{
    defaultValue=null;
    constructor(_name,_type){
        super(_name,_type);
    }
    constructor(_name,_type,_defaultValue){
        super(_name,_type);
        defaultValue=_defaultValue
    }
    //TODO: function: set Connection
}

class OutputPort extends Port{
    constructor(_name,_type){
        super(_name,_type);
    }
    //TODO: function: set Connection
}

/**
 * Manage information for all defined nodes and types
 */
class DefineManager{
    nodeID=[];
    typeID=[];
    //TODO: complete this
}
