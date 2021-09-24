
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

class ProgramNode{
    name="Node";
    inputPorts=[];
    outputPorts=[];
}

/**
 * Port: input/output/or a constant input
 * port can be connected to port, only if types are compatitable
 */
class Port{
    name='port';
    typeName="int";
}

class InputPort extends Port{
    defaultValue=null;
}

class OutputPort extends Port{
}

/**
 * Manage information from data
 */
class DefineManager{
    nodeID=[];
    typeID=[];

}
