const columnBoard = 5;
const lineBoard = 5;
let attemps = 0;

class Board {
    constructor(column, line){
        this.column = column;
        this.line = line;
        this.snakeManipulator = new Snake();
    }

    snake = [
        new Snake(0, 0),
        new Snake(1, 0),
        new Snake(2, 0)
    ]

    setIntervalID = null;
    food = [null, null];
    keySwitch = "ArrowLeft";
    moveSpeed = 220;
    menu = '';
    buttonTryAgain = "";
    stop = false;
    score = 0;


    build(){
        const boardMain = document.querySelector(".board");
        boardMain.style.gridTemplateColumns = `repeat(${this.column}, 1fr)`;
        boardMain.style.gridTemplateRows = `repeat(${this.line}, 1fr)`;
        for(let i = 0; i < this.column; i++){
            for(let j = 0; j < this.line; j++){
                boardMain.appendChild(document.createElement("div")).classList.add("square");
                boardMain.lastChild.id = `c${j}l${i}`;
            }
        }

        for(let i = 0; i < this.snake.length; i++){
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add('snake');
            i < (this.snake.length - 1) ? document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add("body") : null;
        }

        this.generateFood();
        this.snakeManipulator.moveButton(null);
        this.snakeManipulator.moveKeydown();
    }

    definingMove(){
        this.move();
        this.setIntervalID = setInterval(() => this.move(), this.moveSpeed);
        if(this.stop){
            clearInterval(this.setIntervalID);
            return;
        }
    }

    move(){
        switch (this.keySwitch){
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
        
        const cell = new Cell(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line, "snake");
        cell.draw();
    }

    verifyMove(square){
        const cell = new Cell();
        if((this.snake.length - 1) === (board.column * board.line)) {
            board.win();
            return;
        } else if(square.classList.contains("food")){
            cell.erase(square, true);
            this.calculateScore();
            if((this.snake.length) < (board.column * board.line)){
                this.generateFood();
            }
        } else if(square.classList.contains("body")){
            this.gameOver();
            return;
        } else {
            cell.erase(square);
        }
    }

    calculateScore(){
        this.score += 10;
        document.querySelector("#score").innerHTML = `Pontuação: ${this.score}`;
    }

    generateFood(){
        this.food[0] = Math.floor(Math.random() * board.line);
        this.food[1] = Math.floor(Math.random() * board.column);
        const foodPosition = document.querySelector(`#c${this.food[1]}l${this.food[0]}`);
        
        if(foodPosition.classList.contains('snake')){
            this.generateFood();
            return;
        }

        const cell = new Cell(this.food[1], this.food[0], "food");
        cell.draw();
    }

    gameOver(){
        this.stop = true;
        clearInterval(this.setIntervalID);
        
        this.menu = document.querySelector(".board").appendChild(document.createElement("div"));
        this.menu.classList.add("menu");
        this.menu.appendChild(document.createElement("span")).innerHTML = "Você perdeu!";
        this.buttonTryAgain = this.menu.appendChild(document.createElement("button"));
        this.buttonTryAgain.classList.add("buttonTryAgain");
        this.buttonTryAgain.innerHTML = "Try Again";

        function tryAgainF(target){
            if((target.key === " ") || (target.key === "Enter")){
                document.removeEventListener('keydown', tryAgainF);
                document.querySelector("#score").innerHTML = `Pontuação: 0`;
                const food = document.querySelector('.food');
                food ? food.classList.remove('food') : null;

                document.querySelectorAll('.square').forEach(value => {
                    value.remove();
                })

                board.menu.remove();

                setTimeout(() => {

                    board = new Board(columnBoard, lineBoard);
                    board.build();
                }, 200);
            }
        }

        document.addEventListener('keydown', tryAgainF);

        this.buttonTryAgain.addEventListener('click', () => {
            document.removeEventListener('keydown', tryAgainF);
            document.querySelector("#score").innerHTML = `Pontuação: 0`;
            const food = document.querySelector('.food');
            food ? food.classList.remove('food') : null;

            document.querySelectorAll('.square').forEach(value => {
                value.remove();
            })

            this.menu.remove();

            setTimeout(() => {
                board = new Board(columnBoard, lineBoard);
                board.build();
            }, 200);
        })
        
        return;
    }

    win(){
        this.stop = true;
        clearInterval(this.setIntervalID);

        this.menu = document.querySelector(".board").appendChild(document.createElement("div"));
        this.menu.classList.add("menu");
        this.menu.appendChild(document.createElement("span")).innerHTML = "Parabéns!<br>Você ganhou!";
        this.buttonTryAgain = this.menu.appendChild(document.createElement("button"));
        this.buttonTryAgain.classList.add("buttonTryAgain");
        this.buttonTryAgain.innerHTML = "Try Again";
        this.buttonTryAgain.addEventListener('click', () => {
            document.querySelector("#score").innerHTML = `Pontuação: 0`;

            document.querySelectorAll('.square').forEach(value => {
                value.remove();
            })

            this.menu.remove();
            attemps = 0;
            document.querySelector("#attemps").innerHTML = `Tentativas: ${attemps}`;

            setTimeout(() => {
                board = new Board(columnBoard, lineBoard);
                board.build();
            }, 200);
        })

        return;
    }
}

class Snake {
    constructor(y, x){
        this.column = y;
        this.line = x;
    }

