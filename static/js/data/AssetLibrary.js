import {removeArrayValue} from "../util/utils.js"

import EventPublisher from "../util/Events.js"

class Asset{

    constructor(name,data,typeInfo="Node"){
        this.name=name;
        this.data=data;
        this.typeInfo=typeInfo;
    }
    name="";
    path; //absolute path, compare to the root Asset library
    data; // data, like Node
    typeInfo; //string, folder, node, data... and so on
}


class AssetLibrary{
    assets = []; //hierachy is not implemented currently

    addAssetEvent = new EventPublisher();
    removeAssetEvent = new EventPublisher();

    addAsset(asset){
        this.assets.push(asset);
        this.addAssetEvent.notify(this,asset);
    }

    removeAsset(asset){
        removeArrayValue(this.assets,asset);
        this.removeAssetEvent.notify(this,asset);
    }


}

export {Asset, AssetLibrary}