"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Cell = require("./Cell");

var _Board = require("./Board");

window.start = function () {
    window.xCells = document.getElementById("xCells").valueAsNumber;
    window.yCells = document.getElementById("yCells").valueAsNumber;
    window.yCount = document.getElementById("yCount").valueAsNumber;
    window.xCount = document.getElementById("xCount").valueAsNumber;
    window.gridSize = (window.innerWidth - 35) / xCells;
    window.canvas = document.getElementById("workingCanvas");
    window.ctx = canvas.getContext("2d");
    window.canvas.width = xCells * window.gridSize;
    window.canvas.height = yCells * window.gridSize;
    window.setPeroidity();
    window.setNumbers();
    window.speed = 1000 / document.getElementById("speedMultiplier").valueAsNumber;

    window.board = new _Board.Board(window.xCells, window.yCells, window.gridSize);
    window.initState();
    board.drawGrid();
};

window.setPeroidity = function () {
    window.periodity = document.getElementById("peroid").checked;
};

window.setNumbers = function () {
    document.getElementById("yCount").setAttribute("max", window.yCells);
    document.getElementById("xCount").setAttribute("max", window.xCells);
    window.numbers = document.getElementById("numbers").checked;
};

var game;

window.run = function () {
    if (!game) {
        game = setInterval(function () {
            var newVals = window.board.cellsArray.map(function (line, yIndex) {
                return line.map(function (cell, xIndex) {
                    return cell.nextTourValue();
                });
            });
            //console.log(newVals);
            window.board.cellsArray.forEach(function (line, y) {
                return line.forEach(function (cell, x) {
                    if (newVals[y][x] != 0 && cell.val == 0) cell.val = newVals[y][x];
                    cell.setColor();
                    cell.drawCell();
                });
            });
            // board.drawGrid()
        }, 1000 / document.getElementById("speedMultiplier").valueAsNumber);
        document.getElementById("startBtn").textContent = "STOP";
    } else {
        clearInterval(game);
        game = null;
        document.getElementById("startBtn").textContent = "Start";
    }
};

window.resetCounter = function () {
    window.counter = 1;
};

window.initState = function (i, j) {
    var type = document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value;
    window.yCount = document.getElementById("yCount").valueAsNumber;
    window.xCount = document.getElementById("xCount").valueAsNumber;

    switch (type) {
        case "jednorodne":
            {
                document.getElementById("xCount").hidden = false;
                document.getElementById("yCount").hidden = false;
                document.getElementById("xPar").style.display = "inline";
                document.getElementById("yPar").style.display = "inline";
                document.getElementById("yPar").innerHTML = "yCount:";
                document.getElementById("xPar").innerHTML = "xCount:";
                var yC = window.yCount;
                var xC = window.xCount;
                var yL = window.board.cellsArray.length;
                var xL = window.board.cellsArray[0].length;
                var yParts = yL / (yC + 1);
                var xParts = xL / (xC + 1);
                for (var _i = 1; _i <= yC; _i++) {
                    for (var _j = 1; _j <= xC; _j++) {
                        window.board.cellsArray[Math.floor(yParts * _i)][Math.floor(xParts * _j)].click();
                    }
                }
                //console.log(window.board.cellsArray)
            }
            break;
        case "promien":
            {
                window.resetCounter();
                document.getElementById("xCount").hidden = false;
                document.getElementById("yCount").hidden = false;
                document.getElementById("xPar").style.display = "inline";
                document.getElementById("yPar").style.display = "inline";
                document.getElementById("yPar").innerHTML = "promień:";
                document.getElementById("xPar").innerHTML = "ilość:";
                document.getElementById("yCount").setAttribute("max", 9999);
                document.getElementById("xCount").setAttribute("max", 9999);

                var cells = [];
                var _j2 = 0;

                var _loop = function _loop(_i3) {
                    if (++_j2 > 1000) {
                        alert("probably impossible");
                        _i3 = xCount;
                        return {
                            v: void 0
                        };
                    } else {
                        var cell = window.board.cellsArray[Math.round(Math.random() * window.board.cellsArray.length) % window.board.cellsArray.length][Math.round(Math.random() * window.board.cellsArray[0].length) % window.board.cellsArray[0].length];
                        var val = true;

                        cells.forEach(function (circleCell) {
                            var dist = Math.sqrt(Math.pow(cell.x * window.gridSize - circleCell.x * window.gridSize, 2) + Math.pow(cell.y * window.gridSize - circleCell.y * window.gridSize, 2));
                            ctx.beginPath();
                            ctx.moveTo(cell.x * window.gridSize, cell.y * window.gridSize);
                            ctx.lineTo(circleCell.x * window.gridSize, circleCell.y * window.gridSize);
                            ctx.stroke();
                            if (dist < yCount * window.gridSize / 1.95) {
                                console.log(dist + "<" + yCount * window.gridSize / 2);
                                --_i3;
                                val = false;
                            }
                        });
                        if (val) {
                            ctx.beginPath();
                            ctx.arc(cell.x * window.gridSize + window.gridSize / 2, cell.y * gridSize + window.gridSize / 2, yCount * gridSize / 1.95, 0, 2 * Math.PI);
                            ctx.stroke();
                            cells.push(cell);
                        }
                    }
                    _i2 = _i3;
                };

                for (var _i2 = 0; _i2 < xCount; _i2++) {
                    var _ret = _loop(_i2);

                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                }
                cells.forEach(function (cell) {
                    return cell.click();
                });
            }
            break;
        case "losowe":
            {
                var count = window.yCount;
                document.getElementById("yCount").setAttribute("max", window.yCells * window.xCells - 1);
                document.getElementById("xCount").hidden = true;
                document.getElementById("yCount").hidden = false;

                document.getElementById("xPar").style.display = "none";
                document.getElementById("yPar").innerHTML = "ilość:";
                document.getElementById("yPar").style.display = "inline";
                var _i4 = 0;
                if (count >= window.xCells * window.yCells) {
                    alert("nice try;)");
                    break;
                }
                do {
                    var cell = window.board.cellsArray[Math.round(Math.random() * window.board.cellsArray.length) % window.board.cellsArray.length][Math.round(Math.random() * window.board.cellsArray[0].length) % window.board.cellsArray[0].length];
                    if (cell.val == 0) {
                        cell.click();
                        _i4++;
                    }
                } while (_i4 < count);
            }
            break;
        case "wyklinanie":
            {
                document.getElementById("xCount").hidden = true;
                document.getElementById("xPar").style.display = "none";
                document.getElementById("yCount").hidden = true;
                document.getElementById("yPar").style.display = "none";
                if (i != null && j != null) {
                    window.board.cellsArray[i][j].click();
                }
            }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    start();
    document.getElementById("workingCanvas").addEventListener('click', function (event) {

        var xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        var yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.board.cellsArray);
        if (document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value == "wyklinanie") window.initState(yClickIndex, xClickIndex);
        //window.board.cellsArray[yClickIndex][xClickIndex].click().getNeighbourCount();
    }, false);
});

function getCursorPosition(canvas, event) {
    var x, y;

    var canoffset = canvas.getBoundingClientRect();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    return [x, y];
}