    firstTime = true;

    moveButton(clicked){
        if(clicked === board.keySwitch || clicked === null || board.stop === true){
            return;
        }

        if(this.firstTime === false){
            if(
                (clicked === "ArrowRight" && board.keySwitch === "ArrowLeft") ||
                (clicked === "ArrowUp" && board.keySwitch === "ArrowDown") ||
                (clicked === "ArrowDown" && board.keySwitch === "ArrowUp") ||
                (clicked === "ArrowLeft" && board.keySwitch === "ArrowRight")
            ){
                return;
            }
        } else { 
            attemps++;
            document.querySelector("#attemps").innerHTML = `Tentativas: ${attemps}`;
            this.firstTime = false;
        }

        clearInterval(board.setIntervalID);
        board.keySwitch = clicked;
        board.definingMove();
    }

    moveKeydown(){
        document.addEventListener("keydown", function moveKeydownF(target) {
            if(board.stop === true){
                document.removeEventListener("keydown", moveKeydownF);
                return;
            }
            
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

            if(targetVerify === board.keySwitch){
                return;
            }

            if(this.firstTime === false){
                if(
                    (targetVerify === "ArrowRight" && board.keySwitch === "ArrowLeft") ||
                    (targetVerify === "ArrowUp" && board.keySwitch === "ArrowDown") ||
                    (targetVerify === "ArrowDown" && board.keySwitch === "ArrowUp") ||
                    (targetVerify === "ArrowLeft" && board.keySwitch === "ArrowRight")
                ){
                    return;
                }
            } else {
                attemps++;
                document.querySelector("#attemps").innerHTML = `Tentativas: ${attemps}`;
                this.firstTime = false;
            }

            clearInterval(board.setIntervalID);
            board.keySwitch = targetVerify;
            board.definingMove();
        }.bind(this));
    }
}

class Cell {
    constructor(column, line, type){
        this.column = column;
        this.line = line;
        this.type = type;
    }

    draw(){
        const square = document.querySelector(`#c${this.column}l${this.line}`);
        if(this.type === "food"){
            square.classList.add('food');
        } else {
            document.querySelector(`#c${board.snake[board.snake.length - 2].column}l${board.snake[board.snake.length - 2].line}`).classList.add('body');
            square.classList.add('snake');
            board.verifyMove(square);
        }
    }

    erase(square, removeFood){
        if(removeFood){
            square.classList.remove("food");
        } else {
            document.querySelector(`#c${board.snake[0].column}l${board.snake[0].line}`).classList.remove('snake', 'body');
            board.snake.shift();
        }
    }
}

let board = new Board(columnBoard, lineBoard);

board.build();