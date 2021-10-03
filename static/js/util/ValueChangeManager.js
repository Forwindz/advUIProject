
class ValueChangeManager{
    static install(obj){
        obj.addPropertyListener = ValueChangeManager.prototype.addPropertyListener;
        obj.addPropertiesListener = ValueChangeManager.prototype.addPropertiesListener;
        obj.addAllPropertiesListener = ValueChangeManager.prototype.addAllPropertiesListener;
    }

    addPropertyListener(name, listener){
        const _this = this;
        _this[`_${name}`] = _this[name];
        Object.defineProperty(_this, name, {
            get: function() {
                return _this[`_${name}`];
            },
            set: function(newValue) {
                _this[`_${name}`] = newValue;
                listener(newValue);
            }
        });
    }

    addPropertiesListener(names, listener){
        for(const name of names){
            this.addPropertyListener(name,listener);
        }
    }
    addAllPropertiesListener(listener){
        for(const name in this){
            if(typeof this[name] == "function"){
                continue;
            }
            this.addPropertyListener(name,listener);
        }
    }
}


export default ValueChangeManager;