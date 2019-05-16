import {Cell} from "./Cell"
import {Board} from "./Board"

window.start = function () {
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

var game;

window.run = function(){
    if(!game){
        game = setInterval(()=>{
                let newVals = window.board.cellsArray.map((line, yIndex) => line.map((cell, xIndex) => cell.nextTourValue()));
                //console.log(newVals);
                window.board.cellsArray.forEach((line,y)=>line.forEach((cell,x)=>{
                    if(newVals[y][x]!=0&&cell.val==0)
                    cell.val = newVals[y][x];
                    cell.setColor();
                    cell.drawCell();
                }));
               // board.drawGrid()
        },1000/document.getElementById("speedMultiplier").valueAsNumber);
        document.getElementById("startBtn").textContent = "STOP";
    }else{
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
            let yL = window.board.cellsArray.length;
            let xL = window.board.cellsArray[0].length;
            let yParts = yL/(yC+1);
            let xParts = xL/(xC+1);
            for(let i=1;i<=yC;i++){
                for(let j=1;j<=xC;j++){
                    window.board.cellsArray[Math.floor(yParts*i)][Math.floor(xParts*j)].click()
                }
            }
            //console.log(window.board.cellsArray)
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
            for(let i=0;i<xCount;i++){
                if(++j>1000){
                    alert("probably impossible");
                    i=xCount;
                    return;
                }else{
                    let cell = window.board.cellsArray[Math.round(Math.random()*window.board.cellsArray.length)%window.board.cellsArray.length][Math.round(Math.random()*window.board.cellsArray[0].length)%window.board.cellsArray[0].length];
                    let val = true;

                    cells.forEach(circleCell=>{
                        let dist = Math.sqrt(Math.pow(cell.x*window.gridSize-circleCell.x*window.gridSize,2)+Math.pow(cell.y*window.gridSize-circleCell.y*window.gridSize,2));
                        ctx.beginPath();
                        ctx.moveTo(cell.x*window.gridSize, cell.y*window.gridSize);
                        ctx.lineTo(circleCell.x*window.gridSize, circleCell.y*window.gridSize);
                        ctx.stroke();
                        if(dist<yCount*window.gridSize/1.95){
                            console.log(`${dist}<${yCount*window.gridSize/2}`);
                            --i;
                            val = false;
                        }
                    });
                    if(val){
                        ctx.beginPath();
                        ctx.arc(cell.x*window.gridSize+window.gridSize/2, cell.y*gridSize+window.gridSize/2, yCount*gridSize/1.95, 0, 2 * Math.PI);
                        ctx.stroke();
                        cells.push(cell);
                    }
                }
            }
            cells.forEach(cell=>cell.click());
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
                let cell = window.board.cellsArray[Math.round(Math.random()*window.board.cellsArray.length)%window.board.cellsArray.length][Math.round(Math.random()*window.board.cellsArray[0].length)%window.board.cellsArray[0].length];
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
                window.board.cellsArray[i][j].click();
            }
        }
    }

};


document.addEventListener("DOMContentLoaded", function () {
    start();
    document.getElementById("workingCanvas").addEventListener('click', function (event) {

        let xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        let yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.board.cellsArray);
        if(document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value=="wyklinanie")
        window.initState(yClickIndex,xClickIndex);
        //window.board.cellsArray[yClickIndex][xClickIndex].click().getNeighbourCount();
    }, false);
});

function getCursorPosition(canvas, event) {
    var x, y;

    let canoffset = canvas.getBoundingClientRect();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor((canoffset.top)) + 1;

    return [x, y];
}

