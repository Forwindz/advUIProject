import { removeArrayValue } from "../../util/utils"

function vecLength(a){
    return Math.sqrt(a.x*a.x+a.y*a.y)
}

function vecSub(a,b){
    return {
        x:a.x-b.x,
        y:a.y-b.y
    }
}

function vecAdd(a,b){
    return {
        x:a.x+b.x,
        y:a.y+b.y
    }
}

function vecMult(a,s){
    return {
        x:a.x*s,
        y:a.y*s
    }
}

function vecDiv(a,s){
    return {
        x:a.x/s,
        y:a.y/s
    }
}

function vecNormalize(a){
    let len = 1.0/vecLength(a);
    return vecMult(a,len);
}

function vecDistance(a,b){
    return vecLength(vecSub(a,b));
}

class ForcePoint{

    refPoint = null; //data like {x:0,y:0}
    mass = 1.0;
    fixed=false;
    friction = 0.2;
    enable=true;

    speed = {x:0,y:0};
    relatedForce = [];
    force = {x:0,y:0};
    limit=50;

    constructor(refPoint){
        this.refPoint = refPoint;
    }

    update(deltaTime){
        if(this.fixed){
            this.force.x=0;
            this.force.y=0;
            return;
        }
        // we do not use complex simulation here, 
        // directly add might cause numerical errors :(
        this.speed.x+=this.force.x*deltaTime/this.mass;
        this.speed.y+=this.force.y*deltaTime/this.mass;
        this.refPoint.x+=this.#cap(this.speed.x*deltaTime);
        this.refPoint.y+=this.#cap(this.speed.y*deltaTime);
        this.speed.x*=(1-this.friction);
        this.speed.y*=(1-this.friction);
        this.force.x=0;
        this.force.y=0;
    }

    #cap(v){
        return Math.max(-this.limit,Math.min(this.limit,v));
    }

    addForce(x,y){
        this.force.x+=x;
        this.force.y+=y;
    }
}

class ForceSpring{
    refPoint1=null;
    refPoint2=null;
    fp1=null;
    fp2=null;
    enable=true;
    k = 0.01; //elasticity, higher means larger force
    orgLength = 10.0;

    constructor(fp1,fp2){
        this.refPoint1=fp1.refPoint;
        this.refPoint2=fp2.refPoint;
        this.fp1=fp1;
        this.fp2=fp2;
        this.orgLength = vecDistance(this.refPoint1,this.refPoint2);
    }

    
    applyForce(){
        let curDelta = vecSub(this.refPoint1,this.refPoint2);
        let curDis = Math.max(0.01,vecLength(curDelta));
        let d = curDis-this.orgLength;
        let force = vecMult(curDelta,this.k*d/curDis);
        this.fp2.addForce(force.x,force.y);
        this.fp1.addForce(-force.x,-force.y);
        //console.log("Ffs "+force.x+" "+force.y);
    }

    //check related point
    checkForce(p){
    }
}

/**
 * Simulate force like Coulomb force
 * the point is the center
 */
class ForcePointField{
    refPoint=null;
    //support anisotropy 
    rangeX=50.0;
    rangeY=50.0;
    strengthX=10.0;
    strengthY=10.0;
    limit=100;
    enable=true;

    avoid=[];

    constructor(ref1){
        this.refPoint = ref1;
    }
    
    //input: point lists
    applyForce(){
        let d,fx,fy;
        // O(n), use hash is much better (maybe?)
        for(const p of this.#relatedPoints){
            d = this.#getDelta(p);
            let len = vecLength(d);
            let norm = vecDiv(d,Math.max(1e-3,len));
            let range = Math.max(this.rangeY,this.rangeX);
            let xfactor=Math.max(0,1.0-Math.abs(len/range));
            let yfactor=Math.max(0,1.0-Math.abs(len/range));
            fx = this.strengthX*xfactor*norm.x;
            fy = this.strengthY*yfactor*norm.y;
            fx = Math.max(-this.limit,Math.min(this.limit,fx));
            fy = Math.max(-this.limit,Math.min(this.limit,fy));
            p.addForce(fx,fy);
            //console.log("repel "+fx+" "+fy);
        }

    }

    #relatedPoints=[];

