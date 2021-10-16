import Two from "../../lib/two.js"
import LayoutComponent from "./LayoutComponent.js";
import AttrManager from "../../util/ValueChangeManager.js"
import EventPublisher from "../../util/Events.js";
class TwoCompponent extends LayoutComponent{
    
    _shape; // Two.js objects
    _shapeDom; // reference to HTML DOM, avaliable ONLY after context updates
    _shapeGroup = null; // create when we need
    context; // Graphic Context (or canvas, if you think it is proper)
    _validDom=false; //check if update HTML DOM should be updated
    #afterDomUpdateEvent = new EventPublisher(); //this only invoke once, and reset after each event
    //#layer = 0; 

    constructor(context,shape=null){
        super();
        this.context=context;
        this.shape=shape;
    }

    set shape(v){
        if(v){
            if(this._shape && this._shapeGroup){
                this._shapeGroup.remove(this._shape);
            }
            this._shape=v;
            this.context.bindOnce("afterUpdate",()=>this.updateDom());
            this._validDom=false;

            let r = this._shape.getBoundingClientRect();
            this.prefSize.width = r.width;
            this.prefSize.height = r.height;

            if(this._shape && this._shapeGroup){
                this._shapeGroup.add(this._shape);
            }

        }else{
            this._shape=null;
            this._shapeDom=null;
        }
        this.invalidLayout();
    }

    get shape(){
        return this._shape;
    }

    get shapeDom(){
        return this._shapeDom;
    }

    get context(){
        return this.context;
    }

    updateDom(){
        if(this._shape && !this._validDom){
            for(const i of this.objs){ //ensure child objects are updated
                i.updateDom();
            }

            this._shapeDom = document.getElementById(this._shape.id);
            this._validDom = this._shapeDom!=null;
            if(this._validDom){
                this.#afterDomUpdateEvent.notify(this,this.shapeDom);
                this.#afterDomUpdateEvent.clear();
            }
        }
    }

    doAfterUpdateDom(func,params=null){
        //this.context.bindOnce("afterUpdate",()=>func(params));
        if(this._validDom){
            func(params,this);
        }else{
            this.#afterDomUpdateEvent.add((source,paramAnother)=>func(params,source,paramAnother));
        }
    }

    addObject(obj,constrain=null){
        super.addObject(obj,constrain);
        if(!this._shapeGroup){
            this.#createGroup();
        }
        if(obj._shapeGroup){
            this._shapeGroup.add(obj._shapeGroup);
        }else if(obj.shape){
            this._shapeGroup.add(obj.shape);
        }
    }

    removeObject(obj){
        super.removeObject(obj);
        if(this._shapeGroup){
            this._shapeGroup.remove(obj.shape);
        }
    }

    #createGroup(){
        this._shapeGroup = this.context.makeGroup();
        if(this._shape){
            this._shapeGroup.add(this._shape);
            this._shape.translation.set(0,0);
            AttrManager.removePropertyAllListener(this.rect,"x"); // reomve default listener installed by rectangle
            AttrManager.removePropertyAllListener(this.rect,"y");
        }
        AttrManager.addPropertyListener(this.rect, "x",(v)=> this._shapeGroup.translation.set(this.rect.x,this.rect.y));
        AttrManager.addPropertyListener(this.rect, "y",(v)=> this._shapeGroup.translation.set(this.rect.x,this.rect.y));
    }

    setPadding(padTop=0,padLeft=0,padBottom=0,padReight=0){
        this.padding.top = padTop;
        this.padding.left = padLeft;
        this.padding.bottom = padBottom;
        this.padding.right = padReight;
        this.invalidLayout();
    }

    /**
     * Init group first, otherwise we might encounter sequence issues for sub components :(
     */
    initGroup(){
        if(!this._shapeGroup){
            this.#createGroup();
        }
    }

    get id(){
        if(this._shapeGroup){
            return this._shapeGroup.id;
        }else{
            return this._shape.id;
        }
    }

    update(){
        this.context.update();
    }

    /**
     * Get absolute position in the canvas
     * @returns 
     */
    getAbsoluteCanvasPos(){
        let fatherPos = {x:0,y:0};
        if(this.father){
            fatherPos.x=this.father.rect.x;
            fatherPos.y=this.father.rect.y;
        }
        return {
            x:this.rect.x+fatherPos.x,
            y:this.rect.y+fatherPos.y,
            width:this.rect.width,
            height:this.rect.height
        };
    }

    /**
     * Get absolute position in the whole web
     * Only avaliable after HTML Dom is generated
     * @returns 
     */
    getAbsoluteDomPos(){
        if(!this.shapeDom){
            return null;
        }
        return this.shapeDom.getBoundingClientRect();
    }

    removeFromScene(){
        this.context.remove(this.shape);
        this._shapeDom=null;
        this._validDom=false;
        if(this._shapeGroup){
            this.context.remove(this._shapeGroup);
            this._shapeGroup=null;
            for(let obj of this.objs){
                obj.removeFromScene();
            }
        }
    }

    setTop(){
        if(this.father){
            let father_ = this.father;
            this.father.removeObject(this);
            father_.addObject(this);
        }else{
            this.context.remove(this.shape);
            this.context.add(this.shape);
        }
        
    }

}

