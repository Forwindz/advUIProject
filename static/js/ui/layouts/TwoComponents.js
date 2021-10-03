import Two from "../../lib/two.js"
import LayoutComponent from "./LayoutComponent.js";
class TwoCompponent extends LayoutComponent{
    
    #shape;
    #shapeDom;
    #shapeGroup = null;
    #context;

    constructor(context,shape=null){
        super();
        this.#context=context;
        this.shape=shape;
    }

    set shape(v){
        if(v){
            this.#shape=v;
            this.#context.bindOnce("afterUpdate",()=>this.updateDom());

            let r = this.#shape.getBoundingClientRect();
            this.prefSize.width = r.width;
            this.prefSize.height = r.height;

        }else{
            this.#shape=null;
            this.#shapeDom=null;
        }
        this.invalidLayout();
    }

    get shape(){
        return this.#shape;
    }

    get shapeDom(){
        return this.#shapeDom;
    }

    get context(){
        return this.#context;
    }

    updateDom(){
        if(this.#shape){
            this.#shapeDom = document.getElementById(this.#shape.id);
        }
    }

    addObject(obj,constrain=null){
        super.addObject(obj,constrain);
        if(!this.#shapeGroup){
            this.#createGroup();
        }
        this.#shapeGroup.add(obj.shape);
    }

    removeObject(obj){
        super.removeObject(obj,constrain);
        if(this.#shapeGroup){
            this.#shapeGroup.remove(obj.shape);
        }
    }

    #createGroup(){
        this.#shapeGroup = this.#context.makeGroup();
        this.rect.addPropertyListener("x",(v)=> this.#shapeGroup.translation.set(this.rect.x,this.rect.y));
        this.rect.addPropertyListener("y",(v)=> this.#shapeGroup.translation.set(this.rect.x,this.rect.y));
    }

    setPadding(padTop=0,padLeft=0,padBottom=0,padHeight=0){
        this.padding.top = padTop;
        this.padding.left = padLeft;
        this.padding.bottom = padBottom;
        this.padding.height = padHeight;
        this.invalidLayout();
    }

}

class PathComponent extends TwoCompponent{
    constructor(context,shape=null){
        super(context,shape);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
    }
}

class TextComponent extends TwoCompponent{
    constructor(context,shape=null){
        super(context,shape);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y+this.prefSize.height/2));
        // adjust according to default text align settings
        // TODO: support more text align settings
    }
}

class RectComponent extends TwoCompponent{

    /**
     * Two.js not support change width and height
     * They say... use transform maxtrix is okay.... (f*ck)
     * Therefore, we store original width and height,
     * and use 
     */

    #width=0;
    #height=0;

    setSize(width,height){
        this.#width=width;
        this.#height=height;
        this.updateRectSize();
    }

    set width(v){
        this.#width=v;
        this.updateRectSize();
    }

    set height(v){
        this.#height=v;
        this.updateRectSize();
    }

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }

    set shape(v){
        super.shape=v;
        if(v){
            this.#width = v.vertices[1].x*2;
            this.#height = v.vertices[2].y*2;
        }
    }

    get shape(){
        return super.shape;
    }

    constructor(context,shape=null){
        super(context,null);
        this.shape=shape;
        console.log(shape);
        console.log(shape.translation);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
        this.rect.addPropertyListener("width",(v)=>this.width = v);
        this.rect.addPropertyListener("height",(v)=>this.height = v);
    }

    updateRectSize(){
        if(!this.shape){
            return;
        }
        let vs = this.shape.vertices;
                        //x y
        let v0 = vs[0]; //- -
        let v1 = vs[1]; //+ -
        let v2 = vs[2]; //+ +
        let v3 = vs[3]; //- +

        const halfX = this.#width/2;
        const halfY = this.#height/2;
        v0.x = -halfX; v0.y = -halfY;
        v1.x =  halfX; v1.y = -halfY;
        v2.x =  halfX; v2.y =  halfY;
        v3.x = -halfX; v3.y =  halfY;
    }

}

var TwoComp={

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {number} padTop 
     * @param {number} padLeft 
     * @param {number} padBottom 
     * @param {number} padHeight 
     * @returns {TwoCompponent}
     */
    makeEmptyComponent: function(context,width=0, height=0,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new TwoCompponent(context,null);
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
        return comp;
    },

    makeComponent: function(context,shape,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new PathComponent(context,shape);
        this.setupComponent(comp,padTop,padLeft,padBottom,padHeight);
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
     * @returns {TwoCompponent}
     */
    makeRectangle: function(context,x, y, width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = new Two.Rectangle(x, y, width, height);
        let comp = new RectComponent(context,shape);
        comp.setPadding(padTop,padLeft,padBottom,padHeight);
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
     * @returns {TwoCompponent}
     */
    makeRoundedRectangle: function(context,x, y, width, height, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = new Two.RoundedRectangle(x, y, width, height);
        let comp = new RectComponent(context,shape);
        comp.setPadding(padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeTwoObj:function(context,obj, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let rect = obj.getBoundingClientRect();
        let comp = this.makeComponent(context,obj,rect.width,rect.height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeText:function(context,text, style={baseline:"top",alignment:"left"},x=0,y=0, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = new Two.Text(text,x,y,style);
        let comp = new TextComponent(context,shape);
        comp.setPadding(padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeTextEdit:function(x, y, width, height, padTop=0, padLeft=0, padBottom=0, padHeight=0){
        let dom = document.createElement("input");
        //TODO!!!
    }
}

export default TwoComp;
export {TwoCompponent,RectComponent,TextComponent};