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

    setPadding(padTop=0,padLeft=0,padBottom=0,padReight=0){
        this.padding.top = padTop;
        this.padding.left = padLeft;
        this.padding.bottom = padBottom;
        this.padding.right = padReight;
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
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y+this.rect.height/2));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y+this.rect.height/2));
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
    points;

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

    /**
     * not accept Two.Rectangle
     * Since Two.Rectangle does not support to change size of width and height
     * We rewrite most of this functions by using Two.path, to change vertices.
     * F*ck Two.js
     * 
     * @param {Context} context 
     * @param {Array} points 
     */
    constructor(context,points=null){
        super(context,null);
        this.points=points;
        if(!points || ! (points instanceof Array)){
            this.points = points = [
                new Two.Vector(0,0),
                new Two.Vector( this.prefSize.width,0),
                new Two.Vector( this.prefSize.width, this.prefSize.height),
                new Two.Vector(0, this.prefSize.height)
            ];
        }
        this.shape = new Two.Path(points,true,false);
        this.shape.translation.set(0,0);
        this.context.add(this.shape);
        
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
        let v0 = this.points[0]; //- -
        let v1 = this.points[1]; //+ -
        let v2 = this.points[2]; //+ +
        let v3 = this.points[3]; //- +

        const x = this.#width;
        const y = this.#height;
        v0.x = 0; v0.y = 0;
        v1.x = x; v1.y = 0;
        v2.x = x; v2.y = y;
        v3.x = 0; v3.y = y;
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
     * @param {number} padRight 
     * @returns {TwoCompponent}
     */
    makeEmptyComponent: function(context,width=0, height=0,padTop=0,padLeft=0,padBottom=0,padRight=0){
        let comp = new TwoCompponent(context,null);
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padRight;
        return comp;
    },

    makeComponent: function(context,shape,padTop=0,padLeft=0,padBottom=0,padRight=0){
        let comp = new PathComponent(context,shape);
        this.setupComponent(comp,padTop,padLeft,padBottom,padRight);
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
     * @returns {TwoCompponent}
     */
    makeRectangle: function(context,x, y, width, height,padTop=0,padLeft=0,padBottom=0,padRight=0){
        //let shape = new Two.Rectangle(x, y, width, height);
        let points = [
            new Two.Vector(0,0),
            new Two.Vector( width,0),
            new Two.Vector( width, height),
            new Two.Vector(0, height)
        ];
        let comp = new RectComponent(context,points);
        comp.setPadding(padTop,padLeft,padBottom,padRight);
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
     * @returns {TwoCompponent}
     */
    makeRoundedRectangle: function(context,x, y, width, height, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let shape = new Two.RoundedRectangle(x, y, width, height);
        let comp = new RectComponent(context,shape);
        comp.setPadding(padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeTwoObj:function(context,obj, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let rect = obj.getBoundingClientRect();
        let comp = this.makeComponent(context,obj,rect.width,rect.height,padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeText:function(context,text, style={baseline:"top",alignment:"left"},x=0,y=0, padTop=0,padLeft=0,padBottom=0,padRight=0){
        let shape = new Two.Text(text,x,y,style);
        let comp = new TextComponent(context,shape);
        comp.setPadding(padTop,padLeft,padBottom,padRight);
        return comp;
    },

    makeTextEdit:function(x, y, width, height, padTop=0, padLeft=0, padBottom=0, padRight=0){
        let dom = document.createElement("input");
        //TODO!!!
    }
}

export default TwoComp;
export {TwoCompponent,RectComponent,TextComponent};