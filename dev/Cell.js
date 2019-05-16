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