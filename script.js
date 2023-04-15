class Board {
    constructor(column, line){
        this.column = column;
        this.line = line;
    }

    build(){
        const main = document.querySelector(".board");

        for(let i = 0; i < this.column; i++){
            main.appendChild(document.createElement("div")).classList.add("column");
            for(let j = 0; j < this.line; j++){
                const column = document.querySelectorAll(".column");
                column[i].appendChild(document.createElement("div")).classList.add("square");
                column[i].lastChild.id= `c${i}l${j}`;
            }
        }
    }
}

class Snake {
    constructor(y, x){
        this.column = y;
        this.line = x;
    }

    velocidade = 240;
    setTimeout = "";
    keySwitch = "ArrowRight";

    render(){
        cell.render(this.keySwitch);
        this.setTimeout = setInterval(cell.render.bind(cell, this.keySwitch), this.velocidade);
    }

    mov(){
        document.addEventListener("keydown", (target) => {
            if(target.key === this.keySwitch){
                return;
            }

            if(
                (target.key === "ArrowRight" && this.keySwitch === "ArrowLeft") ||
                (target.key === "ArrowUp" && this.keySwitch === "ArrowDown") ||
                (target.key === "ArrowDown" && this.keySwitch === "ArrowUp") ||
                (target.key === "ArrowLeft" && this.keySwitch === "ArrowRight")
            ){
                return;
            }

            console.log("foi")
            clearInterval(this.setTimeout);
            this.keySwitch = target.key;
            this.render();
        })
    }
}

class Cell {
    constructor(){}
    
    snake = [
        new Snake(0, 0),
        new Snake(1, 0),
        new Snake(2, 0)
    ]

    snakeManipulador = new Snake(0,0);
    
    build(){
        for(let i = 0; i < this.snake.length; i++){
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add('snake');
        }

        this.snakeManipulador.mov();
    }

    render(key){
        switch (key){
            case "ArrowRight":
                this.snake.push(new Snake(this.snake[this.snake.length - 1].column + 1, this.snake[this.snake.length - 1].line));
                if(this.snake[this.snake.length - 1].column === board.column){
                    this.snake[this.snake.length - 1].column = 0;
                }
                
                break;
            case "ArrowUp":
                this.snake.push(new Snake(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line - 1));
                if(this.snake[this.snake.length - 1].line === -1){
                    this.snake[this.snake.length - 1].line = board.line - 1;
                }
                break;
            case "ArrowLeft":
                this.snake.push(new Snake(this.snake[this.snake.length - 1].column - 1, this.snake[this.snake.length - 1].line));
                if(this.snake[this.snake.length - 1].column === -1){
                    this.snake[this.snake.length - 1].column = board.column - 1;
                }
                break;
            case "ArrowDown":
                this.snake.push(new Snake(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line + 1));
                if(this.snake[this.snake.length - 1].line === board.line){
                    this.snake[this.snake.length - 1].line = 0;
                }
                break;
            default:
                if(key === null){
                    break;
                }
                return;
        }
        this.draw();
    }

    draw(){
        document.querySelector(`#c${this.snake[this.snake.length - 1].column}l${this.snake[this.snake.length - 1].line}`).classList.add('snake');
        document.querySelector(`#c${this.snake[0].column}l${this.snake[0].line}`).classList.remove('snake');
        this.snake.shift();
    }
}

const board = new Board(10, 10);
const cell = new Cell();

board.build();
cell.build();