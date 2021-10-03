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

export {PortUIStyle,NodeUIStyle,defaultNodeStyle,defaultPortStyle};
