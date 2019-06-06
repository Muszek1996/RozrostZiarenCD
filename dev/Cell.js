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
            var val = null;

            this.neighbours.forEach(function (nb) {

                if (nb.rx == time) {
                    retVal = true;
                    val = nb.val;
                }
            });
            return { "bool": retVal, "val": val };
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
            var recolour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.val = val || window.counter++;
            if (recolour) {
                this.updateColor();
                this.drawCell();
            }
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