(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cell = require("./Cell.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mod = function mod(x, n) {
    return (x % n + n) % n;
}; //modulo func for negative nbs;

var Board = exports.Board = function () {
    function Board(xCells, yCells) {
        var cellSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.gridSize;

        _classCallCheck(this, Board);

        this.xCells = xCells;
        this.yCells = yCells;
        this.cellSize = cellSize;
        this.cellsArray = Array(yCells).fill(0).map(function (line, yIndex) {
            return Array(xCells).fill(0).map(function (cell, xIndex) {
                return new _Cell.Cell(xIndex, yIndex, 0);
            });
        });
        this.cellsArray.forEach(function (line, y, linesArray) {
            line.forEach(function (cell, x, rowArray) {
                if (window.periodity) {
                    cell.neighbours.left = rowArray[mod(x - 1, rowArray.length)];
                    cell.neighbours.right = rowArray[mod(x + 1, rowArray.length)];
                    cell.neighbours.top = linesArray[mod(y - 1, linesArray.length)][x];
                    cell.neighbours.bottom = linesArray[mod(y + 1, linesArray.length)][x];
                } else {
                    cell.neighbours.left = x > 0 ? rowArray[x - 1] : { "val": 0 };
                    cell.neighbours.right = x < rowArray.length - 1 ? rowArray[x + 1] : { "val": 0 };
                    cell.neighbours.top = y > 0 ? linesArray[y - 1][x] : { "val": 0 };
                    cell.neighbours.bottom = y < linesArray.length - 1 ? linesArray[y + 1][x] : { "val": 0 };
                }
            });
        });

        // console.log(this.cellsArray);
    }

    _createClass(Board, [{
        key: "drawGrid",
        value: function drawGrid() {
            var _this = this;

            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.canvas.width;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.canvas.height;

            this.cellsArray.forEach(function (line, yCells) {
                var y = yCells * _this.cellSize;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            });

            this.cellsArray[0].forEach(function (column, xCells) {
                var x = xCells * _this.cellSize;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            });
            ctx.strokeStyle = 'grey';
            ctx.stroke();
        }
    }]);

    return Board;
}();
},{"./Cell.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mod = function mod(x, n) {
    return (x % n + n) % n;
}; //modulo func for negative nbs;

window.counter = 1;

var Cell = exports.Cell = function () {
    function Cell(x, y, val) {
        _classCallCheck(this, Cell);

        this.neighbours = {};
        this.x = x;
        this.y = y;
        this.val = val;
        this.setColor();
    }

    _createClass(Cell, [{
        key: "toString",
        value: function toString() {
            return this.val;
        }
    }, {
        key: "setColor",
        value: function setColor() {
            if (this.val == 0) this.color = "#ffffff";else this.color = "hsl(" + this.val * 29 % 360 + ", 75%, 50%)";
        }
    }, {
        key: "click",
        value: function click() {
            this.val = window.counter++;
            this.setColor();
            this.drawCell();
            return this;
        }
    }, {
        key: "drawCell",
        value: function drawCell() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.gridSize;
            var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.ctx;

            // console.log(this);
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * size, this.y * size, size, size);
            if (window.numbers) {
                ctx.font = Math.round(size * 0.5).toString() + "px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText(this.val.toString(), this.x * size + size / 2, this.y * size + size / 2);
            }
            return this;
        }
    }, {
        key: "nextTourValue",
        value: function nextTourValue() {
            var _this = this;

            var neighbours = [];
            Object.keys(this.neighbours).forEach(function (i) {
                var value = _this.neighbours[i].val;
                if (value != 0) neighbours.push(value);
            });

            var val = neighbours.reduce(function (a, b, i, arr) {
                return arr.filter(function (v) {
                    return v === a;
                }).length >= arr.filter(function (v) {
                    return v === b;
                }).length ? a : b;
            }, null);

            return val ? val : 0;
        }
    }]);

    return Cell;
}();
},{}],3:[function(require,module,exports){
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
},{"./Board":1,"./Cell":2}]},{},[3]);
