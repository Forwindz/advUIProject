const { TextComponent } = require("../ui/layouts/TwoComponents");

class AssetItemUI extends TextComponent{

    data;

    constructor(context,data){
        super(
            context,
            new Two.Text(data.name,0,0,{baseline:"top",alignment:"left"}),
            false);
        this.data = data;
        this.setPadding(6,4,0,10);
        this.styleTag = "assetItem";
    }


}

export default AssetItemUI;