const columnBoard = parseInt(localStorage.boardHeight) || 10;
const lineBoard = parseInt(localStorage.boardWidth) || 10;
let attemps = 0;
let maxScore = localStorage.score ? JSON.parse(localStorage.score) : [0, 0, 0];
let boardMode = localStorage.boardMode || "Normal";
let positionBoard = localStorage.positionBoard || 1;
//const BASE_URL = "https://snakegamewillianback.up.railway.app";
const BASE_URL = "http://localhost:3100";

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
    ];

    setIntervalID = null;
    food = [null, null];
    keySwitch = "ArrowLeft";
    moveSpeed = 220;
    stop = false;
    score = 0;


    build(){
        document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;
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
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}`).classList.add("snake");
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
        document.querySelector("#score").innerText = `Score: ${this.score}`;
    }

    generateFood(){
        this.food[0] = Math.floor(Math.random() * board.line);
        this.food[1] = Math.floor(Math.random() * board.column);
        const foodPosition = document.querySelector(`#c${this.food[1]}l${this.food[0]}`);

        if(foodPosition.classList.contains("snake")){
            this.generateFood();
            return;
        }

        const cell = new Cell(this.food[1], this.food[0], "food");
        cell.draw();
    }

    gameOver(){
        this.stop = true;
        clearInterval(this.setIntervalID);

        const verifyDB = async () => {
            if(localStorage.id){
                return false;
            }

            return true;
        };

        const waitVerify = async() => {
            const result = await verifyDB();

            if(result === true){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Você perdeu!", "saveScore");
            } else if(
                (maxScore[positionBoard] < this.score) &&
                (result === false)
            ){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "New Record!", "updateScore");
            } else {
                createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Você perdeu!", "lost");
            }
        };

        waitVerify();
    }

    win(){
        this.stop = true;
        clearInterval(this.setIntervalID);

        const verifyDB = async () => {
            if(localStorage.id){
                return false;
            }

            return true;
        };

        const waitVerify = async() => {
            const result = await verifyDB();

            if(result === true){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Você Venceu!", "saveScore");
            } else {
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Você venceu!", "updateScore");
            }
        };

        waitVerify();
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
            document.querySelector("#attemps").innerText = `Tentativas: ${attemps}`;
            this.firstTime = false;
        }

        clearInterval(board.setIntervalID);
        board.keySwitch = clicked;
        board.definingMove();
    }

    moveKeydown(){
        const moveKeydownF = (target) => {
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
                document.querySelector("#attemps").innerText = `Tentativas: ${attemps}`;
                this.firstTime = false;
            }

            clearInterval(board.setIntervalID);
            board.keySwitch = targetVerify;
            board.definingMove();
        };

        document.addEventListener("keydown", moveKeydownF);
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
            square.classList.add("food");
        } else {
            document.querySelector(`#c${board.snake[board.snake.length - 2].column}l${board.snake[board.snake.length - 2].line}`).classList.add("body");
            square.classList.add("snake");
            board.verifyMove(square);
        }
    }

    erase(square, removeFood){
        if(removeFood){
            square.classList.remove("food");
        } else {
            document.querySelector(`#c${board.snake[0].column}l${board.snake[0].line}`).classList.remove("snake", "body");
            board.snake.shift();
        }
    }
}

function loadName() {
    localStorage.snakeColor ? document.documentElement.style.setProperty("--snakeColor", localStorage.snakeColor) : null;
    const getName = document.querySelector("#getName");
    const nameLi = document.querySelector(".nameLi");
    getName.innerText = localStorage.name || "Anônimo";
    !localStorage.name ? nameLi.style.cursor = "pointer" : nameLi.style.cursor = "default";
}

