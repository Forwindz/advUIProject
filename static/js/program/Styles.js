/**
 * Styles
 */

class PortUIStyle{
    //static defaultStyle = new PortStyle(); // I want static const!!! :(
    fillColor = "#FFFF00";
};

class NodeUIStyle{
    fillColor = "#FFFFFF";
    strokeColor = "#000000";
    textColor = "#000000";
}

var defaultPortStyle = new PortUIStyle();
var defaultNodeStyle = new NodeUIStyle();

export {PortUIStyle,NodeUIStyle,defaultNodeStyle,defaultPortStyle};
