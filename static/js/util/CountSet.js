
/**
 * A Countable Set
 * Record all values, and the times they appears
 */
class CountSet{
    #dic=[];
    constructor(){

    }

    add(v,data_){
        if (this.exist(v)){
            this.#dic[v].count++;
        }else{
            this.#dic={count:1,data:data_};
        }
    }

    remove(v){
        if (this.exist(v)){
            this.#dic[v].count--;
            if(this.#dic[v].count==0){
                delete this.#dic[v];
            }
        }
    }

    exist(v){
        return this.#dic.hasOwnProperty(v);
    }

    getTimes(v){
        if(this.exist(v)){
            return this.#dic[v].count;
        }else{
            return 0;
        }
    }
}

export default CountSet;