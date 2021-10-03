import Two from "../../lib/two.js"
import LayoutComponent from "./LayoutComponent.js";

var twoCompContext = null;

class TwoCompponent extends LayoutComponent{
    
    #shape;
    #shapeDom;
    #shapeGroup = null;

    constructor(shape=null){
        super();
        this.shape=shape;
        /*
        if(!shape){
            this.#createGroup();
            this.shape=this.#shapeGroup;
        }*/
    }

    set shape(v){
        if(v){
            this.#shape=v;
            twoCompContext.bindOnce("afterUpdate",()=>this.updateDom());
        }else{
            this.#shape=null;
            this.#shapeDom=null;
        }
    }

    get shape(){
        return this.#shape;
    }

    get shapeDom(){
        return this.#shapeDom;
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
        this.#shapeGroup = twoCompContext.makeGroup();
        this.rect.addPropertyListener("x",(v)=> this.#shapeGroup.translation.set(this.rect.x,this.rect.y));
        this.rect.addPropertyListener("y",(v)=> this.#shapeGroup.translation.set(this.rect.x,this.rect.y));
    }

    setPadding(padTop=0,padLeft=0,padBottom=0,padHeight=0){
        this.padding.top = padTop;
        this.padding.left = padLeft;
        this.padding.bottom = padBottom;
        this.padding.height = padHeight;
    }

}

class PathComponent extends TwoCompponent{
    constructor(shape){
        super(shape);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
    }
}

class TextComponent extends TwoCompponent{
    constructor(shape){
        super(shape);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y+this.prefSize.height/2));
    }
}

class RectComponent extends TwoCompponent{
    constructor(shape){
        super(shape);
        this.rect.addPropertyListener("x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        this.rect.addPropertyListener("y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
        this.rect.addPropertyListener("width",(v)=>this.shape.width = v);
        this.rect.addPropertyListener("height",(v)=>this.shape.height = v);
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
    makeEmptyComponent: function(width=0, height=0,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new TwoCompponent(null);
        comp.prefSize.width = width;
        comp.prefSize.height = height;
        comp.padding.top = padTop;
        comp.padding.left = padLeft;
        comp.padding.bottom = padBottom;
        comp.padding.height = padHeight;
        return comp;
    },

    makeComponent: function(shape,width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let comp = new PathComponent(shape);
        this.setupComponent(comp,width, height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    setupComponent: function(comp,width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        comp.rect.width = comp.prefSize.width = width;
        comp.rect.height = comp.prefSize.height = height;
        comp.setPadding(padTop,padLeft,padBottom,padHeight);
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
    makeRectangle: function(x, y, width, height,padTop=0,padLeft=0,padBottom=0,padHeight=0){
        //let shape = twoCompContext.makeRectangle(x, y, width, height);
        let shape = new Two.Rectangle(x, y, width, height);
        let comp = new RectComponent(shape);
        this.setupComponent(comp,width,height,padTop,padLeft,padBottom,padHeight);
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
    makeRoundedRectangle: function(x, y, width, height, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        //let shape = twoCompContext.makeRectangle(x, y, width, height);
        let shape = new Two.RoundedRectangle(x, y, width, height);
        let comp = new RectComponent(shape);
        this.setupComponent(comp,width,height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeTwoObj:function(obj, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let rect = obj.getBoundingClientRect();
        let comp = this.makeComponent(obj,rect.width,rect.height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },

    makeText:function(text, style={baseline:"top",alignment:"left"},x=0,y=0, padTop=0,padLeft=0,padBottom=0,padHeight=0){
        let shape = new Two.Text(text,x,y,style);
        let comp = new TextComponent(shape);
        let r = shape.getBoundingClientRect();
        this.setupComponent(comp,r.width,r.height,padTop,padLeft,padBottom,padHeight);
        return comp;
    },
/*
    getSubShapes:function(comp){
        shapes=[]
        for(const obj of comp.objs){
            shapes.push(obj);
        }
        return shapes;
    },*/

    makeTextEdit:function(x, y, width, height, padTop=0, padLeft=0, padBottom=0, padHeight=0){
        let dom = document.createElement("input");
        //TODO!!!
    },

    setContext:function(context){
        twoCompContext = context;
    },

    addUpdateTodo:function(func){
        twoPendingEvents[twoCompContext]
    }
}

export default TwoComp;