    checkForce(points){
        this.#relatedPoints=[];
        let d=null;
        for(const p of points){
            if(this.avoid.includes(p)){
                continue;
            }
            d = this.#getDelta(p);
            let range = Math.max(this.rangeX,this.rangeY);
            if(Math.abs(d.x)<range && Math.abs(d.y)<range){
                this.#relatedPoints.push(p);
            }
        }
    }

    addAvoid(obj){
        if(obj instanceof Array){
            this.avoid = this.avoid.concat(obj);
        }else{
            this.avoid.push(obj);
        }
    }

    removeAvoid(obj){
        if(obj instanceof Array){
            for(const o of obj){
                removeArrayValue(this.avoid,o);
            }
        }else{
            removeArrayValue(this.avoid,obj);
        }
    }

    #getDelta(p){
        if(this.refPoint.width){
          return vecAdd({x:-this.refPoint.width/2,y:-this.refPoint.height/2},vecSub(p.refPoint,this.refPoint));
        }else{
            
            return vecSub(p.refPoint,this.refPoint);
        }
    }
}

class ForceToPoint{
    strength=10;
    p=null;
    refPoint=null;
    enable=true;
    constructor(referPoint,p){
        this.p=p;
        this.refPoint=referPoint;
    }

    applyForce(){
        let d = vecSub(this.refPoint,this.p.refPoint);
        d.x = Math.max(-30,Math.min(30,d.x));
        d.y = Math.max(-30,Math.min(30,d.y));
        let fx = this.strength * d.x;
        let fy = this.strength * d.y;
        this.p.addForce(fx,fy);
    }

    checkForce(points){}
}


// manage all force and points
class PhyContext{
    points = [];
    forces = [];
    deltaTime = 30; //currently we did not support change
    deltaCheckMulti = 10;
    #innerCount=0;
    constructor(){
        setInterval(()=>this.update(),this.deltaTime);
    }

    addPoint(refPoint,fixed=false,mass=0.005,friction=0.65){
        let p = new ForcePoint(refPoint);
        p.fixed=fixed;
        p.mass=mass;
        p.friction=friction;
        this.points.push(p);
        return p;
    }

    addSpring(f1,f2,k=0.2){
        let p = new ForceSpring(f1,f2);
        p.k=k;
        this.forces.push(p);
        return p;
    }

    addForceField(refPoint,rx=50,ry=50,fx=200,fy=200){
        let p = new ForcePointField(refPoint);
        p.rangeX=rx;
        p.rangeY=ry;
        p.strengthX=fx;
        p.strengthY=fy;
        this.forces.push(p);
        return p;
    }

    addForceToPoint(refPoint,po,f=0.5){
        let p =new ForceToPoint(refPoint,po);
        p.strength=f;
        this.forces.push(p);
        return p;
    }

    #logged=false;
    update(){
        if(this.#innerCount==0){
            for(const force of this.forces){
                if(force.enable)
                    force.checkForce(this.points);
            }
            if(!this.#logged){
                console.log(this);
                this.#logged=true;
            }
            
        }else if (this.#innerCount>this.deltaCheckMulti){
            this.#innerCount=-1;
        }
        
        let deltaS=this.deltaTime/1000.0;
        for(const force of this.forces){
            if(force.enable)
                force.applyForce();
        }
        for(const point of this.points){
            if(point.enable)
                point.update(deltaS);
        }

        this.#innerCount++;
    }

    remove(obj){
        if(obj instanceof ForcePoint){
            removeArrayValue(this.points,obj);
        }else{
            removeArrayValue(this.forces,obj);
        }
    }

    removes(objs){
        for(const obj of objs){
            this.remove(obj);
        }
    }
/*
    limit=10;
    range=20;
    point2point(p0,p1){
        let d = vecSub(p1.refPoint,p0.refPoint);
        let len = vecLength(d);
        let norm = vecDiv(d,Math.max(1e-3,len));
        let totalPower = this.strengthX*Math.max(0,1-len/this.range);
        let fx = totalPower*norm.x;
        let fy = totalPower*norm.y;
        fx = Math.max(-this.limit,Math.min(this.limit,fx));
        fy = Math.max(-this.limit,Math.min(this.limit,fy));
        p0.addForce(fx,fy);
        p1.addForce(-fx,-fy);
    }

    processPoints(){
        let len = this.points.length;
        for(let i=0;i<len;i++){
            for(let j=i+1;j<len;j++){
                this.point2point(this.points[i],this.points[j]);
            }
        }
    }*/
}

export {PhyContext,ForcePointField,ForcePoint,ForceSpring};

