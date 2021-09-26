import * as utils from "../util/utils.js"
import CountSet from "../util/CountSet.js"
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
};
/**
 * We do not use templates here,
 * Because dynamic changes of nodes are really common in such programming systems.
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
     * @param {NodeConnectInfo} connectInfo 
     */
    #onConnect(connectInfo){

    }

    #onDisconnect(connectInfo){

    }


    index=0;
    forwardNodes=new CountSet();
    backwardNodes=new CountSet();

    addConnection(connectInfo){
        if(connectInfo.inputNode==this){
            this.backwardNodes.add(connectInfo.outputNode);
        }else{
            this.forwardNodes.add(connectInfo.inputNode);
        }
        this.#onConnect(connectInfo);
    }

    removeConnection(connectInfo){
        if(connectInfo.inputNode==this){
            this.backwardNodes.remove(connectInfo.outputNode);
        }else{
            this.forwardNodes.remove(connectInfo.inputNode);
        }
        this.#onDisconnect(connectInfo);
    }
};

/**
 * Port: input/output/or a constant input
 * port can be connected to port, only if types are compatitable
 */
class Port{
    name='port';
    typeName="int";
    connectInfo = []

    constructor(_name,_type){
        this.name=_name;
        this.typeName=_type;
    }

    addConnection(_connection){
        connectInfo.push(_connection);
    }

    removeConnection(_connection){
        this.connectInfo = utils.removeArrayValue(this.connectInfo,_connection);
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
    
};

class OutputPort extends Port{
    constructor(_name,_type){
        super(_name,_type);
    }
};

/**
 * A series of nodes form a graph
 */
 class NodeGraph{
    nodes=[];
    maxIndex=-1;
    constructor(){

    }

    /**
     * Add a node, return an index to represent the node.
     * The index is used for distinct nodes, especially nodes have the same name.
     * @param {Node} _node 
     * @returns {number} the index of the node
     */
    addNode(_node){
        maxIndex++;
        this.nodes[this.maxIndex] = _node;
        _node.index=this.maxIndex;
        return maxIndex;
    }

    removeNode(_node){
        delete this.nodes[_node.index];
    }

    getNodeByIndex(index){
        return this.nodes[index];
    }

    /**
     * add a connection
     * @param {InputPort} _inputPort 
     * @param {Node} _inputNode 
     * @param {OutputPort} _outputPort 
     * @param {Node} _outputNode 
     * @returns {NodeConnectInfo} Connection Info Object, if the connection is failed, return null
     */
    addConnection(_inputPort,_inputNode,_outputPort,_outputNode){
        if(!_inputPort||!_inputNode||!_outputPort||!_outputNode){
            return null;
        }
        if(!DefinitionManager.isCompatType(_inputPort.typeName,_outputPort.typeName)){
            return null;
        }
        connectionInfo = new NodeConnectInfo(_inputPort,_inputNode,_outputPort,_outputNode);
        _inputNode.addConnection(connectInfo);
        _outputNode.addConnection(connectInfo);
        _inputPort.addConnection(connectInfo);
        _outputPort.addConnection(connectInfo);
        return connectInfo;
    }

    removeConnection(connectInfo){
        connectInfo.inputNode. removeConnection(connectInfo);
        connectInfo.outputNode.removeConnection(connectInfo);
        connectInfo.inputPort. removeConnection(connectInfo);
        connectInfo.outputPort.removeConnection(connectInfo);
    }

    /**
     * Same as addConnection, but accept more intutive variables.
     * @param {string} _inputPortName 
     * @param {number} _inputNodeIndex 
     * @param {string} _outputPortName 
     * @param {number} _outputNodeIndex 
     * @returns {NodeConnectInfo} 
     */
    addConnectionRaw(_inputPortName,_inputNodeIndex,_outputPortName,_outputNodeIndex){
        _inputNode = this.nodes[_inputNodeIndex];
        _outputNode = this.nodes[_outputNodeIndex];
        _inputPort = _inputNode.inputPorts[_inputPortName];
        _outputPort = _outputNode.outputPorts[_outputPortName];
        return this.addConnection(_inputPort,_inputNode,_outputPort,_outputNode);
    }

};

/**
 * Manage information for all defined nodes and types
 */
class DefinitionManager{
    static getInstance(){
        if (!DefinitionManager.instance) {
            // Static attribute which holds the unique instance of 'Me'
            DefinitionManager.instance = new DefinitionManager();
        }
        return DefinitionManager.instance;
    }
    typeID=[];
    //TODO: complete this
    constructor(){

    }

    regType(typeBehavior){
        if(typeBehavior.name==null){
            return;
        }
        if(this.typeID.hasOwnProperty(typeBehavior)){
            throw new Error("Duplicate Attribute","Info: "+typeBehavior+" \n but------\n"+this.typeID);
        }
        typeID[typeBehavior.name] = typeBehavior;
    }

    /**
     * Check if two types are compatitable
     * If acceptTypeName is null, then this function always return true;
     * @param {string} inputTypeName 
     * @param {string} acceptTypeName 
     * @returns {boolean}
     */
    isCompatType(inputTypeName, acceptTypeName){
        if(acceptTypeName==null){
            return true;
        }
        acceptType = this.typeID[acceptTypeName].acceptType;
        return acceptType.include(inputTypeName);
    }
};

export {DefinitionManager, Node,NodeGraph,NodeConnectInfo,TypeBehavior}


