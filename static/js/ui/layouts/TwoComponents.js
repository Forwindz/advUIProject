import Two from "../../lib/two.js"
import LayoutComponent from "./LayoutComponent.js"

var twoCompContext = null;

var TwoComp={

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {number} padTop 
     * @param {number} padLeft 
     * @param {number} padBottom 
     * @param {number} padHeight 
     * @returns {LayoutComponent}
     */
    makeEmptyComponent: function(width=0, height=0,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new LayoutComponent();
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
        return comp;
    },

    makeComponent: function(shape,width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new LayoutComponent();
        comp.shape = shape;
        comp.rect.width = comp.prefSize.width = width;
        comp.rect.height = comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
        //bind data
        comp.rect.addPropertyListener("x",(x)=>shape.translation.set(x,shape.translation.y));
        comp.rect.addPropertyListener("y",(y)=>shape.translation.set(shape.translation.x,y));
        return comp;
    },

    //TODO: add listeners to prefSize; (maybe I will not use this)

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} padTop 
     * @param {number} padLeft 
     * @param {number} padBottom 
     * @param {number} padHeight 
     * @returns {LayoutComponent}
     */
    makeRectangle: function(x, y, width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = twoCompContext.makeRectangle(x, y, width, height);
        let comp = this.makeComponent(shape,width,height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} padTop 
     * @param {number} padLeft 
     * @param {number} padBottom 
     * @param {number} padHeight 
     * @returns {LayoutComponent}
     */
    makeRoundedRectangle: function(x, y, width, height, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = twoCompContext.makeRectangle(x, y, width, height);
        let comp = this.makeComponent(shape,width,height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeTwoObj:function(obj, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let rect = obj.getBoundingClientRect();
        let comp = this.makeComponent(obj,rect.width,rect.height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeText:function(text, style={}, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let obj = new Two.Text(text,0,0,style);
        let rect = obj.getBoundingClientRect();
        let comp = this.makeComponent(obj,rect.width,rect.height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeTextEdit:function(x, y, width, height, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let dom = document.createElement("input");
        //TODO!!!
    },

    setContext:function(context){
        twoCompContext = context;
    }
}

export default TwoComp;