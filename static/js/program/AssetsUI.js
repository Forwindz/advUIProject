import {RectComponent, TextComponent} from "../ui/layouts/TwoComponents.js";
import TwoComp from "../ui/layouts/TwoComponents.js"
import AttrManager from "../util/ValueChangeManager.js"
import FlowLayout from "../ui/layouts/FlowLayout.js"
import AssetItemUI from "./AssetItemUI.js"
class AssetsUI extends RectComponent{

    data;

    uis={};//name->data

    /**
     * A list of menus
     * @param {*} context 
     * @param {*} data 
     */
    constructor(context,data){
        super(context,null);
        this.data=data;
        this.styleTag = "AssetLib";
        this.generateUI();
    }

    generateUI(){
        this.layout = new FlowLayout();
        for(const d of this.data.assets){
            this.#generateAssetUI(d);
        }
        this.layout.reLayout();
    }

    #generateAssetUI(asset){
        let textComp = new AssetItemUI(this.context,asset);
        this.addObject(textComp,
            {
                align:FlowLayout.AlignType.LEFT|FlowLayout.AlignType.CENTERY,
                newline:true
            });
        this.uis[asset.name] = textComp;
    }




}

export default AssetsUI;