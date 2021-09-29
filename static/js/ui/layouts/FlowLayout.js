

class FlowLayout extends Layout{
    static AlignType = {TOP:1,LEFT:2,BOTTOM:4,RIGHT:8,CENTER:0}; //TODO: simulate static const
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
    orient = Orientation.X;

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

    addObject(obj,constrain={align:AlignType.LEFT,newline:false}){
        super.addObject(obj);
    }

    removeObject(obj){
        super.removeObject(obj);
    }

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
        if(orient ==Orientation.X){
            let leftWidth = this.constrainSize.width;
            let widthTotal=0;
            
            let lineMaxHeight = 0;
            let lastElement=0;
            for(let i=0;i<this.#objs.length;i++){
                const w = obj.prefSize.width+obj.padding.left+obj.padding.right;
                const h = obj.prefSize.height+obj.padding.top+obj.padding.bottom;
                lineMaxHeight = Math.max(h,lineMaxHeight);
                if((leftWidth<0 || leftWidth>=w)&& !(obj.constrain.newline&& i!=0)){//enough width
                    widthTotal+=w;
                    if(leftWidth>0){
                        leftWidth-=w;
                    }
                }else{//inadequate width, place!
                    lineInfo.put({width:widthTotal,height:lineMaxHeight,elementBegin:lastElement,elementEnd:i});
                    lastElement=i;
                    leftWidth = this.constrainSize.width;
                    widthTotal=0;
                    lineMaxHeight = 0;
                }
            }
            lineInfo.put({width:widthTotal,height:lineMaxHeight,elementBegin:lastElement,elementEnd:this.#objs.length+1});

            // now, we place the component
            let yOffset = 0;
            let xOffset = 0;
            for(line of lineInfo){
                for(let j=line.elementBegin;j<line.elementEnd;j++){
                    const obj = this.#objs[j];
                    const w = obj.prefSize.width;
                    const h = obj.prefSize.height;
                    rect = {x:0,y:0,width:w,height:h};

                    if(obj.constrain.align & FlowLayout.AlignType.TOP){
                        rect.y = yOffset+obj.padding.top;
                    }else if(obj.constrain.align & FlowLayout.AlignType.BOTTOM){
                        rect.y = yOffset+line.height-h-obj.padding.bottom;
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
                    }

                    if(obj.constrain.align == FlowLayout.AlignType.CENTER){
                        leftWidth = Math.floor((this.constrainSize.width-line.width-obj.padding.left-obj.padding.right)/2);
                        leftHeight = Math.floor((line.height-h-obj.padding.bottom-obj.padding.top)/2);
                        rect.x = xOffset+obj.padding.left+leftWidth;
                        rect.y = yOffset+obj.padding.top+leftHeight;
                    }
                    
                    xOffset+=w+obj.padding.left+obj.padding.right;
                }
                yOffset+=line.height;
            }
        }else{
            console.warn("Y orient is not implemented for FlowLayout!");
        }
        super.reLayout();
    }

}