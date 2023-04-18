class Board {
    constructor(column, line){
        this.column = column;
        this.line = line;
    }

    build(){
        const main = document.querySelector(".board");
        main.style.gridTemplateColumns = `repeat(${this.column}, 1fr)`;
        main.style.gridTemplateRows = `repeat(${this.line}, 1fr)`;
        for(let i = 0; i < this.column; i++){
            for(let j = 0; j < this.line; j++){
                main.appendChild(document.createElement("div")).classList.add("square");
                main.lastChild.id = `c${j}l${i}`;
            }
        }
    }
}

class Snake {
    constructor(y, x){
        this.column = y;
        this.line = x;
    }

    velocidade = 190;
    setTimeout = "";
    keySwitch = "ArrowLeft";
    firstTime = true;
    stop = false;

    render(){
        cell.render(this.keySwitch, this.stop);
        this.setTimeout = setInterval(cell.render.bind(cell, this.keySwitch, this.stop), this.velocidade);
    }

    mov(){
        document.addEventListener("keydown", (target) => {
            if(target.key.indexOf("Arrow") !== 0){
                return;
            }

            if(target.key === this.keySwitch){
                return;
            }
            if(this.firstTime === false){
                if(
                    (target.key === "ArrowRight" && this.keySwitch === "ArrowLeft") ||
                    (target.key === "ArrowUp" && this.keySwitch === "ArrowDown") ||
                    (target.key === "ArrowDown" && this.keySwitch === "ArrowUp") ||
                    (target.key === "ArrowLeft" && this.keySwitch === "ArrowRight")
                ){
                    return;
                }
            } else {
                this.firstTime = false;
            }

            clearInterval(this.setTimeout);
            this.keySwitch = target.key;
            this.render();
        })
    }

    gameOver(){
        this.stop === false ? alert("Você perdeu!") : null;
        this.stop = true;
        clearInterval(this.setTimeout); // Há um problema aqui (O algoritmo faz o primeiro cell.render, e antes dele finalizar o cell.render com o timeout, ele chega aqui, aí o clearInterval não funciona.)
        return;
    }

    win(){
        this.stop === false ? alert("Você ganhou!") : null;
        this.stop = true;
        clearInterval(this.setTimeout);
        return;
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
    food = [null, null];
    headSnake = "";
    stop = false;
    score = new Score(0);
    
    build(){
        for(let i = 0; i < this.snake.length; i++){
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add('snake');
            i < (this.snake.length - 1) ? document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add("body") : null;
        }

        this.headSnake = document.querySelector(`#c${this.snake[this.snake.length - 1].column}l${this.snake[this.snake.length - 1].line}`);
        this.foods();
        this.snakeManipulador.mov();
    }

    foods(){
        this.food[0] = Math.floor(Math.random() * board.line);
        this.food[1] = Math.floor(Math.random() * board.column);
        const foodH = document.querySelector(`#c${this.food[1]}l${this.food[0]}`);
        
        if(foodH.classList.contains('snake')){
            this.foods();
            return;
        }

        foodH.classList.add('food');
    }

    render(key, stop){
        if(stop === false){
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
            }
            this.draw();
        } else {
            this.snakeManipulador.gameOver();
        }
    }

    draw(){
        document.querySelector(`#c${this.snake[this.snake.length - 2].column}l${this.snake[this.snake.length - 2].line}`).classList.add('body');
        this.headSnake = document.querySelector(`#c${this.snake[this.snake.length - 1].column}l${this.snake[this.snake.length - 1].line}`);
        this.headSnake.classList.add('snake');

        if((this.snake.length - 1) === (board.column * board.line)) {
            this.headSnake.classList.remove("food");
            this.snakeManipulador.win(); 
            return;
        } else if(this.headSnake.classList.contains("food")){
            this.headSnake.classList.remove("food");
            this.score.calcularScore();
            if((this.snake.length) < (board.column * board.line)){
                this.foods();
            }
        } else {
            if(this.headSnake.classList.contains("body")){
                this.snakeManipulador.gameOver();
                return;
            }

            document.querySelector(`#c${this.snake[0].column}l${this.snake[0].line}`).classList.remove('snake');
            document.querySelector(`#c${this.snake[0].column}l${this.snake[0].line}`).classList.remove('body');
            this.snake.shift();
        }
    }
}

class Score {
    constructor(score){
        this.score = score;
    }

    calcularScore(){
        console.log(this.score)
        this.score += 10;
        document.querySelector("#score").innerHTML = `Pontuação: ${this.score}`;
    }
}

const board = new Board(10, 10);
const cell = new Cell();

board.build();
cell.build();