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
window.max = Number.MIN_VALUE;
window.min = Number.MAX_VALUE;

var dK = function dK(cellA, cellB) {
    return cellA.val === cellB.val;
};

var probability = function probability(deltaE, kt) {
    if (deltaE <= 0) return 1;else Math.exp(-(deltaE / kt));
};

var Cell = exports.Cell = function () {
    function Cell(x, y, val) {
        _classCallCheck(this, Cell);

        this.x = x;
        this.y = y;
        this.val = val;
        this.neighbours = [];
        this.color = null;
        this.energy = null;
        this.rx = null;
        this.dyslocDensity = 0;
        this.recrystaliseState = null;
    }

    _createClass(Cell, [{
        key: "toString",
        value: function toString() {
            return this.val;
        }
    }, {
        key: "updateColor",
        value: function updateColor() {
            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (this.val == 0) this.color = color || "#ffffff";else this.color = color || "hsl(" + this.val * 29 % 360 + ", 75%, 50%)";
            return this;
        }
    }, {
        key: "obtainDyslocDensity",
        value: function obtainDyslocDensity(density) {
            if (this.dyslocDensity == null) throw new Error("shouldn't be null");
            this.dyslocDensity += density;
        }
    }, {
        key: "doNeighbourRecrystalisedAtTime",
        value: function doNeighbourRecrystalisedAtTime(time) {
            if (this.neighbours == null || this.neighbours.length < 1) throw new Error("neighbours empty");
            var retVal = false;

            this.neighbours.forEach(function (nb) {

                if (nb.rx == time) {
                    retVal = true;
                }
            });
            return retVal;
        }
    }, {
        key: "isDyslocDensityOfNeighborsSmallerThanMine",
        value: function isDyslocDensityOfNeighborsSmallerThanMine() {
            var _this = this;

            var retval = true;
            if (this.dyslocDensity == null) throw new Error("dysloc val null");
            if (this.neighbours == null || this.neighbours.length < 1) throw new Error("neighbours empty");

            this.neighbours.forEach(function (nb) {
                if (nb.dyslocDensity > _this.dyslocDensity) retval = false;
            });
            return retval;
        }
    }, {
        key: "click",
        value: function click() {
            this.val = window.counter++;
            this.updateColor();
            this.drawCell();
            return this;
        }
    }, {
        key: "getEnergy",
        value: function getEnergy() {
            var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.val;

            var energy = 0;

            this.neighbours.forEach(function (nb) {
                energy += 1 - dK({ "val": val }, nb);
            });
            var J = 1.0; //Energia granicy ziarna;
            energy *= J;

            if (energy > window.max) window.max = energy;
            if (energy < window.min) window.min = energy;

            return energy;
        }
    }, {
        key: "deltaEnergy",
        value: function deltaEnergy() {
            var eBefore = this.getEnergy();

            var newVal = this.neighbours[Math.trunc(Math.random() * this.neighbours.length)].val;

            var eAfter = this.getEnergy(newVal);

            return { "delta": eAfter - eBefore, "hisVal": newVal };
        }
    }, {
        key: "growMC",
        value: function growMC() {
            var dE = this.deltaEnergy();
            var p = probability(dE.delta, window.kt); //kt stała <0.1 -6>;
            if (p > Math.random()) return dE.hisVal;
            return this.val;
        }
    }, {
        key: "isInCircle",
        value: function isInCircle(cell, radius) {
            var dist = Math.sqrt(Math.pow(this.x - cell.x, 2) + Math.pow(this.y - cell.y, 2));
            if (dist < radius) {
                //Meet diameter
                if (dist > 0) return true;
            }
            return false;
        }
    }, {
        key: "getSquareNeighbourhood",
        value: function getSquareNeighbourhood(distance) {
            //param{distance} = a/2 (half of side)
            var circularNeighbours = [];
            var fakeIndexes = [];
            //console.log(window.cellsArray);
            for (var y = Math.trunc(this.y) - distance; y <= Math.trunc(this.y) + distance; y++) {
                //square neighbourhood (MAX indexes)
                for (var x = Math.trunc(this.x) - distance; x <= Math.trunc(this.x) + distance; x++) {
                    if (Math.trunc(this.y) === y && Math.trunc(this.x) === x) continue; //ignore itself
                    var cell = null;
                    try {
                        if (window.periodity) {
                            cell = window.cellsArray[mod(y, window.board.yCells)][mod(x, window.board.xCells)];
                        } else {
                            if (x >= 0 && x < window.board.xCells && y >= 0 && y < window.board.yCells) cell = window.cellsArray[y][x];
                        }

                        fakeIndexes.push({ "x": x, "y": y });
                    } catch (e) {
                        //console.info("neighbour not found probably peroidity off and cell beyond board");
                        //console.error(e);
                    }
                    if (cell) circularNeighbours.push(cell);
                }
            }
            return { circularNeighbours: circularNeighbours, fakeIndexes: fakeIndexes };
        } //getsSquare neighbourhood with distance of param{distance}

    }, {
        key: "drawSquareNeighbourhood",
        value: function drawSquareNeighbourhood(distance) {
            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#ffdd00";

            this.getSquareNeighbourhood(distance).circularNeighbours.forEach(function (c) {
                return c.drawDot(color);
            });
        }
    }, {
        key: "getCircularNeighbourhood",
        value: function getCircularNeighbourhood(radius) {
            var _this2 = this;

            var circNeigbours = [];
            var potentialNeighbours = this.getSquareNeighbourhood(radius);

            if (window.periodity) {
                potentialNeighbours.fakeIndexes.forEach(function (val, index) {
                    var cell = potentialNeighbours.circularNeighbours[index];
                    var xShift = cell.x - Math.trunc(cell.x);
                    var yShift = cell.y - Math.trunc(cell.y);
                    if (_this2.isInCircle({ "x": val.x + xShift, "y": val.y + yShift }, radius)) circNeigbours.push(cell);
                });
            } else {
                potentialNeighbours.circularNeighbours.forEach(function (cell) {
                    var xShift = cell.x - Math.trunc(cell.x);
                    var yShift = cell.y - Math.trunc(cell.y);
                    if (_this2.isInCircle({ "x": cell.x + xShift, "y": cell.y + yShift }, radius)) circNeigbours.push(cell);
                });
            }

            return circNeigbours;
        }
    }, {
        key: "drawCircularNeighbourhood",
        value: function drawCircularNeighbourhood(diameter) {
            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#fb8f00";

            this.getCircularNeighbourhood(diameter).forEach(function (e) {
                return e.drawDot(color);
            });
        }
    }, {
        key: "drawNeighbourhood",
        value: function drawNeighbourhood(radius) {
            var drawCircle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var color1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#aae5ff";
            var color2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#0300fc";

            if (window.dots) this.drawSquareNeighbourhood(radius, color1);
            this.drawCircularNeighbourhood(radius, color2);
            var size = window.gridSize;
            var scaledRadius = radius * size;
            if (drawCircle) {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.arc(this.x * size, this.y * size, scaledRadius, 0, 2 * Math.PI);
                ctx.stroke();

                if (window.periodity) {
                    var boardW = window.board.xCells * size;
                    var boardH = window.board.yCells * size;
                    for (var X = -boardW; X <= boardW; X += boardW) {
                        for (var Y = -boardH; Y <= boardH; Y += boardH) {
                            ctx.beginPath();
                            var pointX = this.x * size + X;
                            var pointY = this.y * size + Y;
                            ctx.arc(pointX, pointY, scaledRadius, 0, 2 * Math.PI);
                            ctx.stroke();
                        }
                    }
                } //teleportedCircles;)
            }
        }
    }, {
        key: "drawDot",
        value: function drawDot() {
            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#ffffff";

            var size = window.gridSize;
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x * size, this.y * size, size / 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }, {
        key: "drawNumber",
        value: function drawNumber() {
            var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#3f3f3f";

            var numb = val || this.val;

            var size = window.gridSize;
            ctx.font = Math.round(size * 0.5).toString() + "px Arial";
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.fillText(numb.toString(), Math.trunc(this.x) * size + size / 2, Math.trunc(this.y) * size + size / 2);
        }
    }, {
        key: "drawEnergy",
        value: function drawEnergy() {
            this.energy = this.getEnergy();

            var size = window.gridSize;
            ctx.globalAlpha = 1;
            var scale = function scale(num, in_min, in_max, out_min, out_max) {
                return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            };
            var brightness = scale(this.energy, window.min, window.max, 75, 100);

            ctx.fillStyle = "hsl(" + 0 + ", 75%, " + (100 - brightness) * 4 + "%)";
            ctx.fillRect(Math.trunc(this.x) * size, Math.trunc(this.y) * size, size, size);

            if (window.dots) this.drawDot();

            if (window.numbers) this.drawNumber(this.energy);
            ctx.restore();
            return this;
        }
    }, {
        key: "drawCell",
        value: function drawCell() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.gridSize;
            var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.ctx;
            var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.color;

            ctx.globalAlpha = 1;
            ctx.fillStyle = color;
            ctx.fillRect(Math.trunc(this.x) * size, Math.trunc(this.y) * size, size, size);

            if (window.dots) this.drawDot();

            if (window.numbers) this.drawNumber();
            ctx.restore();
            return this;
        }
    }, {
        key: "nextTourValue",
        value: function nextTourValue() {
            var dominatingNeighbours = [];
            this.neighbours.forEach(function (i) {
                var value = i.val;
                if (value !== 0) dominatingNeighbours.push(value);
            });
            //console.log(dominatingNeighbours);

            //console.log(dominatingNeighbours);
            var val = dominatingNeighbours.reduce(function (a, b, i, arr) {
                return arr.filter(function (v) {
                    return v === a;
                }).length >= arr.filter(function (v) {
                    return v === b;
                }).length ? a : b;
            }, null);
            if (this.val > 0) return this.val;

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
    window.max = Number.MIN_VALUE;
    window.min = Number.MAX_VALUE;
    console.log("START!!");

    window.packages = document.getElementById('packages').valueAsNumber;
    window.xPercent = document.getElementById('x').valueAsNumber;

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
    window.setDots();
    window.radiusVal = document.getElementById('radius').valueAsNumber || 2;
    window.generated = false;
    window.updatePentagon();
    window.speed = 1000 / document.getElementById("speedMultiplier").valueAsNumber;

    window.board = new _Board.Board(window.xCells, window.yCells, window.gridSize);
    window.initState();
    board.drawGrid();
    window.criticalDensity = 4.22 * Math.pow(10, 12) / (window.xCells * window.yCells);
};

window.getDownloadableFile = function (data, filename) {

    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], { type: 'text/json' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

window.setPeroidity = function () {
    window.periodity = document.getElementById("peroid").checked;
};

window.setNumbers = function () {
    document.getElementById("yCount").setAttribute("max", window.yCells);
    document.getElementById("xCount").setAttribute("max", window.xCells);
    window.numbers = document.getElementById("numbers").checked;
};

window.handleEnergyButton = function () {
    window.max = Number.MIN_VALUE;
    window.min = Number.MAX_VALUE;
    window.cellsArray.forEach(function (line, y, linesArray) {
        line.forEach(function (cell, x, rowArray) {
            var newVal = cell.getEnergy();
            if (newVal > window.max) window.max = newVal;
            if (newVal < window.min) window.min = newVal;
        });
    });
    window.energyShow = document.getElementById('Energy').checked;

    window.cellsArray.forEach(function (line, y) {
        return line.forEach(function (cell, x) {
            if (window.energyShow === true) {
                window.cellsArray[y][x].drawEnergy();
            } else {
                window.cellsArray[y][x].updateColor();
                window.cellsArray[y][x].drawCell();
            }
        });
    });
};

window.handleDensityButton = function () {

    window.densityShow = document.getElementById('Density').checked;

    window.cellsArray.forEach(function (line, y) {
        return line.forEach(function (cell, x) {
            if (window.densityShow === true) {
                if (cell.recrystaliseState !== null) {
                    if (cell.recrystaliseState === true) {
                        cell.drawCell(window.gridSize, window.ctx, "#ff0900");
                    }
                }
            } else {
                window.cellsArray[y][x].updateColor();
                window.cellsArray[y][x].drawCell();
            }
        });
    });
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
    if (document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value == 'Pentagonalne') {
        document.getElementById('Pentagon').style.display = 'inline';
        document.getElementById('pentagonP').innerHTML = 'Pentagonalne:';
        document.getElementById('Gora').disabled = false;
        document.getElementById('Dol').disabled = false;
    } else if (document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value == 'Heksagonalne') {
        document.getElementById('Gora').disabled = true;
        document.getElementById('Dol').disabled = true;
        document.getElementById('Pentagon').style.display = 'inline';
        document.getElementById('pentagonP').innerHTML = 'Pentagonalne:';
    } else if (document.getElementById('NeighbourState').options[document.getElementById('NeighbourState').selectedIndex].value == 'Promien') {
        document.getElementById('radius').style.display = 'inline';
        document.getElementById('radiusP').innerHTML = 'Promien:';
    }
};

window.updatePentagon = function () {
    switch (document.getElementById('Pentagon').options[document.getElementById('Pentagon').selectedIndex].value) {
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

window.run = function () {
    window.max = Number.MIN_VALUE;
    window.min = Number.MAX_VALUE;
    if (!game && !generated) {
        game = setInterval(function () {
            var newVals = window.cellsArray.map(function (line, yIndex) {
                return line.map(function (cell, xIndex) {
                    return cell.nextTourValue();
                });
            });
            //console.log(newVals);
            var conti = false;
            window.cellsArray.forEach(function (line, y) {
                return line.forEach(function (cell, x) {
                    if (window.cellsArray[y][x].val !== newVals[y][x]) conti = true;
                    if (newVals[y][x] > 0 && window.cellsArray[y][x].val == 0) window.cellsArray[y][x].val = newVals[y][x];
                    if (window.energyShow === true) {
                        window.cellsArray[y][x].drawEnergy();
                    } else {
                        window.cellsArray[y][x].updateColor();
                        window.cellsArray[y][x].drawCell();
                    }
                });
            });
            if (conti === false) {
                window.generated = true;
                clearInterval(game);
                game = null;
                document.getElementById("startBtn").textContent = "Start";
            }

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
                var yL = window.cellsArray.length;
                var xL = window.cellsArray[0].length;
                var yParts = yL / (yC + 1);
                var xParts = xL / (xC + 1);
                for (var _i = 1; _i <= yC; _i++) {
                    for (var _j = 1; _j <= xC; _j++) {
                        window.cellsArray[Math.floor(yParts * _i)][Math.floor(xParts * _j)].click();
                    }
                }
                //console.log(window.cellsArray)
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
                    if (++_j2 > 100) {
                        alert("probably impossible");
                        return "break";
                        _i3 = xCount;
                        return {
                            v: void 0
                        };
                    } else {
                        var cell = window.cellsArray[Math.round(Math.random() * window.cellsArray.length) % window.cellsArray.length][Math.round(Math.random() * window.cellsArray[0].length) % window.cellsArray[0].length];
                        var val = true;
                        cells.forEach(function (circleCell) {
                            var dist = Math.sqrt(Math.pow(cell.x * window.gridSize - circleCell.x * window.gridSize, 2) + Math.pow(cell.y * window.gridSize - circleCell.y * window.gridSize, 2));

                            if (dist < yCount * window.gridSize) {
                                console.log(dist + "<" + yCount * window.gridSize / 2);
                                _i3--;
                                val = false;
                            } else {
                                ctx.beginPath();
                                ctx.moveTo(cell.x * window.gridSize, cell.y * window.gridSize);
                                ctx.lineTo(circleCell.x * window.gridSize, circleCell.y * window.gridSize);
                                ctx.stroke();
                            }
                        });
                        if (val) {
                            ctx.beginPath();
                            ctx.arc(cell.x * window.gridSize, cell.y * gridSize, yCount * gridSize, 0, 2 * Math.PI);
                            ctx.stroke();
                            cells.push(cell);
                        }
                    }
                    _i2 = _i3;
                };

                _loop2: for (var _i2 = 0; _i2 < xCount; ++_i2) {
                    var _ret = _loop(_i2);

                    switch (_ret) {
                        case "break":
                            break _loop2;

                        default:
                            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                    }
                }

                cells.forEach(function (cell) {
                    return cell.click();
                });
                document.getElementById("textBox").innerHTML = "Udało się wygenerować:" + cells.length;
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
                    var cell = window.cellsArray[Math.round(Math.random() * window.cellsArray.length) % window.cellsArray.length][Math.round(Math.random() * window.cellsArray[0].length) % window.cellsArray[0].length];
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
                    window.cellsArray[i][j].click();
                    console.log(window.cellsArray[i][j]);
                    //window.cellsArray[i][j].drawNeighbourhood(1);
                }
            }
    }

    window.cellsArray.forEach(function (l) {
        return l.forEach(function (c) {
            if (c.val > 0) {
                if (c.neighbours !== undefined) {
                    if (document.getElementById("NeighbourState").options[document.getElementById("NeighbourState").selectedIndex].value === "Promien") {
                        c.drawNeighbourhood(window.radiusVal, 1);
                    }
                    c.neighbours.forEach(function (n) {
                        return n.drawDot(c.color);
                    });
                }
            }
        });
    });
};

document.addEventListener("DOMContentLoaded", function () {
    start();
    run();
    document.getElementById("workingCanvas").addEventListener('click', function (event) {

        var xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        var yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);
        if (document.getElementById("InitState").options[document.getElementById("InitState").selectedIndex].value == "wyklinanie") window.initState(yClickIndex, xClickIndex);
    }, false);

    document.getElementById("workingCanvas").addEventListener('contextmenu', function (event) {
        event.preventDefault();
        var xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        var yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);

        console.log(window.cellsArray[yClickIndex][xClickIndex].getEnergy());
    }, false);

    document.getElementById("workingCanvas").addEventListener('auxclick', function (event) {
        event.preventDefault();
        var xClickIndex = Math.floor(getCursorPosition(window.canvas, event)[0] / window.gridSize);
        var yClickIndex = Math.floor(getCursorPosition(window.canvas, event)[1] / window.gridSize);
        // console.log(`x:${xClickIndex} y:${yClickIndex}`);
        // console.log(window.cellsArray);
        console.log(window.lcc = window.cellsArray[yClickIndex][xClickIndex]);
    }, false);
});

function getCursorPosition(canvas, event) {
    var x, y;

    var canoffset = canvas.getBoundingClientRect();
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

    return [x, y];
}

window.dyslocation = function (timeStep, endTime) {
    var packages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.packages;
    var xPercent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window.xPercent;
    var crtiticalAvgRoDensity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : window.criticalDensity;
    var startTime = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    window.data = [];

    var _loop3 = function _loop3(time) {
        var timer = setTimeout(function () {
            document.getElementById("textBox").innerHTML = "Time:" + time + "/" + endTime;
            var deltaRo = board.getDeltaRo(time - timeStep, time);
            var avgRoDensity = board.avgRoDensity(deltaRo);
            var deltaRoLeft = board.giveXPercentToEachReturnRest(xPercent, deltaRo);

            var packageSize = deltaRoLeft / packages;
            console.log("Time: " + time + "/" + endTime + "  Ro:" + board.getRo(time));
            window.data.push({ "Time": time, "ro": board.getRo(time) });
            while (deltaRoLeft - packageSize > 0) {
                var rand = Math.random() * 10;
                if (rand < 8) {
                    board.getBorderCell().obtainDyslocDensity(packageSize);
                } else {
                    board.getInsideCell().obtainDyslocDensity(packageSize);
                }
                deltaRoLeft -= packageSize;
            }
            {
                var _rand = Math.random() * 10;
                if (_rand < 8) {
                    board.getBorderCell().obtainDyslocDensity(deltaRoLeft);
                } else {
                    board.getInsideCell().obtainDyslocDensity(deltaRoLeft);
                }
            } //give rest to random cell;

            // cellsArray.forEach((line,y)=>line.forEach((cell,x)=>{
            //     if((cell.dyslocDensity>crtiticalAvgRoDensity&& cell.getEnergy()>0)){
            //         //console.log("gen");
            //         cell.rx = time;
            //         cell.recrystaliseState = true;
            //         cell.dyslocDensity = 0;
            //     }
            // }));
            // handleDensityButton();

            cellsArray.forEach(function (line, y) {
                return line.forEach(function (cell, x) {
                    if (cell.dyslocDensity > crtiticalAvgRoDensity && cell.getEnergy() > 0) {
                        //console.log("gen");
                        cell.rx = time;
                        cell.recrystaliseState = true;
                        cell.dyslocDensity = 0;
                    }
                });
            });
            handleDensityButton();

            var newVals = window.cellsArray.map(function (line, yIndex) {
                return line.map(function (cell, xIndex) {
                    if (cell.doNeighbourRecrystalisedAtTime(time - timeStep) && cell.isDyslocDensityOfNeighborsSmallerThanMine()) {
                        //console.log("ne");
                        cell.rx = time;
                        cell.recrystaliseState = true;
                        cell.dyslocDensity = 0;
                    }
                    return cell;
                });
            });

            //window.cellsArray = newVals;
        }, time * 5000 * (1000 / document.getElementById("speedMultiplier").valueAsNumber));
    };

    for (var time = startTime + timeStep; time <= endTime; time += timeStep) {
        _loop3(time);
    }
};

window.mcGrowth = function () {
    var iterations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.iterations;


    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;

    window.energyArray = new Array(window.board.yCells).fill(null).map(function () {
        return new Array(window.board.xCells).fill(null);
    });
    var cells = [];
    cellsArray.forEach(function (line, y) {
        return line.forEach(function (cell, x) {
            energyArray[y][x] = new _Cell.Cell(cell.x, cell.y, null);
            cells.push(cell);
        });
    });

    var _loop4 = function _loop4(i) {
        setTimeout(function () {
            console.log("ITERATION" + i);
            cells.sort(function () {
                return Math.random() - 0.5;
            });
            cells.forEach(function (cell) {
                var newVal = cell.growMC();
                if (newVal > max) max = newVal;
                if (newVal < min) min = newVal;

                cellsArray[Math.trunc(cell.y)][Math.trunc(cell.x)].val = newVal;
            });
            handleEnergyButton();
        }, 1000 / document.getElementById("speedMultiplier").valueAsNumber);
    };

    for (var i = 0; i < iterations; i++) {
        _loop4(i);
    }

    document.getElementById("startBtn").textContent = "START";
};
},{"./Board":1,"./Cell":2}]},{},[3]);
