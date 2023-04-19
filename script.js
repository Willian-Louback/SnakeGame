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

    velocidadeAlternator = 220;
    velocidade = this.velocidadeAlternator;
    setTimeout = "";
    keySwitch = "ArrowLeft";
    firstTime = true;
    stop = false;
    menu = '';
    buttonTryAgain = "";
    loser = true;

    render(){
        cell.render(this.keySwitch, this.stop);
        this.setTimeout = setInterval(cell.render.bind(cell, this.keySwitch, this.stop), this.velocidade);
    }

    movButton(clicked){
        if(clicked === this.keySwitch){
            return;
        }

        if(this.firstTime === false){
            if(
                (clicked === "ArrowRight" && this.keySwitch === "ArrowLeft") ||
                (clicked === "ArrowUp" && this.keySwitch === "ArrowDown") ||
                (clicked === "ArrowDown" && this.keySwitch === "ArrowUp") ||
                (clicked === "ArrowLeft" && this.keySwitch === "ArrowRight")
            ){
                return;
            }
        } else {
            document.querySelector("#attemps").innerHTML = `Tentativas: ${tryAgain.attemps}`;
            this.firstTime = false;
        }

        clearInterval(this.setTimeout);
        this.keySwitch = clicked;
        this.render();
    }

    mov(){
        document.addEventListener("keydown", (target) => {
            let targetVerify = target.key;

            if(targetVerify === "w"){
                targetVerify = "ArrowUp";
            } else if(targetVerify === "a"){
                targetVerify = "ArrowLeft";
            } else if(targetVerify === "s"){
                targetVerify = "ArrowDown";
            } else if(targetVerify === "d"){
                targetVerify = "ArrowRight";
            }

            if(targetVerify.indexOf("Arrow") !== 0){
                return;
            }

            if(targetVerify === this.keySwitch){
                return;
            }

            if(this.firstTime === false){
                if(
                    (targetVerify === "ArrowRight" && this.keySwitch === "ArrowLeft") ||
                    (targetVerify === "ArrowUp" && this.keySwitch === "ArrowDown") ||
                    (targetVerify === "ArrowDown" && this.keySwitch === "ArrowUp") ||
                    (targetVerify === "ArrowLeft" && this.keySwitch === "ArrowRight")
                ){
                    return;
                }
            } else {
                document.querySelector("#attemps").innerHTML = `Tentativas: ${tryAgain.attemps}`;
                this.firstTime = false;
            }

            clearInterval(this.setTimeout);
            this.keySwitch = targetVerify;
            this.render();
        })
    }

    gameOver(){
        clearInterval(this.setTimeout); // Há um problema aqui (O algoritmo faz o primeiro cell.render, e antes dele finalizar o cell.render com o timeout, ele chega aqui, aí o clearInterval não funciona.)
        if(this.stop === false){
            this.menu = document.querySelector(".board").appendChild(document.createElement("div"));
            this.menu.classList.add("menu");
            this.menu.appendChild(document.createElement("span")).innerHTML = "Você perdeu!";
            this.buttonTryAgain = this.menu.appendChild(document.createElement("button"));
            this.buttonTryAgain.classList.add("buttonTryAgain");
            this.buttonTryAgain.innerHTML = "Try Again";
            this.buttonTryAgain.addEventListener('click', () => {
                tryAgain.newGame();
            })
            document.addEventListener('keydown', function tryAgainF(target) {
                if((target.key === " ") || (target.key === "Enter")){
                    document.removeEventListener('keydown', tryAgainF);
                    tryAgain.newGame();
                }
            })
        }
        this.stop = true;
        return;
    }

    win(){
        clearInterval(this.setTimeout);
        if(this.stop === false){
            this.menu = document.querySelector(".board").appendChild(document.createElement("div"));
            this.menu.classList.add("menu");
            this.menu.appendChild(document.createElement("span")).innerHTML = "Parabéns!<br>Você ganhou!";
            this.buttonTryAgain = this.menu.appendChild(document.createElement("button"));
            this.buttonTryAgain.classList.add("buttonTryAgain");
            this.buttonTryAgain.innerHTML = "Try Again";
            this.loser = false;
            this.buttonTryAgain.addEventListener('click', () => {
                tryAgain.newGame();
            })
        }
        this.stop = true;
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

    food = [null, null];
    headSnake = "";
    score = new Score(0);
    
    build(){
        for(let i = 0; i < this.snake.length; i++){
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add('snake');
            i < (this.snake.length - 1) ? document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add("body") : null;
        }

        this.headSnake = document.querySelector(`#c${this.snake[this.snake.length - 1].column}l${this.snake[this.snake.length - 1].line}`);
        this.foods();
        snakeManipulador.mov();
        if(snakeManipulador.firstTime === false){
            setTimeout(() => snakeManipulador.render(), 330);
        }
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
            snakeManipulador.gameOver();
        }
    }

    draw(){
        document.querySelector(`#c${this.snake[this.snake.length - 2].column}l${this.snake[this.snake.length - 2].line}`).classList.add('body');
        this.headSnake = document.querySelector(`#c${this.snake[this.snake.length - 1].column}l${this.snake[this.snake.length - 1].line}`);
        this.headSnake.classList.add('snake');

        if((this.snake.length - 1) === (board.column * board.line)) {
            this.headSnake.classList.remove("food");
            snakeManipulador.win(); 
            return;
        } else if(this.headSnake.classList.contains("food")){
            this.headSnake.classList.remove("food");
            this.score.calcularScore();
            if((this.snake.length) < (board.column * board.line)){
                this.foods();
            }
        } else {
            if(this.headSnake.classList.contains("body")){
                snakeManipulador.gameOver();
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
        this.score += 10;
        document.querySelector("#score").innerHTML = `Pontuação: ${this.score}`;
    }
}

class TryAgain {
    constructor(){
        this.attemps = 1;
    }

    newGame(){
        document.querySelectorAll('.snake').forEach(valor => {
            valor.classList.remove("snake");
            valor.classList.remove("body");
        })

        snakeManipulador.buttonTryAgain.classList.remove("buttonTryAgain");
        snakeManipulador.menu.style.visibility = "hidden";
        snakeManipulador.menu.style.pointerEvents = "none";

        snakeManipulador.velocidade = snakeManipulador.velocidadeAlternator;
        snakeManipulador.setTimeout = "";
        snakeManipulador.keySwitch = "ArrowRight";
        snakeManipulador.stop = false;
        snakeManipulador.menu = '';
        snakeManipulador.buttonTryAgain = '';
        cell.snake = [
            new Snake(0, 0),
            new Snake(1, 0),
            new Snake(2, 0)
        ] 
        cell.food = [null, null];
        cell.headSnake = '';
        cell.score.score = 0;
        document.querySelector("#score").innerHTML = `Pontuação: ${cell.score.score}`;

        if(snakeManipulador.loser === true){
            document.querySelector('.food').classList.remove('food');
            this.attemps++;
        } else {
            snakeManipulador.loser = true;
            this.attemps = 1;
        }

        document.querySelector("#attemps").innerHTML = `Tentativas: ${tryAgain.attemps}`;

        cell.build();
    }
}

const tryAgain = new TryAgain();
const snakeManipulador = new Snake();
const board = new Board(10, 10);
const cell = new Cell();

board.build();
cell.build();