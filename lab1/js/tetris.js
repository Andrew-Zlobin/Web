"use strict"

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

document.getElementById("name").textContent = localStorage.getItem("currentPlayer");

const nextFigureCanvas = document.getElementById("next");
const nfctx = nextFigureCanvas.getContext('2d');
nfctx.canvas.width = 4 * BLOCK_SIZE;
nfctx.canvas.height = 4 * BLOCK_SIZE;
nfctx.scale(BLOCK_SIZE, BLOCK_SIZE);


class Field {
    constructor(gameStatistic) {
        this.field = [];
        this.gameStatistic = gameStatistic;
        for (let i = 0; i < COLS; i = i + 1) {
            this.field[i] = [];
            for (let j = 0; j < ROWS; j = j + 1) {
                this.field[i][j] = 0;
            }
        }
        //this.field[COLS - 5][ROWS - 5] = 1;
    }
    draw() {
        for (let i = 0; i < COLS; i = i + 1) {
            for (let j = 0; j < ROWS; j = j + 1) {    
                ctx.fillStyle = colors[this.field[i][j]];
                ctx.fillRect(i, j, 1, 1);
            }
        }
    }
    isRowEmpty(id) {
        for (let i = 0; i < COLS; i = i + 1) {
            if (this.field[i][id] != 0) {
                return false;
            }
        }
        return true;
    }

    isRowFull(id) {
        for (let i = 0; i < COLS; i = i + 1) {
            if (this.field[i][id] == 0) {
                return false;
            }
        }
        return true;
    }

    dropRowsTo(row) {
        for (let i = row; i > 0; i = i - 1) {
            for (let j = 0; j < COLS; j = j + 1) {
                this.field[j][i] = this.field[j][i - 1];
            }
        }
        for (let j = 0; j < COLS; j = j + 1) {
            this.field[j][0] = 0;
        }
    }

    applyPhysics() {
        for (let i = 0; i < ROWS; i = i + 1) {
            if (this.isRowEmpty(i)) {
                this.dropRowsTo(i);
            }
        }
    }
    
    RemoveFullRows() {
        let sameTimeRemuved = 0;
        for (let i = 0; i < ROWS; i = i + 1){
            if (this.isRowFull(i)) {
                for (let j = 0; j < COLS; j = j + 1) {
                    this.field[j][i] = 0;
                }
                //this.gameStatistic.lines += 1;
                //this.gameStatistic.level += 1;
                sameTimeRemuved++;
            }
        }
        this.gameStatistic.lines += sameTimeRemuved;
        switch (sameTimeRemuved) {
            case 1:
                this.gameStatistic.score += 100;
                break;
            case 2:
                this.gameStatistic.score += 300;
                break;
            case 3:
                this.gameStatistic.score += 700;
                break;
            case 4:
                this.gameStatistic.score += 1500;
                break;
            default:
                break;
        }
    }

    update() {
        console.log("field update");
        this.RemoveFullRows();
        this.applyPhysics();
        return this.gameStatistic;
    }
}

let direction = {up    : {x:  0, y: -1},
             down  : {x:  0, y:  1},
             left  : {x: -1, y:  0},
             right : {x:  1, y:  0}}

let colors = ["white",
              "red",
              "orange",
              "yellow",
              "green",
              "aqua",
              "blue",
              "purple",
              "green",]


class Figure {
    constructor(field) {
        this.field = field;
        let newFigure = this.generateNewFigure();
        let nextFigure = this.generateNewFigure();
        this.figure = newFigure.rfigure;
        this.size = newFigure.rsize;
        this.nextFigure = nextFigure.rfigure;
        this.nextSize = nextFigure.rsize;
    }
    checkCollision(possibleDirection = {x : 0, y : 0}) {
        let newPosition = {x : this.position.x + possibleDirection.x,
                       y : this.position.y + possibleDirection.y}
        for (let i = 0; i < this.size; i = i + 1) {
            for (let j = 0; j < this.size; j = j + 1) {
                
                if (this.figure[i][j] != 0 && 
                    (newPosition.x + i < 0 || newPosition.x + i >= COLS ||
                    newPosition.y + j < 0 || newPosition.y + j >= ROWS ||
                    this.field.field[newPosition.x + i][newPosition.y + j] != 0)) {
                    return true
                }
            }
        }
        return false;
    }

