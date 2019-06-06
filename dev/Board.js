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
var A = 86710969050178.5;
var B = 9.41268203527779;

var Board = exports.Board = function () {
    function Board(xCells, yCells) {
        var cellSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.gridSize;

        _classCallCheck(this, Board);

        window.board = this;
        window.board.xCells = xCells;
        window.board.yCells = yCells;
        window.board.cellSize = cellSize;

        window.cellsArray = Array(yCells).fill(0).map(function (line, yIndex) {
            return Array(xCells).fill(0).map(function (cell, xIndex) {
                return new _Cell.Cell(xIndex + 0.25 + Math.random() / 2, yIndex + 0.25 + Math.random() / 2, 0);
            });
        });
        window.cellsArray.forEach(function (line, y, linesArray) {
            line.forEach(function (cell, x, rowArray) {

                var neightbourhood = document.getElementById("NeighbourState").options[document.getElementById("NeighbourState").selectedIndex].value;

                switch (neightbourhood) {
                    case "Von Neumann":
                        {
                            cell.neighbours = cell.getSquareNeighbourhood(1).circularNeighbours.filter(function (nb) {
                                return Math.trunc(nb.x) === Math.trunc(cell.x) || Math.trunc(nb.y) === Math.trunc(cell.y);
                            });
                            if (cell.val > 0) cell.neighbours.forEach(function (nb) {
                                return nb.drawDot("#C0FF33");
                            });
                        }
                        break;
                    case "Moore":
                        cell.neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;

                        break;
                    case "Pentagonalne":
                        var neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;

                        var random = window.pentagon || Math.random() * 4 + 1;

                        neighbours = neighbours.filter(function (nb, i) {
                            var lottery = [i === 0 || i === 3 || i === 5 || i === 1 || i === 6, i === 2 || i === 4 || i === 7 || i === 1 || i === 6, i === 0 || i === 1 || i === 2 || i === 3 || i === 4, i === 5 || i === 6 || i === 7 || i === 3 || i === 4];
                            return lottery[Math.trunc(random) - 1];
                        });

                        cell.neighbours = neighbours;
                        break;
                    case "Heksagonalne":
                        {
                            var _neighbours = cell.getSquareNeighbourhood(1).circularNeighbours;
                            var dir = window.pentagon;

                            if (window.pentagon === null) {
                                dir = Math.trunc(Math.random() + 0.5) + 1;
                            }

                            if (dir === 1) {
                                _neighbours = _neighbours.filter(function (nb, i) {
                                    return i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6;
                                });
                            } else if (dir === 2) {
                                _neighbours = _neighbours.filter(function (nb, i) {
                                    return i === 0 || i === 1 || i === 3 || i === 4 || i === 6 || i === 7;
                                });
                            }
                            cell.neighbours = _neighbours;
                        }
                        break;
                    case "Promien":
                        {

                            var nbours = cell.getCircularNeighbourhood(window.radiusVal);

                            if (cell.val > 0) {
                                nbours.forEach(function (nb) {
                                    return nb.drawDot("#C0FF33");
                                });
                                cell.drawNeighbourhood(window.radiusVal, 1);
                            }

                            cell.neighbours = nbours;
                        }
                        break;
                }
            });
        });
    }

    _createClass(Board, [{
        key: "getRo",
        value: function getRo(t) {
            return A / B + (1 - A / B) * Math.exp(-B * t);
        }
    }, {
        key: "getSigma",
        value: function getSigma(t) {
            return 1.9 * (0.257 * Math.pow(10, -9)) * (8 * Math.pow(10, 10)) * Math.sqrt(this.getRo(t));
        }
    }, {
        key: "getDeltaRo",
        value: function getDeltaRo(t1, t2) {
            return this.getRo(t2) - this.getRo(t1);
        }
    }, {
        key: "avgRoDensity",
        value: function avgRoDensity(deltaRo) {
            return deltaRo / (window.xCells * window.yCells);
        }
    }, {
        key: "giveXPercentToEachReturnRest",
        value: function giveXPercentToEachReturnRest(x, deltaRo) {
            var avg = this.avgRoDensity(deltaRo) * x / 100;
            window.cellsArray.forEach(function (line, y) {
                return line.forEach(function (cell, x) {
                    if (cell.dyslocDensity) cell.dyslocDensity += avg;else cell.dyslocDensity = avg;
                });
            });
            return deltaRo * (100 - x) / 100;
            //return this.avgRoDensity(deltaRo)-avg;
        }
    }, {
        key: "getRandomCell",
        value: function getRandomCell() {
            var x = Math.trunc(Math.random() * window.xCells);
            var y = Math.trunc(Math.random() * window.yCells);

            return cellsArray[y][x];
        }
    }, {
        key: "getBorderCell",
        value: function getBorderCell() {
            var randomCell = this.getRandomCell();
            while (randomCell.getEnergy() < 1) {
                randomCell = this.getRandomCell();
            }
            return randomCell;
        }
    }, {
        key: "getInsideCell",
        value: function getInsideCell() {
            var randomCell = this.getRandomCell();
            while (randomCell.getEnergy() > 0) {
                randomCell = this.getRandomCell();
            }
            return randomCell;
        }
    }, {
        key: "drawGrid",
        value: function drawGrid() {
            var _this = this;

            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.canvas.width;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.canvas.height;

            window.cellsArray.forEach(function (line, yCells) {
                var y = yCells * _this.cellSize;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            });

            window.cellsArray[0].forEach(function (column, xCells) {
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