class PathComponent extends TwoCompponent{
    points;
    constructor(context,points){
        super(context,null);
        this.points = points;
        this.shape = new Two.Path(points,true,false);
        this.shape.translation.set(0,0);
        AttrManager.addPropertyListener(this.rect, "x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        AttrManager.addPropertyListener(this.rect, "y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
    }

}

class TextComponent extends TwoCompponent{
    constructor(context,shape=null){
        super(context,shape);
        AttrManager.addPropertyListener(this.rect, "x",(x)=>this.shape.translation.set(x,this.shape.translation.y+this.rect.height/2));
        AttrManager.addPropertyListener(this.rect, "y",(y)=>this.shape.translation.set(this.shape.translation.x,y+this.rect.height/2));
        // adjust according to default text align settings
        // TODO: support more text align settings
        this.doAfterUpdateDom(()=>{this.shapeDom.style.userSelect="none";})
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
        //this.context.add(this.shape);
        
        AttrManager.addPropertyListener(this.rect,"x",(x)=>this.shape.translation.set(x,this.shape.translation.y));
        AttrManager.addPropertyListener(this.rect,"y",(y)=>this.shape.translation.set(this.shape.translation.x,y));
        AttrManager.addPropertyListener(this.rect,"width",(v)=>this.width = v);
        AttrManager.addPropertyListener(this.rect,"height",(v)=>this.height = v);
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

class DomComponent extends TwoCompponent{
    installedDom=false;
    constructor(context){
        super(context,null);
        context.addDomComp(this);
    }

    // update position and svg attributes, manipulate by ourselves
    updateDomInfo(){

    }

    installDom(context){
        this.installedDom=true;
        this._validDom=true;
    }

    removeFromScene(){
        this.context.removeDomComp(this);
        this._shapeDom.remove();
    }
}

/**
 * TextEdit in SVG
 * This class is a bit special
 * Since Two.js not support TextEdit in SVG, we manipulate doms by ourselves
 * The context will handle this in update() method.
 */
class TextEditComponent extends DomComponent{
    _textdiv=null;
    _textnode=null;
    _text="";
    constructor(context){
        super(context);
        this.generateDom();
        AttrManager.addPropertyListener(this.rect,"x",(x)=>this.updateDomInfo());
        AttrManager.addPropertyListener(this.rect,"y",(y)=>this.updateDomInfo());
        AttrManager.addPropertyListener(this.rect,"width",(v)=>{if(this._shapeDom)this._shapeDom.setAttribute("width",this.rect.width)});
        AttrManager.addPropertyListener(this.rect,"height",(v)=>{if(this._shapeDom)this._shapeDom.setAttribute("height",this.rect.height)});
        AttrManager.addPropertyListener(this.prefSize,"height",(v)=>this._setLimitSize(this.prefSize.width,this.prefSize.height));
        AttrManager.addPropertyListener(this.prefSize,"width",(v)=>this._setLimitSize(this.prefSize.width,this.prefSize.height));
    }

    //refer: http://jsfiddle.net/brx3xm59/
    generateDom(){
        let myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        
        let textdiv = document.createElement("div");
        let textnode = document.createTextNode(this._text);
        textdiv.appendChild(textnode);
        myforeign.style.alignItems="center";
        myforeign.style.display ="flex";
        myforeign.style.justifyContent ="center";
        myforeign.style.userSelect = textdiv.style.userSelect="none";
        //textdiv.setAttribute("contentEditable", "true");
        textdiv.setAttribute("tabindex", "0"); // allow "onBlur" event
        //textdiv.setAttribute("width", "100%");
        //textdiv.setAttribute("height", "100%");
        textdiv.style.alignItems="center";
        textdiv.style.alignText="center";
        textdiv.style.justifyContent="center";
        textdiv.style.display ="flex";
        myforeign.setAttribute("width", "50px");
        myforeign.setAttribute("height", "22px");
        myforeign.style.padding = textdiv.style.padding = "0px";
        myforeign.style.margin = textdiv.style.margin = "0 auto";
        //textdiv.style.marginTop="10px";
        //textdiv.style.display="inline-block";
        textdiv.style.fontSize = "12px";
        myforeign.style.border = "1px solid black";
        myforeign.setAttributeNS(null, "transform", "translate(" + 0 + " " + 0 + ")");
       
        myforeign.appendChild(textdiv);

        // avoid selection
        textdiv.addEventListener("mousedown",()=>{this._textdiv.setAttribute("contentEditable", "true");});
        textdiv.addEventListener("blur",()=>{this._textdiv.setAttribute("contentEditable", "false");});
        this._shapeDom = myforeign;
        this._textdiv = textdiv;
        this._textnode = textnode;
    }

    installDom(svg){
        super.installDom(svg);
        svg.appendChild(this._shapeDom);
    }

    get textdiv(){
        return this._textdiv;
    }

    _setLimitSize(width,height){
        if(!this._shapeDom){
            this.doAfterUpdateDom(()=>this._setLimitSize(width,height));
            return;
        }
        this._shapeDom.setAttribute("width",width+"px");
        this._shapeDom.setAttribute("height",height+"px");
        this._textdiv.style.fontSize = (Math.min(width,height)-10)+"px";
    }

    _updateDomSize(){
        if(!this._shapeDom){
            return;
        }
        this._shapeDom.setAttribute("width",this.rect.width);
        this._shapeDom.setAttribute("height",this.rect.height);
    }

    updateDomInfo(){
        if(!this._shapeDom){
            return;
        }
        let pos = this.getAbsoluteCanvasPos();
        this._shapeDom.setAttributeNS(null, "transform", "translate(" + (pos.x-pos.width/2) + " " + (pos.y-pos.height/2) + ")");
    }

    set text(v){
        if(this._textdiv){
            this._textdiv.innerHTML=v;
        }
        this._text=v;
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
export {TwoCompponent,RectComponent,TextComponent,PathComponent, TextEditComponent};