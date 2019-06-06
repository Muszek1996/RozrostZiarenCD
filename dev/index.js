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