    move(dr) {
        this.position.x = this.position.x + dr.x;
        this.position.y = this.position.y + dr.y;
        this.field.draw();
        this.draw();
    }

    applyPhysics() {
        if (!this.checkCollision(direction.down)) {
            console.log("no collision");
            this.move(direction.down);
            return true;
        } else {
            return false;
        }
    }
    moveLeft() {
        if (!this.checkCollision(direction.left)) {
            this.move(direction.left);
        }
    }
    moveRight() {
        if (!this.checkCollision(direction.right)) {
            this.move(direction.right);
        }
    }

    rotate() {
        let newFigure = [];
        for (let i = 0; i < this.size; i = i + 1) 
            newFigure[i] = new Array(this.size).fill(0);
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                newFigure[x][y] = this.figure[this.size - 1 - y][x];
            }
        }
        let t = this.figure;
        this.figure = newFigure;
        newFigure = t;
        if (this.checkCollision()) {
            t = this.figure;
            this.figure = newFigure;
            newFigure = t;
        }
        this.draw();
        this.field.draw();
    }

    saveFigureToField() {
        for (let i = 0; i < this.size; i = i + 1) {
            for (let j = 0; j < this.size; j = j + 1) {
                if (this.figure[i][j] != 0) {
                    this.field.field[this.position.x + i][this.position.y + j] = this.figure[i][j];
                }
            }
        }
        
        this.field
    }

    chooseFigureType() {
        return Math.floor(Math.random() * 7) + 1;
        return 2;
    }

    generateNewFigure() {
        let c = this.chooseFigureType();
        let figure = [];
        let size = 0;
        switch (c) {
            case 1:
                figure = [[0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [c, c, c, c],
                               [0, 0, 0, 0]];
                size = 4;
                break;
            case 2:
                figure = [[c, 0, 0], 
                               [c, c, c],
                               [0, 0, 0]];
                size = 3;
                break;
            case 3:
                figure = [[0, 0, 0],
                               [0, 0, c],
                               [c, c, c]];
                size = 3;
                break;
            case 4:
                figure = [[0, c, c],
                               [c, c, 0],
                               [0, 0, 0]];
                size = 3;
                break;
            case 5:
                figure = [[c, c, 0],
                               [0, c, c],
                               [0, 0, 0]];
                size = 3;
                break;
            case 6:
                figure = [[0, c, 0],
                               [c, c, c],
                               [0, 0, 0]];
                size = 3;
                break;
            case 7:
                figure = [[0, 0, 0, 0],
                               [0, c, c, 0],
                               [0, c, c, 0],
                               [0, 0, 0, 0]];
                size = 4;
                break;
            case 8:
                figure = [[0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [c, c, c, c],
                               [0, 0, 0, 0]];
                size = 4;
                break;
            default:
                break;
        }
        //this.size = 4;
        this.position = {x : COLS / 2 - 2, y : 0};
        return {rfigure : figure, rsize : size};
    }

    update() {
        if ( ! this.applyPhysics()) {
            this.saveFigureToField();
            this.figure = this.nextFigure;
            this.size = this.nextSize;
            let nextFigure = this.generateNewFigure();
            this.nextFigure = nextFigure.rfigure;
            this.nextSize = nextFigure.rsize;
            if (this.checkCollision()){
                return false;
            }
        }
        return true;
    }

    draw() {
        for (let i = 0; i < this.size; i = i + 1) {
            for (let j = 0; j < this.size; j = j + 1) {
                if (this.figure[i][j] != 0) {
                    ctx.fillStyle = colors[this.figure[i][j]];
                    ctx.fillRect(this.position.x + i, this.position.y + j, 1, 1);
                    
                }
            }
        }
        
        for (let i = 0; i < 4; i = i + 1) {
            for (let j = 0; j < 4; j = j + 1) {
                nfctx.fillStyle = colors[0];
                nfctx.fillRect(i, j, 1, 1);
            }
        }
        for (let i = 0; i < this.nextSize; i = i + 1) {
            for (let j = 0; j < this.nextSize; j = j + 1) {
                nfctx.fillStyle = colors[this.nextFigure[i][j]];
                nfctx.fillRect(i, j, 1, 1);
            }
        }
    }
}




class EventController {
    constructor(figure) {
        this.figure = figure;
        this.keyListLeft = ['a', 'A', 'ф', 'Ф'];
        this.keyListRight = ['d', 'D', 'в', 'В'];
        this.keyListRotate = ['e', 'E', 'У', 'у'];
        this.keyListDropDown = ['ы', 'Ы', 's', 'S'];
    }
    update() {}

    handleEvent(event) {
        if (this.keyListLeft.includes(event.key)) {                
            this.figure.moveLeft();
        }
        if (this.keyListRight.includes(event.key)) {                
            this.figure.moveRight();
        }
        if (this.keyListRotate.includes(event.key)) {                
            this.figure.rotate();
        }
        if (this.keyListDropDown.includes(event.key)) {                
            this.figure.applyPhysics();
        }
        
    }
}

function createExitButton() {
    let form = document.createElement('form');
    form.action = "records.html";
    let input = document.createElement('input');
    input.type = "submit";
    input.value = "Далее";
    form.appendChild(input);
    document.getElementById("statistic").appendChild(form);
}

function saveCurrentPlayer (gameStatistic) {
    if (localStorage.getItem("listPlayer") == null) {
        localStorage.setItem("listPlayer", JSON.stringify([]));
    }
    
    let playersList = JSON.parse(localStorage.getItem("listPlayer"));
    playersList.push({name: localStorage.getItem("currentPlayer"), score : gameStatistic.score, lines : gameStatistic.lines, level : gameStatistic.level});
    localStorage.setItem("listPlayer", JSON.stringify(playersList));
    
}

function showStatistic(gameStatistic) {
    document.getElementById("score").innerText = gameStatistic.score;
    document.getElementById("lines").innerText = gameStatistic.lines;
    document.getElementById("level").innerText = gameStatistic.level;
    document.getElementById("next");
}


function updateScore() {

}

class GameController {
    constructor() {
        
        this.gameStatistic = {score : 0, lines : 0, level : 1};
        this.gameSpeed = 300;
        this.nextSpeedScore = 2000;
        this.field = new Field(this.gameStatistic);
        this.figure = new Figure(this.field);
        this.eventController = new EventController(this.figure);


        document.addEventListener("keydown", this.eventController);
    }

    start() {
        var bindedGameLoop = this.gameLoop.bind(this);
        this.refreshIntervalId = setInterval(bindedGameLoop, this.gameSpeed);
    }

    increaseSpeed() {
        this.gameSpeed = this.gameSpeed / this.gameStatistic.level;
        console.log("incresed");
        clearInterval(this.refreshIntervalId);
        var bindedGameLoop = this.gameLoop.bind(this);
        this.refreshIntervalId = setInterval(bindedGameLoop, this.gameSpeed);
    }
    checkStatistic() {

        if (this.gameStatistic.score >= this.nextSpeedScore) {
            this.increaseSpeed();
            this.gameStatistic.level ++;
            this.nextSpeedScore *= 2;
        }
    }
    gameLoop() {

        //this.eventController.update();
        this.field.update();
        this.checkStatistic();
        showStatistic(this.gameStatistic);
        if ( ! this.figure.update()) {
            clearInterval(this.refreshIntervalId);
            createExitButton();
            saveCurrentPlayer(this.gameStatistic);
            return;
        }

        this.field.draw();
        this.figure.draw();
        
    }

}

var game = new GameController();
game.start();