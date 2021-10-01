import Layout from "./Layout.js"

class FlowLayout extends Layout{
    static AlignType = {TOP:1,LEFT:2,BOTTOM:4,RIGHT:8,CENTERX:16,CENTERY:32}; //TODO: simulate static const
    static Orientation = {X:0,Y:1};
    /**
     * Constrain size
     * if the size <=0, then it means no limitation
     * otherwise, we will follow the limitation
     */
    constrainSize = {width:-1,height:-1};
    /**
     * Oritantion, currently we only support X
     */
    orient = FlowLayout.Orientation.X;

    /**
     * @param {number} v
     */
    set constrainSize(v){
        this.constrainSize = v;
        this.invalid();
    }
    
    constructor(){
        super();
    }

    //addObject(obj,constrain={align:AlignType.LEFT,newline:false})

    /**
     * Relayout the elements
     * We will list the element one by one in a row,
     * Unless meet the newline:true tag
     * 
     * AlignType is just a hint
     * If there exists left space for components, the align will be applied.
     * Conflicts alignment should be avoided, I haven't resolved with this,
     * like we have a RIGHT and a LEFT alignment in both one line,
     * such cases will be ignored.
     * 
     * For X alignment, if you choose AlignType.Top/Buttom, this will only be applied to the current line
     * 
     */
    reLayout(){
        /**
         * each row's width/height, element assigned [elementBegin,elementEnd)
         */
        let lineInfo=[]
        if(this.orient ==FlowLayout.Orientation.X){
            let leftWidth = this.constrainSize.width;
            let widthTotal=0;
            let maxWidth = 0;
            let lineMaxHeight = 0;
            let lastElement=0;
            for(let i=0;i<this.objs.length;i++){
                const obj = this.objs[i];
                const w = obj.prefSize.width+obj.padding.left+obj.padding.right;
                const h = obj.prefSize.height+obj.padding.top+obj.padding.bottom;
                lineMaxHeight = Math.max(h,lineMaxHeight);
                if((this.constrainSize.width<0 || leftWidth>=w)&& !(obj.constrain.newline&& i!=0)){//enough width, newline is false
                    widthTotal+=w;
                    if(leftWidth>0){
                        leftWidth-=w;
                    }
                }else{//inadequate width, add one line!
                    lineInfo.push({width:widthTotal,height:lineMaxHeight,elementBegin:lastElement,elementEnd:i});
                    if(this.constrainSize.width<0){
                        maxWidth = Math.max(maxWidth,widthTotal);
                    }
                    lastElement=i;
                    leftWidth = this.constrainSize.width;
                    widthTotal=0;
                    lineMaxHeight = 0;
                }
            }
            lineInfo.push({width:widthTotal,height:lineMaxHeight,elementBegin:lastElement,elementEnd:this.objs.length});
            if(this.constrainSize.width<0){
                maxWidth = Math.max(maxWidth,widthTotal);
            }

            // now, we place the component
            let yOffset = 0;
            let xOffset = 0;
            for(const line of lineInfo){
                for(let j=line.elementBegin;j<line.elementEnd;j++){
                    const obj = this.objs[j];
                    console.log(obj);
                    console.log(j);
                    const w = obj.prefSize.width;
                    const h = obj.prefSize.height;
                    let rect = {x:0,y:0};

                    if(obj.constrain.align & FlowLayout.AlignType.TOP){
                        rect.y = yOffset+obj.padding.top;
                    }else if(obj.constrain.align & FlowLayout.AlignType.BOTTOM){
                        rect.y = yOffset+line.height-h-obj.padding.bottom;
                    }else if(obj.constrain.align & FlowLayout.AlignType.CENTERY){
                        let leftHeight = Math.floor((line.height-h-obj.padding.bottom-obj.padding.top)/2);
                        rect.y = yOffset+obj.padding.top+leftHeight;
                    }

                    if(obj.constrain.align & FlowLayout.AlignType.LEFT){
                        rect.x = xOffset+obj.padding.left;
                    }else if(obj.constrain.align & FlowLayout.AlignType.RIGHT){
                        /**
                         * LEFT             RIGHT
                         * |---|          |----------||----||--|
                         *      __________
                         *     ConstrainWidth-line.width
                         */
                        rect.x = xOffset+this.constrainSize.width-line.width+obj.padding.left;
                    }else if(obj.constrain.align & FlowLayout.AlignType.CENTERX){
                        let leftWidth = Math.floor((this.constrainSize.width-line.width-obj.padding.left-obj.padding.right)/2);
                        rect.x = xOffset+obj.padding.left+leftWidth;
                    }

                    obj.rect.x=rect.x;
                    obj.rect.y=rect.y;
                    
                    xOffset+=w+obj.padding.left+obj.padding.right;
                }
                yOffset+=line.height;
            }

            if(this.constrainSize.width<0){
                this.curObj.rect.width = maxWidth;
            }

            if(this.constrainSize.height<0){
                this.curObj.rect.height = yOffset;
            }
        }else{
            console.warn("Y orient is not implemented for FlowLayout!");
        }
        super.reLayout();
    }

}

export default FlowLayout;