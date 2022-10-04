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
        this.field[COLS - 5][ROWS - 5] = 1;
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
        for (let i = 0; i < ROWS; i = i + 1){
            if (this.isRowFull(i)) {
                for (let j = 0; j < COLS; j = j + 1) {
                    this.field[j][i] = 0;
                }
                this.gameStatistic.lines + 1;
            }
        }
    }

    update() {
        console.log("field update");
        this.RemoveFullRows();
        this.applyPhysics();
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
        this.generateNewFigure();
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
        for (let i = 0; i < this.size; i = i + 1) {
            newFigure[i] = []
            for (let j = 0; j < this.size; j = j + 1) {
                newFigure[i][j] = this.figure[j][i];
            }
        }
        this.figure = newFigure;
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
        switch (c) {
            case 1:
                this.figure = [[0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [c, c, c, c],
                               [0, 0, 0, 0]];
                break;
            case 2:
                this.figure = [[0, 0, 0, 0],    //[0, 0, 1, 0], 
                               [0, c, 0, 0],    //[0, 0, 1, 0], 
                               [0, c, c, c],    //[0, 1, 1, 0], 
                               [0, 0, 0, 0]];   //[0, 0, 0, 0]];
                break;
            case 3:
                this.figure = [[0, 0, 0, 0],
                               [0, 0, c, 0],
                               [c, c, c, 0],
                               [0, 0, 0, 0]];
                break;
            case 4:
                this.figure = [[0, 0, 0, 0],
                               [0, c, c, 0],
                               [c, c, 0, 0],
                               [0, 0, 0, 0]];
                break;
            case 5:
                this.figure = [[0, 0, 0, 0],
                               [c, c, 0, 0],
                               [0, c, c, 0],
                               [0, 0, 0, 0]];
                break;
            case 6:
                this.figure = [[0, 0, 0, 0],
                               [0, c, 0, 0],
                               [c, c, c, 0],
                               [0, 0, 0, 0]];
                break;
            case 7:
                this.figure = [[0, 0, 0, 0],
                               [0, c, c, 0],
                               [0, c, c, 0],
                               [0, 0, 0, 0]];
                break;
            case 8:
                this.figure = [[0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [c, c, c, c],
                               [0, 0, 0, 0]];
                break;
            default:
                break;
        }
        this.size = 4;
        this.position = {x : COLS / 2 - 2, y : 0};
    }

    update() {
        if ( ! this.applyPhysics()) {
            this.saveFigureToField();
            this.generateNewFigure();
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
    }
}




class EventController {
    constructor(figure) {
        this.figure = figure;
        this.keyListLeft = ['a', 'A', 'ф', 'Ф'];
        this.keyListRight = ['d', 'D', 'в', 'В'];
        this.keyListRotate = ['e', 'E', 'У', 'у'];
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

function game() {

    let gameStatistic = {score : 0, lines : 0, level : 1};
    let field = new Field(gameStatistic);
    let figure = new Figure(field);
    let eventController = new EventController(figure);

    function gameLoop() {

        eventController.update();
        field.update();
        if ( ! figure.update()) {
            clearInterval(refreshIntervalId);
            createExitButton();
            return;
        }

        field.draw();
        figure.draw();

    }

    let refreshIntervalId = setInterval(gameLoop, 300);
    document.addEventListener("keydown", eventController);
}

game();