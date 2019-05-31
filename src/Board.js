import {Cell} from "./Cell.js"

const mod = (x, n) => (x % n + n) % n; //modulo func for negative nbs;

export class Board {

    constructor(xCells, yCells, cellSize = window.gridSize) {
        window.board = this;
        window.board.xCells = xCells;
        window.board.yCells = yCells;
        window.board.cellSize = cellSize;

        window.cellsArray = Array(yCells).fill(0).map((line, yIndex) => Array(xCells).fill(0).map((cell, xIndex) => new Cell(xIndex + 0.25 + Math.random() / 2, yIndex + 0.25 + Math.random() / 2, 0)));
        window.cellsArray.forEach((line, y, linesArray) => {
            line.forEach((cell, x, rowArray) => {

                let neightbourhood = document.getElementById("NeighbourState").options[document.getElementById("NeighbourState").selectedIndex].value;

                switch (neightbourhood) {
                    case "Von Neumann": {
                        cell.neighbours = cell.getSquareNeighbourhood(1).circularNeighbours.filter(nb => Math.trunc(nb.x) === Math.trunc(cell.x) || Math.trunc(nb.y) === Math.trunc(cell.y));
                        if (cell.val > 0)
                            cell.neighbours.forEach(nb => nb.drawDot("#C0FF33"));
                    }
                        break;
                    case "Moore":
                        cell.neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;

                        break;
                    case "Pentagonalne":
                        let neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;


                        let random = window.pentagon || Math.random() * 4 + 1;

                        neighbours = neighbours.filter((nb, i) => {
                            let lottery = [i === 0 || i === 3 || i === 5 || i === 1 || i === 6, i === 2 || i === 4 || i === 7 || i === 1 || i === 6, i === 0 || i === 1 || i === 2 || i === 3 || i === 4, i === 5 || i === 6 || i === 7 || i === 3 || i === 4];
                            return lottery[Math.trunc(random) - 1];
                        });

                        cell.neighbours = neighbours;
                        break;
                    case "Heksagonalne": {
                        let neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;
                        let dir = window.pentagon;

                        if (window.pentagon === null) {
                            dir = Math.trunc(Math.random() + 0.5) + 1;
                        }

                        if (dir === 1) {
                            neighbours = neighbours.filter((nb, i) => {
                                return i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6;
                            });
                        } else if (dir === 2) {
                            neighbours = neighbours.filter((nb, i) => {
                                return i === 0 || i === 1 || i === 3 || i === 4 || i === 6 || i === 7;
                            });
                        }
                        cell.neighbours = neighbours;

                    }
                        break;
                    case "Promien": {

                        let nbours = cell.getCircularNeighbourhood(window.radiusVal);

                        if (cell.val > 0){
                            nbours.forEach(nb => nb.drawDot("#C0FF33"));
                            cell.drawNeighbourhood(window.radiusVal,1);
                        }

                        cell.neighbours =nbours;
                    }
                        break;
                }

            })
        })
    }

    drawGrid(width = window.canvas.width, height = window.canvas.height) {
        window.cellsArray.forEach((line, yCells) => {
            let y = yCells * this.cellSize;
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        });

        window.cellsArray[0].forEach((column, xCells) => {
            let x = xCells * this.cellSize;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        });
        ctx.strokeStyle = 'grey';
        ctx.stroke();
    };
}

