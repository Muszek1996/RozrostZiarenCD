const mod = (x, n) => (x % n + n) % n; //modulo func for negative nbs;

window.counter = 1;
window.max = Number.MIN_VALUE;
window.min = Number.MAX_VALUE;

const dK = function(cellA , cellB){
    return cellA.val === cellB.val;
};

const probability = function(deltaE,kt){
    if(deltaE<=0)return 1;
    else
        Math.exp(-(deltaE/kt));
};

export class Cell{

    constructor(x,y,val){
        this.x = x;
        this.y = y;
        this.val = val;
        this.neighbours = [];
        this.color = null;
        this.energy = null;
    }

    toString(){
        return this.val;
    }

    updateColor(color = null){
        if(this.val == 0)
            this.color = color||"#ffffff";
        else
            this.color =  color||"hsl(" + (this.val*29)%360 + ", 75%, 50%)";
    }

    click(){
        this.val = window.counter++;
        this.updateColor();
        this.drawCell();
        return this;
    }

    getEnergy(val = this.val){
        let energy = 0;

        this.neighbours.forEach(nb=>{
            energy += 1-dK({"val":val},nb)
        });
        let J = 1.0;  //Energia granicy ziarna;
        energy *= J;

        if(energy>window.max)window.max = energy;
        if(energy<window.min)window.min = energy;

        return energy;
    }



    deltaEnergy(){
        let eBefore = this.getEnergy();

        let newVal = this.neighbours[Math.trunc(Math.random()*this.neighbours.length)].val;

        let eAfter = this.getEnergy(newVal);

        return {"delta":eAfter-eBefore,"hisVal":newVal};
    }

    growMC(){
        let dE = this.deltaEnergy();
        let p = probability(dE.delta,window.kt);   //kt stała <0.1;6>;
        if(p>Math.random())return dE.hisVal;
        return this.val;
    }


    isInCircle(cell,radius){
        let dist= Math.sqrt(Math.pow(this.x-cell.x,2)+Math.pow(this.y-cell.y,2));
        if(dist<radius){//Meet diameter
            if(dist>0)
                return true;
        }
        return false;
    }

    getSquareNeighbourhood(distance){   //param{distance} = a/2 (half of side)
        var circularNeighbours = [];
        var fakeIndexes = [];
        //console.log(window.cellsArray);
        for(let y = Math.trunc(this.y)-distance;y<=Math.trunc(this.y)+distance;y++){   //square neighbourhood (MAX indexes)
            for(let x = Math.trunc(this.x)-distance;x<=Math.trunc(this.x)+distance;x++) {
                if(Math.trunc(this.y)===y&&Math.trunc(this.x)===x)continue;  //ignore itself
                let cell = null;
                try{
                    if(window.periodity){
                        cell = window.cellsArray[mod(y,window.board.yCells)][mod(x,window.board.xCells)];
                    }else{
                        if(x>=0&&x<window.board.xCells&&y>=0&&y<window.board.yCells)
                        cell = window.cellsArray[y][x];
                    }

                    fakeIndexes.push({"x":x,"y":y});
                }catch(e){
                    //console.info("neighbour not found probably peroidity off and cell beyond board");
                    //console.error(e);
                }
                if(cell)
                circularNeighbours.push(cell);
            }
        }
        return {circularNeighbours,fakeIndexes};
    }   //getsSquare neighbourhood with distance of param{distance}

    drawSquareNeighbourhood(distance,color = "#ffdd00"){
        this.getSquareNeighbourhood(distance).circularNeighbours.forEach(c=>c.drawDot(color))
    }

    getCircularNeighbourhood(radius){
        let circNeigbours = [];
        let potentialNeighbours = this.getSquareNeighbourhood(radius);

        if(window.periodity){
            potentialNeighbours.fakeIndexes.forEach((val,index)=>{
                let cell = potentialNeighbours.circularNeighbours[index];
                let xShift = cell.x - Math.trunc(cell.x);
                let yShift = cell.y - Math.trunc(cell.y);
                if(this.isInCircle({"x":val.x+xShift,"y":val.y+yShift},radius))
                    circNeigbours.push(cell);
            });
        }else{
            potentialNeighbours.circularNeighbours.forEach(cell=>{
                let xShift = cell.x - Math.trunc(cell.x);
                let yShift = cell.y - Math.trunc(cell.y);
                if(this.isInCircle({"x":cell.x+xShift,"y":cell.y+yShift},radius))
                    circNeigbours.push(cell);
            });
        }


        return circNeigbours;
    }

    drawCircularNeighbourhood(diameter,color = "#fb8f00"){
        this.getCircularNeighbourhood(diameter).forEach(e=>e.drawDot(color));
    }


    drawNeighbourhood(radius,drawCircle=1,color1="#aae5ff",color2="#0300fc"){
        if(window.dots)
        this.drawSquareNeighbourhood(radius,color1);
        this.drawCircularNeighbourhood(radius,color2);
        let size = window.gridSize;
        let scaledRadius = radius * size;
        if(drawCircle){
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.arc(this.x*size, this.y*size, scaledRadius, 0, 2 * Math.PI);
            ctx.stroke();

            if(window.periodity){
                let boardW = window.board.xCells*size;
                let boardH = window.board.yCells*size;
                for(let X = -boardW;X<=boardW;X+=boardW)
                    for(let Y = -boardH;Y<=boardH;Y+=boardH){
                        ctx.beginPath();
                        let pointX =this.x*size +X;
                        let pointY =this.y*size +Y;
                        ctx.arc(pointX, pointY, scaledRadius, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
            }  //teleportedCircles;)
        }

    }

    drawDot(color = "#ffffff"){
        let size = window.gridSize;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x*size, this.y*size, size/4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    drawNumber(val = null,color = "#3f3f3f"){
        let numb = val || this.val;

        let size = window.gridSize;
        ctx.font = Math.round(size*0.5).toString()+"px Arial";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(numb.toString(), Math.trunc(this.x)*size+size/2, Math.trunc(this.y)*size+size/2);
    }

    drawEnergy(){
            this.energy = this.getEnergy();

        let size = window.gridSize;
        ctx.globalAlpha = 1;
        const scale = (num, in_min, in_max, out_min, out_max) => {
            return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        };
        let brightness = scale(this.energy,window.min,window.max,75,100);


        ctx.fillStyle = "hsl(" + 0 + ", 75%, "+ (100-brightness)*4+"%)";
        ctx.fillRect(Math.trunc(this.x)*size, Math.trunc(this.y)*size, size, size);

        if(window.dots)
            this.drawDot();

        if(window.numbers)
            this.drawNumber(this.energy);
        ctx.restore();
        return this;
    }

    drawCell(size = window.gridSize, ctx = window.ctx) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.trunc(this.x)*size, Math.trunc(this.y)*size, size, size);

        if(window.dots)
            this.drawDot();

        if(window.numbers)
            this.drawNumber();
        ctx.restore();
        return this;
    };

    nextTourValue(){
        let dominatingNeighbours = [];
        this.neighbours.forEach(i=>{
            let value = i.val;
            if(value!==0)
                dominatingNeighbours.push(value);
        });
        //console.log(dominatingNeighbours);

        //console.log(dominatingNeighbours);
        let val = dominatingNeighbours.reduce(
            (a, b, i, arr) =>
                (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b),
            null);
        if(this.val>0)return this.val;

        return val?val:0;
    }


}


