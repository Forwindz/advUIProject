
class ValueChangeManager{
    static install(obj){
        obj.addPropertyListener = ValueChangeManager.prototype.addPropertyListener;
        obj.addPropertiesListener = ValueChangeManager.prototype.addPropertiesListener;
        obj.addAllPropertiesListener = ValueChangeManager.prototype.addAllPropertiesListener;
    }

    /**
     * Add a listener to the property
     * This will create a property with `${name}`
     * And:
     *   `_f_${name}` to store functions (function or array of functions)
     *   `_${name}` to store actual values.
     * @param {string} name 
     * @param {function} listener 
     */
    addPropertyListener(name, listener){
        const _this = this;
        let funcName = `_f_${name}`;
        let innerName = `_${name}`;
        if (funcName in _this){
            if (_this[funcName] instanceof Array){ // third time or more
                _this[funcName].push(listener);
            }else{ // second time to define, we create an array to store listeners
                let tempFunc = _this[funcName];
                _this[funcName]=[tempFunc, listener];//create an array of listeners
                Object.defineProperty(_this, name, {
                    get: function() {
                        return _this[innerName];
                    },
                    set: function(newValue) {
                        _this[innerName] = newValue;
                        for(const x of _this[funcName]){
                            x(newValue);
                        }
                    }
                });
            }
        }else{
            // first time to define, just assign a function 
            _this[funcName] = listener;
            _this[innerName] = _this[name];
            Object.defineProperty(_this, name, {
                get: function() {
                    return _this[innerName];
                },
                set: function(newValue) {
                    _this[innerName] = newValue;
                    _this[funcName](newValue);
                }
            });
        }
        
    }

    addPropertiesListener(names, listener){
        for(const name of names){
            this.addPropertyListener(name,listener);
        }
    }
    addAllPropertiesListener(listener){
        for(const name in this){
            if(typeof this[name] == "function" || name[0]=='_'){
                continue;
            }
            this.addPropertyListener(name,listener);
        }
    }
}


export default ValueChangeManager;