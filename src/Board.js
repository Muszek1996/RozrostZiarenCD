import {Cell} from "./Cell.js"

const mod = (x, n) => (x % n + n) % n; //modulo func for negative nbs;

export class Board{

    constructor(xCells,yCells,cellSize = window.gridSize){
        this.xCells = xCells;
        this.yCells = yCells;
        this.cellSize = cellSize;
        this.cellsArray = Array(yCells).fill(0).map((line,yIndex) => Array(xCells).fill(0).map((cell,xIndex)=>new Cell(xIndex,yIndex,0)));
        this.cellsArray.forEach((line,y,linesArray)=>{
            line.forEach((cell,x,rowArray)=>{
                if(window.periodity){
                    cell.neighbours.left = rowArray[mod(x-1,rowArray.length)];
                    cell.neighbours.right = rowArray[mod(x+1,rowArray.length)];
                    cell.neighbours.top = linesArray[mod(y-1,linesArray.length)][x];
                    cell.neighbours.bottom = linesArray[mod(y+1,linesArray.length)][x];
                }else{
                    cell.neighbours.left = (x>0)?rowArray[x-1]:{"val":0};
                    cell.neighbours.right = (x<rowArray.length-1)?rowArray[x+1]:{"val":0};
                    cell.neighbours.top = (y>0)?linesArray[y-1][x]:{"val":0};
                    cell.neighbours.bottom = (y<linesArray.length-1)?linesArray[y+1][x]:{"val":0};
                }
            })
        })

        // console.log(this.cellsArray);
    }

    drawGrid(width = window.canvas.width, height = window.canvas.height) {
        this.cellsArray.forEach((line,yCells)=>{
            let y = yCells*this.cellSize;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        });

        this.cellsArray[0].forEach((column,xCells)=>{
            let x = xCells*this.cellSize;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        });
        ctx.strokeStyle = 'grey';
        ctx.stroke();
    };
}

