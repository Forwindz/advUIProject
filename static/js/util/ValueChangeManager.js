
class ValueChangeManager{
    static install(obj){
        obj.addPropertyListener = ValueChangeManager.prototype.addPropertyListener;
        obj.addPropertyListener = ValueChangeManager.prototype.addPropertiesListener;
        obj.addPropertyListener = ValueChangeManager.prototype.addAllPropertiesListener;
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
            this.addPropertyListener(name,listener);
        }
    }
}


export default ValueChangeManager;