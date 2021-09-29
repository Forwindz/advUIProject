import Two from "two"
import LayoutComponent from "./LayoutComponent.js"

var TwoComp={
    context = null,

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {number} padTop 
     * @param {number} padLeft 
     * @param {number} padBottom 
     * @param {number} padRight 
     * @returns {LayoutComponent}
     */
    makeEmptyComponent: function(width=0, height=0,padTop=0,padLeft=0,padBottom=0,padRight=0){
        let comp = new LayoutComponent();
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
        return comp;
    },

    #makeComponent: function(shape,width, height,padTop=0,padLeft=0,padBottom=0,padRight=0){
        let comp = new LayoutComponent();
        comp.shape = shape;
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
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
     * @param {number} padRight 
     * @returns {LayoutComponent}
     */
    makeRectangle: function(x, y, width, height,padTop=0,padLeft=0,padBottom=0,padRight=0){
        let shape = this.context.makeRectangle(x, y, width, height);
        let comp = this.#makeComponent(shape,width,height,padTop,padLeft,padBottom,padRight);
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
     * @param {number} padRight 
     * @returns {LayoutComponent}
     */
    makeRoundedRectangle: function(x, y, width, height, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let shape = this.context.makeRectangle(x, y, width, height);
        let comp = this.#makeComponent(shape,width,height,padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeTwoObj:function(obj, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let rect = obj.getBoundingClientRect();
        let comp = this.#makeComponent(obj,rect.width,rect.height,padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeText:function(text, style={}, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let obj = new Two.Text(text,0,0,style);
        let rect = obj.getBoundingClientRect();
        let comp = this.#makeComponent(obj,rect.width,rect.height,padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeTextEdit:function(x, y, width, height, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let dom = document.createElement("input");
        //TODO!!!
    }
}

export default TwoComp;