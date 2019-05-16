const mod = (x, n) => (x % n + n) % n; //modulo func for negative nbs;

window.counter = 1;

export class Cell{

    constructor(x,y,val){
        this.neighbours = {};
        this.x = x;
        this.y = y;
        this.val = val;
        this.setColor();

    }

    toString(){
        return this.val;
    }

    setColor(){
        if(this.val == 0)
            this.color = "#ffffff";
        else
            this.color =  "hsl(" + (this.val*29)%360 + ", 75%, 50%)";
    }

    click(){
        this.val = window.counter++;
        this.setColor();
        this.drawCell();
        return this;
    }

    drawCell(size = window.gridSize, ctx = window.ctx) {
        // console.log(this);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x*size, this.y*size, size, size);
        if(window.numbers){
            ctx.font = Math.round(size*0.5).toString()+"px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(this.val.toString(), this.x*size+size/2, this.y*size+size/2);
        }
        return this;
    };

    nextTourValue(){
        let neighbours = [];
        Object.keys(this.neighbours).forEach(i=>{
            let value =this.neighbours[i].val;
            if(value!=0)
            neighbours.push(value);
        });


        let val = neighbours.reduce(
            (a, b, i, arr) =>
                (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b),
            null);

        return val?val:0;
    }


}