function createMenu(menu, message, key, type = "") {

    const tryAgain = (target) => {
        if((!target.key) || (target.key === " ") || (target.key === "Enter")){
            document.removeEventListener("keydown", tryAgain);
            button.removeEventListener("click", tryAgain);

            a.removeEventListener("click", tryAgain);

            document.querySelector("#score").innerText = `Score: 0`;
            const food = document.querySelector(".food");
            food ? food.classList.remove("food") : null;

            document.querySelectorAll(".square").forEach(value => {
                value.remove();
            });

            menu.remove();

            setTimeout(() => {
                board = new Board(columnBoard, lineBoard);
                board.build();
            }, 200);
        }
    };

    const closeMenu = () => {
        a.removeEventListener("click", tryAgain);
        menu.remove();
        board.stop = false;
        board.snakeManipulator.moveKeydown();
    };

    const verifyName = () => {
        if(inputName.value.length >= 3 && inputName.value.length <= 10){
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";

            const verifyN = async () => {
                const reponse = await fetch(BASE_URL + "/getAllData");
                const data = await reponse.json();
                let verify = true;

                data.listRanking.forEach(element => {
                    if(element.userName === inputName.value) {
                        button.disabled = true;
                        verify = false;
                        button.style.backgroundColor = "black";
                        button.style.color = "#8e0eff";
                        return;
                    }
                });

                if(verify === true) {
                    button.disabled = false;
                    button.style.backgroundColor = "#8e0eff";
                    button.style.color = "white";
                }
            };

            verifyN();
        } else {
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";
        }
    };

    menu.classList.add("menu");
    menu.appendChild(document.createElement("span")).innerText = message;

    const a = menu.appendChild(document.createElement("a"));
    a.id = "aMenu";

    !type ? a.addEventListener("click", tryAgain) : a.addEventListener("click", closeMenu);

    const spanA = a.appendChild(document.createElement("span"));
    spanA.innerText = "X";
    spanA.id = "spanA";

    key === "saveScore" ? menu.appendChild(document.createElement("span")).innerText = "Salve o seu score!" : null;

    const divForm = document.createElement("div");
    divForm.classList.add("divForm");

    const button = document.createElement("button");
    const inputName = document.createElement("input");

    if(key === "saveScore"){
        menu.appendChild(divForm);

        divForm.appendChild(inputName);
        inputName.type = "text";
        inputName.placeholder = "Digite o seu nome...";
        inputName.name = "userName";
        inputName.classList.add("inputName");

        inputName.addEventListener("input", verifyName);

        divForm.appendChild(button);
        button.innerText = "Salvar";
        button.name = "submitRanking";
        button.classList.add("buttonTryAgain");

        const uploadRanking = (target) => {
            if((!target.key) || (target.key === "Enter")){
                document.removeEventListener("keydown", uploadRanking);
                button.removeEventListener("click", uploadRanking);
            } else {
                return;
            }

            fetch(BASE_URL + "/saveScore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userName: inputName.value, score:  board.score, position: positionBoard })
            })
                .then(response => {
                    if(response.status === 201){
                        return response.json();
                    } else if(response.status === 409) {
                        delete localStorage.name;
                        delete localStorage.id;
                        delete localStorage.score;
                        window.location.href = "/";
                        alert("Esse nome já existe!");
                    } else{
                        return null;
                    }
                })
                .then(data => {
                    if(data){
                        localStorage.id = data.id;
                        localStorage.name = data.name;
                    }
                })
                .catch(err => console.error(err));

            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";

            loadName();

            if(type){
                return closeMenu();
            } else {
                return tryAgain();
            }
        };

        document.addEventListener("keydown", uploadRanking);
        button.addEventListener("click", uploadRanking);
    } else if(key === "updateScore"){
        fetch(BASE_URL + "/updateScore", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: localStorage.id, score:  board.score, position: positionBoard })
        }).then(_response => null)
            .catch(err => console.error(err));

        menu.appendChild(divForm);

        divForm.appendChild(button);
        button.innerText = "Try Again";
        button.name = "updateRanking";
        button.classList.add("buttonTryAgain");

        document.addEventListener("keydown", tryAgain);
        button.addEventListener("click", tryAgain);
    } else if(key === "lost"){
        menu.appendChild(divForm);

        divForm.appendChild(button);
        button.innerText = "Try Again";
        button.classList.add("buttonTryAgain");

        document.addEventListener("keydown", tryAgain);
        button.addEventListener("click", tryAgain);
    } else if(key === "newName"){
        menu.appendChild(divForm);

        divForm.appendChild(inputName);
        inputName.type = "text";
        inputName.placeholder = "Digite o seu nome...";
        inputName.name = "userName";
        inputName.classList.add("inputName");
        inputName.focus();

        divForm.appendChild(button);
        button.innerText = "Salvar";
        button.classList.add("buttonTryAgain");

        inputName.addEventListener("input", verifyName);

        button.addEventListener("click", () => {
            button.disabled = true;
            fetch(BASE_URL + "/updateName/",{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: localStorage.id, userName: inputName.value })
            })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    } else if(response.status === 409) {
                        window.location.href = "/";
                        alert("Esse nome já existe!");
                    } else {
                        return null;
                    }
                })
                .then(data => {
                    localStorage.name = data.name;
                    loadName();
                    closeMenu();
                    alert("Nome atualizado com sucesso!");
                })
                .catch(err => console.error(err));
        });
    } else if(key === "switchColor"){
        const arrayColors = [
            "#8e0eff",
            "red",
            "#33ff00",
            "white",
            "blue",
            "#ff00bb"
        ];

        let positionColor = localStorage.positionColor || 0;

        const divChoiceColor = menu.appendChild(document.createElement("div"));
        divChoiceColor.classList.add("divChoiceColor");

        const buttonLeftColor = divChoiceColor.appendChild(document.createElement("button"));
        buttonLeftColor.innerText = "<-";
        buttonLeftColor.classList.add("buttonChoiceColor");

        const colorExample = divChoiceColor.appendChild(document.createElement("div"));
        colorExample.classList.add("colorExample");
        colorExample.style.backgroundColor = arrayColors[positionColor];

        const buttonRightColor = divChoiceColor.appendChild(document.createElement("button"));
        buttonRightColor.innerText = "->";
        buttonRightColor.classList.add("buttonChoiceColor");

        menu.appendChild(button);
        button.innerText = "Salvar";
        button.classList.add("buttonTryAgain");

        buttonLeftColor.onclick = () => {
            if(positionColor != 0){
                positionColor--;
            } else {
                positionColor = arrayColors.length - 1;
            }

            colorExample.style.backgroundColor = arrayColors[positionColor];
        };

        buttonRightColor.onclick = () => {
            if(positionColor != arrayColors.length - 1){
                positionColor++;
            } else {
                positionColor = 0;
            }

            colorExample.style.backgroundColor = arrayColors[positionColor];
        };


        button.onclick = () => {
            localStorage.positionColor = positionColor;
            localStorage.snakeColor = arrayColors[positionColor];
            document.documentElement.style.setProperty("--snakeColor", arrayColors[positionColor]);

            closeMenu();
        };
    } else if(key === "getBoard") {
        const arrayBoard = [
            [6, 6, "Easy"],
            [10, 10, "Normal"],
            [15, 15, "Hard"]
        ];

        let positionBoard = localStorage.positionBoard || 1;

        const divChoiceBoard = menu.appendChild(document.createElement("div"));
        divChoiceBoard.classList.add("divChoiceBoard");

        const buttonLeftBoard = divChoiceBoard.appendChild(document.createElement("button"));
        buttonLeftBoard.innerText = "<-";
        buttonLeftBoard.classList.add("buttonChoiceBoard");

        const boardHW = divChoiceBoard.appendChild(document.createElement("div"));
        boardHW.classList.add("boardHW");
        const spanBoard = boardHW.appendChild(document.createElement("span"));
        spanBoard.innerText = arrayBoard[positionBoard][2];
        spanBoard.id = "spanBoard";

        const buttonRightBoard = divChoiceBoard.appendChild(document.createElement("button"));
        buttonRightBoard.innerText = "->";
        buttonRightBoard.classList.add("buttonChoiceBoard");

        menu.appendChild(button);
        button.innerText = "Salvar";
        button.classList.add("buttonTryAgain");

        buttonLeftBoard.onclick = () => {
            if(positionBoard != 0){
                positionBoard--;
            } else {
                positionBoard = arrayBoard.length - 1;
            }

            spanBoard.innerText = arrayBoard[positionBoard][2];
        };

        buttonRightBoard.onclick = () => {
            if(positionBoard != arrayBoard.length - 1){
                positionBoard++;
            } else {
                positionBoard = 0;
            }

            spanBoard.innerText = arrayBoard[positionBoard][2];
        };


        button.onclick = () => {
            localStorage.positionBoard = positionBoard;
            localStorage.boardHeight = arrayBoard[positionBoard][0];
            localStorage.boardWidth = arrayBoard[positionBoard][1];

            window.location.href = "";
        };
    }
}

