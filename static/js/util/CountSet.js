
/**
 * A Countable Set
 * Record all values, and the times they appears
 */
class CountSet{
    #dic=[];
    constructor(){

    }

    add(v){
        if (this.exist(v)){
            this.#dic[v]++;
        }else{
            this.#dic=1;
        }
    }

    remove(v){
        if (this.exist(v)){
            this.#dic[v]--;
            if(this.#dic[v]==0){
                delete this.#dic[v];
            }
        }
    }

    exist(v){
        return this.#dic.hasOwnProperty(v);
    }

    getTimes(v){
        if(this.exist(v)){
            return this.#dic[v];
        }else{
            return 0;
        }
    }
}

export default CountSet;