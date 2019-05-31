import {Cell} from "./Cell"
import {Board} from "./Board"

window.start = function () {
    console.log("START!!");
    window.xCells = document.getElementById("xCells").valueAsNumber;
    window.yCells = document.getElementById("yCells").valueAsNumber;
    window.yCount = document.getElementById("yCount").valueAsNumber;
    window.xCount = document.getElementById("xCount").valueAsNumber;
    window.gridSize = (window.innerWidth-35)/xCells;
    window.canvas = document.getElementById("workingCanvas");
    window.ctx = canvas.getContext("2d");
    window.canvas.width = xCells *  window.gridSize;
    window.canvas.height = yCells *  window.gridSize;
    window.setPeroidity();
    window.setNumbers();
    window.setDots();
    window.generated = false;
    window.updatePentagon();
    window.speed = 1000/document.getElementById("speedMultiplier").valueAsNumber;


    window.board = new Board(window.xCells,window.yCells, window.gridSize);
    window.initState();
    board.drawGrid();
};

window.setPeroidity = function(){
    window.periodity = document.getElementById("peroid").checked;
};

window.setNumbers = function () {
    document.getElementById("yCount").setAttribute("max",window.yCells);
    document.getElementById("xCount").setAttribute("max",window.xCells);
    window.numbers = document.getElementById("numbers").checked;
};

window.handleEnergyButton = function () {
    window.energyShow = document.getElementById('Energy').checked;

        window.cellsArray.forEach((line,y)=>line.forEach((cell,x)=> {
            if (window.energyShow === true) {
                window.cellsArray[y][x].drawEnergy();
            } else {
                window.cellsArray[y][x].updateColor();
                window.cellsArray[y][x].drawCell();
            }
        }));
};

window.handleIterations = function () {
    window.iterations = document.getElementById('iterations').valueAsNumber;


};

window.setDots = function () {
    window.dots = document.getElementById("dots").checked;
};

window.updateNeigbourhood = function () {
    resetCounter();
    start();
    document.getElementById('Pentagon').style.display = 'none';document.getElementById('pentagonP').innerHTML = '';
    document.getElementById('radius').style.display = 'none';document.getElementById('radiusP').innerHTML = '';
    if(document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value=='Pentagonalne'){
        document.getElementById('Pentagon').style.display = 'inline';
        document.getElementById('pentagonP').innerHTML = 'Pentagonalne:';
        document.getElementById('Gora').disabled = false;
        document.getElementById('Dol').disabled = false;
    }else if(document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value=='Heksagonalne'){
        document.getElementById('Gora').disabled = true;
        document.getElementById('Dol').disabled = true;
        document.getElementById('Pentagon').style.display = 'inline';
        document.getElementById('pentagonP').innerHTML = 'Pentagonalne:';
    }else if(document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value=='Promien'){
        document.getElementById('radius').style.display = 'inline';
        document.getElementById('radiusP').innerHTML = 'Promien:';
    }
};

window.updatePentagon = function () {
    switch(document.getElementById('Pentagon').options[document.getElementById('Pentagon').selectedIndex].value){
        case "Losowe":
            window.pentagon = null;
        break;
        case "Lewe":
            window.pentagon = 1;
        break;
        case "Prawe":
            window.pentagon = 2;
        break;
        case "Góra":
            window.pentagon = 3;
        break;
        case "Dół":
            window.pentagon = 4;
        break;

    }
};

var game;

window.run = function(){
    if(!game&&!generated){
        game = setInterval(()=>{
                var newVals = window.cellsArray.map((line, yIndex) => line.map((cell, xIndex) => cell.nextTourValue()));
                //console.log(newVals);
                let conti = false;
                window.cellsArray.forEach((line,y)=>line.forEach((cell,x)=>{
                    if(window.cellsArray[y][x].val !== newVals[y][x]) conti = true;
                    if(newVals[y][x]>0&&window.cellsArray[y][x].val==0)
                        window.cellsArray[y][x].val = newVals[y][x];
                    if(window.energyShow===true){
                        window.cellsArray[y][x].drawEnergy();
                    }else{
                        window.cellsArray[y][x].updateColor();
                        window.cellsArray[y][x].drawCell();
                    }
                }));
                if(conti === false){
                    window.generated = true;
                    window.mcGrowth();
                    clearInterval(game);
                    game = null;
                    document.getElementById("startBtn").textContent = "Start";
                }


               // board.drawGrid()
        },1000/document.getElementById("speedMultiplier").valueAsNumber);
        document.getElementById("startBtn").textContent = "STOP";
    }else{
        window.mcGrowth();
        clearInterval(game);
        game = null;
        document.getElementById("startBtn").textContent = "Start";
    }


};

window.resetCounter = function(){
    window.counter = 1;
};