const menuClick = () => {
    const menuItens = document.querySelector("#menuItens");

    menuItens.style.display === "none"
        ? (
            (menuItens.style.display = "flex"),
            (document.querySelector("#menuHamburguerSpan").style.color = "#8e0eff")
        )
        : (
            (menuItens.style.display = "none"),
            (document.querySelector("#menuHamburguerSpan").style.color = "black")
        );
};

const updateName = () => {
    if(!localStorage.name){
        alert("Você precisa de um nome antes...");
        return;
    }

    board.stop = true;
    const menuItens = document.querySelector("#menuItens");

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Mudar Nome", "newName", "dontStop");
};

const snakeColor = () => {
    const menuItens = document.querySelector("#menuItens");

    board.stop = true;

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Mudar Cor", "switchColor", "dontStop");
};

const createAccount = () => {
    if(localStorage.name){
        return alert(`Este é o seu nome: ${localStorage.name}`);
    }

    const menuItens = document.querySelector("#menuItens");

    board.stop = true;

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    board.score = 1;
    maxScore[positionBoard] = board.score;
    localStorage.score = JSON.stringify(maxScore);

    createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Cadastrar User", "saveScore", "dontStop");
};

const getBoard = () => {
    const menuItens = document.querySelector("#menuItens");

    board.stop = true;

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    createMenu(document.querySelector(".board").appendChild(document.createElement("div")), "Mudar Tamanho", "getBoard", "dontStop");
};

loadName();

let board = new Board(columnBoard, lineBoard);

board.build();