window.initState = function(i,j){
    let type = document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value;
    window.yCount = document.getElementById("yCount").valueAsNumber;
    window.xCount = document.getElementById("xCount").valueAsNumber;
    switch(type){
        case "jednorodne":{
            document.getElementById("xCount").hidden = false;
            document.getElementById("yCount").hidden = false;
            document.getElementById("xPar").style.display = "inline";
            document.getElementById("yPar").style.display = "inline";
            document.getElementById("yPar").innerHTML = "yCount:";
            document.getElementById("xPar").innerHTML = "xCount:";
            let yC = window.yCount;
            let xC = window.xCount;
            let yL = window.cellsArray.length;
            let xL = window.cellsArray[0].length;
            let yParts = yL/(yC+1);
            let xParts = xL/(xC+1);
            for(let i=1;i<=yC;i++){
                for(let j=1;j<=xC;j++){
                  window.cellsArray[Math.floor(yParts*i)][Math.floor(xParts*j)].click();
                }
            }
            //console.log(window.cellsArray)
        }
        break;
        case "promien":{
            window.resetCounter();
            document.getElementById("xCount").hidden = false;
            document.getElementById("yCount").hidden = false;
            document.getElementById("xPar").style.display = "inline";
            document.getElementById("yPar").style.display = "inline";
            document.getElementById("yPar").innerHTML = "promień:";
            document.getElementById("xPar").innerHTML = "ilość:";
            document.getElementById("yCount").setAttribute("max",9999);
            document.getElementById("xCount").setAttribute("max",9999);


            let cells = [];
            let j = 0;
            for(let i=0;i<xCount;++i){
                if(++j>100){
                    alert("probably impossible");
                    break;
                    i=xCount;
                    return;
                }else{
                    let cell = window.cellsArray[Math.round(Math.random()*window.cellsArray.length)%window.cellsArray.length][Math.round(Math.random()*window.cellsArray[0].length)%window.cellsArray[0].length];
                    let val = true;
                    cells.forEach(circleCell=>{
                        let dist = Math.sqrt(Math.pow(cell.x*window.gridSize-circleCell.x*window.gridSize,2)+Math.pow(cell.y*window.gridSize-circleCell.y*window.gridSize,2));

                        if(dist<yCount*window.gridSize){
                            console.log(`${dist}<${yCount*window.gridSize/2}`);
                            i--;
                            val = false;
                        }else {
                            ctx.beginPath();
                            ctx.moveTo(cell.x*window.gridSize, cell.y*window.gridSize);
                            ctx.lineTo(circleCell.x*window.gridSize, circleCell.y*window.gridSize);
                            ctx.stroke();
                        }
                    });
                    if(val){
                        ctx.beginPath();
                        ctx.arc(cell.x*window.gridSize, cell.y*gridSize, yCount*gridSize, 0, 2 * Math.PI);
                        ctx.stroke();
                        cells.push(cell);
                    }
                }
            }
            cells.forEach(cell=>cell.click());
            document.getElementById("textBox").innerHTML = ("Udało się wygenerować:" + cells.length);
        }
        break;
        case "losowe":{
            let count = window.yCount;
            document.getElementById("yCount").setAttribute("max",window.yCells*window.xCells-1);
            document.getElementById("xCount").hidden = true;
            document.getElementById("yCount").hidden = false;

            document.getElementById("xPar").style.display = "none";
            document.getElementById("yPar").innerHTML = "ilość:";
            document.getElementById("yPar").style.display = "inline";
            let i = 0;
            if(count>=window.xCells*window.yCells){
                alert("nice try;)");
                break;
            }
            do{
                let cell = window.cellsArray[Math.round(Math.random()*window.cellsArray.length)%window.cellsArray.length][Math.round(Math.random()*window.cellsArray[0].length)%window.cellsArray[0].length];
                if(cell.val == 0){
                    cell.click();
                    i++;
                }

            }while(i<count);
        }
        break;
        case "wyklinanie":{
            document.getElementById("xCount").hidden = true;
            document.getElementById("xPar").style.display = "none";
            document.getElementById("yCount").hidden = true;
            document.getElementById("yPar").style.display = "none";
            if(i!=null&&j!=null){
                window.cellsArray[i][j].click();
                console.log(window.cellsArray[i][j]);
                //window.cellsArray[i][j].drawNeighbourhood(1);
            }
        }
    }


    window.cellsArray.forEach(l=>l.forEach(c=>{
        if(c.val>0){
            if(c.neighbours !== undefined){
                if(document.getElementById("NeighbourState").options[document.getElementById("NeighbourState").selectedIndex].value === "Promien"){
                    c.drawNeighbourhood(window.radiusVal,1);

                }
                c.neighbours.forEach(n=> n.drawDot(c.color));
            }
        }
    }))

};


document.addEventListener("DOMContentLoaded", function () {
    start();
    document.getElementById("workingCanvas").addEventListener('click', function (event) {

        let xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        let yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);
        if(document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value=="wyklinanie")
            window.initState(yClickIndex,xClickIndex);


    }, false);

    document.getElementById("workingCanvas").addEventListener('contextmenu', function (event) {
        event.preventDefault();
        let xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        let yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);

        console.log(window.cellsArray[yClickIndex][xClickIndex].getEnergy());
    }, false);

    document.getElementById("workingCanvas").addEventListener('auxclick', function (event) {
        event.preventDefault();
        let xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        let yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);
        console.log(window.lcc = window.cellsArray[yClickIndex][xClickIndex]);
    }, false);
});


function getCursorPosition(canvas, event) {
    var x, y;

    let canoffset = canvas.getBoundingClientRect();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor((canoffset.top)) + 1;

    return [x, y];
}




window.mcGrowth = function (iterations= window.iterations){

            let max=Number.MIN_VALUE;
            let min=Number.MAX_VALUE;

            window.energyArray = new Array(window.board.yCells).fill(null).map(()=> new Array(window.board.xCells).fill(null));
            let cells = [];
            cellsArray.forEach((line,y)=>line.forEach((cell,x)=>{
                energyArray[y][x] = new Cell(cell.x,cell.y,null);
                cells.push(cell)
            }));

                for(let i = 0;i<iterations;i++){
                    setTimeout(()=>{
                        console.log("ITERATION"+i);
                        cells.sort(() => Math.random() - 0.5);
                        cells.forEach(cell=>{
                            let newVal = cell.growMC();
                            if(newVal>max)max = newVal;
                            if(newVal<min)min = newVal;

                            cellsArray[Math.trunc(cell.y)][Math.trunc(cell.x)].val = newVal;

                        });
                        handleEnergyButton();
                    },1000/document.getElementById("speedMultiplier").valueAsNumber);
                }

        document.getElementById("startBtn").textContent = "START";

};
