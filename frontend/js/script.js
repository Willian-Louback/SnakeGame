const columnBoard = parseInt(localStorage.boardHeight) || 10;
const lineBoard = parseInt(localStorage.boardWidth) || 10;
const quantidadeTeste = 0;
let generation = 1;
let attemps = 0;
let maxScore = localStorage.score ? JSON.parse(localStorage.score) : [0, 0, 0];
let boardMode = localStorage.boardMode || "Normal";
let positionBoard = localStorage.positionBoard || 1;
const BASE_URL = "https://snakegameback-williandlouback.b4a.run/";
let maxScoreAi = 0;
//const BASE_URL = "http://localhost:3100";

class Board {
    constructor(column, line, numberBoard){
        this.column = column;
        this.line = line;
        this.snakeManipulator = new Snake();
        this.aiMode = false;
        this.ai = null;
        this.contador = 0;
        this.numberBoard = numberBoard;
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
        if(this.aiMode){
            this.ai = new Ai(this.numberBoard, this);
            this.ai.run();
        }

        document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;
        const boardArea = document.querySelector(".boardArea");
        boardArea.style.gridTemplateRows = `repeat(${Math.sqrt(quantidadeTeste)}, 1fr)`;
        boardArea.style.gridTemplateColumns = `repeat(${Math.sqrt(quantidadeTeste)}, 1fr)`;

        const boardMain = boardArea.appendChild(document.createElement("div"));
        boardMain.classList.add("board");
        boardMain.id = `b${this.numberBoard}`;

        boardMain.style.gridTemplateColumns = `repeat(${this.column}, 1fr)`;
        boardMain.style.gridTemplateRows = `repeat(${this.line}, 1fr)`;
        for(let i = 0; i < this.column; i++){
            for(let j = 0; j < this.line; j++){
                boardMain.appendChild(document.createElement("div")).classList.add(`squareB${this.numberBoard}`);
                boardMain.lastChild.id = `c${j}l${i}b${this.numberBoard}`;
            }
        }

        for(let i = 0; i < this.snake.length; i++){
            document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}b${this.numberBoard}`).classList.add("snake");
            i < (this.snake.length - 1) ? document.querySelector(`#c${this.snake[i].column}l${this.snake[i].line}b${this.numberBoard}`).classList.add("body") : null;
        }

        this.generateFood();

        if(this.aiMode === false){
            //this.snakeManipulator.moveButton(null); Verificar se isso vai afetar algo
            this.snakeManipulator.moveKeydown();
        }
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
        if(this.aiMode){
            this.ai.algoritmoGenetico(this.food[1], this.food[0]);
        }

        switch (this.keySwitch){
        case "ArrowRight":
            this.snake.push(new Snake(this.snake[this.snake.length - 1].column + 1, this.snake[this.snake.length - 1].line));
            if(this.snake[this.snake.length - 1].column === this.column){
                this.snake[this.snake.length - 1].column = 0;
            }
            break;
        case "ArrowUp":
            this.snake.push(new Snake(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line - 1));
            if(this.snake[this.snake.length - 1].line === -1){
                this.snake[this.snake.length - 1].line = this.line - 1;
            }
            break;
        case "ArrowLeft":
            this.snake.push(new Snake(this.snake[this.snake.length - 1].column - 1, this.snake[this.snake.length - 1].line));
            if(this.snake[this.snake.length - 1].column === -1){
                this.snake[this.snake.length - 1].column = this.column - 1;
            }
            break;
        case "ArrowDown":
            this.snake.push(new Snake(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line + 1));
            if(this.snake[this.snake.length - 1].line === this.line){
                this.snake[this.snake.length - 1].line = 0;
            }
            break;
        }

        const cell = new Cell(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line, "snake", this.numberBoard, this);
        cell.draw();
    }

    verifyMove(square){
        const cell = new Cell(this.snake[this.snake.length - 1].column, this.snake[this.snake.length - 1].line, "snake", this.numberBoard, this);

        if((this.snake.length - 1) === (this.column * this.line)) {
            this.win();
            return;
        } else if(square.classList.contains("food")){
            cell.erase(square, true);
            this.calculateScore();
            if((this.snake.length) < (this.column * this.line)){
                this.generateFood();
            }
        } else if(square.classList.contains("body")){
            if(this.aiMode === true) {
                clearInterval(this.setIntervalID);
                board.contador++;

                if(board.contador === quantidadeTeste){
                    if(this.score > maxScoreAi) {
                        maxScoreAi = this.score;
                    }

                    console.log(this.numberBoard);

                    setTimeout(() => {
                        generation++;
                        document.querySelector("#score").innerText = `Best score: ${maxScoreAi}`;
                        document.querySelector("#attemps").innerText = `Geração: ${generation}`;
                        console.log(maxScoreAi);
                        document.querySelectorAll(`.board`).forEach(value => {
                            value.remove();
                        });

                        board = new Board(columnBoard, lineBoard, 1);
                        board.build();

                        boards = [];

                        for (let i = 2; i <= quantidadeTeste; i++) {
                            const newboards = new Board(columnBoard, lineBoard, i);
                            boards.push(newboards);
                            boards[boards.length - 1].build();
                        }

                        /*board2 = new Board(columnBoard, lineBoard, 2);
                        board2.build();

                        board3 = new Board(columnBoard, lineBoard, 3);
                        board3.build();

                        board4 = new Board(columnBoard, lineBoard, 4);
                        board4.build();*/
                    }, 1000);
                }
                return;
            }
            this.gameOver();
            return;
        } else {
            cell.erase(square);
        }
    }

    calculateScore(){
        this.score += 10;
        if(this.aiMode === false){
            document.querySelector("#score").innerText = `Score: ${this.score}`;
        }
    }

    generateFood(){
        if(this.aiMode){
            clearInterval(this.setIntervalID);
        }

        this.food[0] = Math.floor(Math.random() * this.line);
        this.food[1] = Math.floor(Math.random() * this.column);
        const foodPosition = document.querySelector(`#c${this.food[1]}l${this.food[0]}b${this.numberBoard}`);

        if(foodPosition.classList.contains("snake")){
            this.generateFood();
            return;
        }

        const cell = new Cell(this.food[1], this.food[0], "food", this.numberBoard, this);

        cell.draw();

        if(this.aiMode){
            this.setIntervalID = setInterval(() => this.move(), this.moveSpeed);
        }
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

                createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Você perdeu!", "saveScore");
            } else if(
                (maxScore[positionBoard] < this.score) &&
                (result === false)
            ){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "New Record!", "updateScore");
            } else {
                createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Você perdeu!", "lost");
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

                createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Você Venceu!", "saveScore");
            } else {
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerText = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Você venceu!", "updateScore");
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
    constructor(column, line, type, numberBoard, boardThis){
        this.column = column;
        this.line = line;
        this.numberBoard = numberBoard;
        this.type = type;
        this.boardThis = boardThis;
    }

    draw(){
        const square = document.querySelector(`#c${this.column}l${this.line}b${this.numberBoard}`);
        if(this.type === "food"){
            square.classList.add("food");
        } else {
            document.querySelector(`#c${this.boardThis.snake[this.boardThis.snake.length - 2].column}l${this.boardThis.snake[this.boardThis.snake.length - 2].line}b${this.numberBoard}`).classList.add("body");
            square.classList.add("snake");
            this.boardThis.verifyMove(square);
        }
    }

    erase(square, removeFood){
        if(removeFood){
            square.classList.remove("food");
        } else {
            document.querySelector(`#c${this.boardThis.snake[0].column}l${this.boardThis.snake[0].line}b${this.numberBoard}`).classList.remove("snake", "body");
            this.boardThis.snake.shift();
        }
    }
}

class Ai {
    constructor(numberBoard, board) {
        this.targetVerify = "ArrowLeft";
        this.firstTime = true;
        this.numberBoard = numberBoard;
        this.board = board;
    }

    run(){
        console.log("Inteligência Artificial iniciando...");
    }

    algoritmoGenetico(fruitX, fruitY) {
        let verify = true; // Usado para verificar se a ação escolhida é possível, melhorar isso depois

        const headX = this.board.snake[this.board.snake.length - 1].column;
        const headY = this.board.snake[this.board.snake.length - 1].line;
        //console.log("snake",headX, headY, "fruit", fruitX, fruitY);

        // <<< Não está random aqui
        let choiceRandom = null;

        // <<< Tratando melhor movimento em relação a fruta
        let x = fruitX - headX;
        let y = fruitY - headY;
        let z = Math.abs(x) - Math.abs(y);

        if(z === 0){
            z = Math.floor(Math.random() * 2);
            z === 0 ? z = -1 : null;
        }

        if(z > 0){
            if(x === 0){
                x = Math.floor(Math.random() * 2);
                x === 0 ? x = -1 : null;
            }

            if(x > 0){
                choiceRandom = 0;
            } else {
                choiceRandom = 2;
            }
        } else {
            if(y === 0){
                y = Math.floor(Math.random() * 2);
                y === 0 ? y = -1 : null;
            }

            if(y > 0){
                choiceRandom = 3;
            } else {
                choiceRandom = 1;
            }
        }
        // >>> Tratando melhor movimento em relação a fruta

        // <<< Verificando se IA escolheu um movimento válido
        const verifyMove = () => {
            switch(choiceRandom){
            case 0:
                this.targetVerify = "ArrowRight";
                break;
            case 1:
                this.targetVerify = "ArrowUp";
                break;
            case 2:
                this.targetVerify = "ArrowLeft";
                break;
            case 3:
                this.targetVerify = "ArrowDown";
                break;
            }

            if(!this.firstTime){
                if(
                    (this.targetVerify === "ArrowRight" && this.board.keySwitch === "ArrowLeft") ||
                    (this.targetVerify === "ArrowUp" && this.board.keySwitch === "ArrowDown") ||
                    (this.targetVerify === "ArrowDown" && this.board.keySwitch === "ArrowUp") ||
                    (this.targetVerify === "ArrowLeft" && this.board.keySwitch === "ArrowRight")
                ){
                    return false;
                }
            } else {
                if(
                    (this.targetVerify === "ArrowUp" && this.board.keySwitch === "ArrowDown") ||
                    (this.targetVerify === "ArrowDown" && this.board.keySwitch === "ArrowUp") ||
                    (this.targetVerify === "ArrowLeft" && this.board.keySwitch === "ArrowRight")
                ){
                    return false;
                } else {
                    this.firstTime = false;
                    return true;
                }
            }
        };

        verify = verifyMove();

        /*if(verify === false) {
            return;
        }*/
        // >>> Verificando se IA escolheu um movimento válido

        // <<< Fazendo IA desviar do próprio corpo sempre que possível
        const checkPosition = (sense, sign) => {
            teste++;
            let bodySnake = null;

            if(sense === "horizontal") {
                if(sign === "positive"){
                    if(headX !== (this.board.column - 1)) {
                        bodySnake = document.querySelector(`#c${headX + 1}l${headY}b${this.numberBoard}`);
                    } else {
                        bodySnake = document.querySelector(`#c0l${headY}b${this.numberBoard}`);
                    }
                } else {
                    if(headX !== 0) {
                        bodySnake = document.querySelector(`#c${headX - 1}l${headY}b${this.numberBoard}`);
                    } else {
                        bodySnake = document.querySelector(`#c${this.board.column - 1}l${headY}b${this.numberBoard}`);
                    }
                }
            } else {
                if(sign === "positive"){
                    if(headY !== (this.board.line - 1)) {
                        bodySnake = document.querySelector(`#c${headX}l${headY + 1}b${this.numberBoard}`);
                    } else {
                        bodySnake = document.querySelector(`#c${headX}l0b${this.numberBoard}`);
                    }
                } else {
                    if(headY !== 0) {
                        bodySnake = document.querySelector(`#c${headX}l${headY - 1}b${this.numberBoard}`);
                    } else {
                        bodySnake = document.querySelector(`#c${headX}l${this.board.line - 1}b${this.numberBoard}`);
                    }
                }
            }

            if(teste === 20){
                //console.log("F");
                return false;
            }

            if(bodySnake.classList.contains("body")) {
                //console.log("vai dar merda", console.log(bodySnake, this.numberBoard));
                //alert("Inteligência artificial teste :)");
                choiceRandom = Math.floor(Math.random() * 4);
                verify = verifyMove();

                return true;
            }
            //console.log("teste", console.log("sem var:",document.querySelector(`#c${board.snake[board.snake.length - 1].column}l${board.snake[board.snake.length - 1].line}`), bodySnake, sense, sign));

            return false;

        };

        //Apenas para teste
        let teste = 0;
        //Apenas para teste

        const checkDeath = () => {
            //console.log(teste);

            switch(choiceRandom){
            case 0: {
                const bodySnake = checkPosition("horizontal", "positive");
                if(bodySnake === false) {
                    break;
                } else {
                    checkDeath();
                    //console.log("vai de F");
                }
                break;
            }
            case 1: {
                const bodySnake = checkPosition("vertical", "negative");
                if(bodySnake === false) {
                    break;
                } else {
                    checkDeath();
                    //console.log("vai de F");
                }
                break;
            }
            case 2: {
                const bodySnake = checkPosition("horizontal", "negative");
                if(bodySnake === false) {
                    break;
                } else {
                    checkDeath();
                    //console.log("vai de F");
                }
                break;
            }
            case 3: {
                const bodySnake = checkPosition("vertical", "positive");
                if(bodySnake === false) {
                    break;
                } else {
                    checkDeath();
                    //console.log("vai de F");
                }
                break;
            }
            }
        };

        checkDeath();
        // >>> Fazendo IA desviar do próprio corpo sempre que possível

        // >>> Não está random aqui

        /*VERIFICAR*/
        if(this.targetVerify === this.board.keySwitch){
            return;
        }

        if(verify === false) {
            return;
        }

        this.board.keySwitch = this.targetVerify;
        /*VERIFICAR*/
    }

    redeNeural() {

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
        if((!target.key) || (target.key === "Enter")){
            document.removeEventListener("keydown", tryAgain);
            button.removeEventListener("click", tryAgain);

            a.removeEventListener("click", tryAgain);

            document.querySelector("#score").innerText = `Score: 0`;
            const food = document.querySelector(".food");
            food ? food.classList.remove("food") : null;

            document.querySelectorAll(".board").forEach(value => {
                value.remove();
            });

            menu.remove();

            setTimeout(() => {
                board = new Board(columnBoard, lineBoard, 1);
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

        button.addEventListener("click", uploadRanking);

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

    const verifyName = () => {
        if(inputName.value.length >= 3 && inputName.value.length <= 10){
            key === "saveScore" ? document.removeEventListener("keydown", uploadRanking) : null;
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";

            const verifyN = async () => {
                const reponse = await fetch(BASE_URL + "/getAllData");
                const data = await reponse.json();
                let verify = true;

                data.listRanking.forEach(element => {
                    if(element.userName === inputName.value) {
                        verify = false;
                        return;
                    }
                });

                if(verify === true) {
                    if(inputName.value.length >= 3 && inputName.value.length <= 10){ // Precisei reforçar a verificação pois estava bugando
                        button.disabled = false;
                        button.style.backgroundColor = "#8e0eff";
                        button.style.color = "white";
                        key === "saveScore" ? document.addEventListener("keydown", uploadRanking) : null;
                    }
                }
            };

            verifyN();
        } else {
            key === "saveScore" ? document.removeEventListener("keydown", uploadRanking) : null;
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

    createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Mudar Nome", "newName", "dontStop");
};

const snakeColor = () => {
    const menuItens = document.querySelector("#menuItens");

    board.stop = true;

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Mudar Cor", "switchColor", "dontStop");
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

    createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Cadastrar User", "saveScore", "dontStop");
};

const getBoard = () => {
    const menuItens = document.querySelector("#menuItens");

    board.stop = true;

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    createMenu(document.querySelector(".boardArea").appendChild(document.createElement("div")), "Mudar Tamanho", "getBoard", "dontStop");
};

loadName();

let board = new Board(columnBoard, lineBoard, 1);

board.build();

let boards = [];

for (let i = 2; i <= quantidadeTeste; i++) {
    const newboards = new Board(columnBoard, lineBoard, i);
    boards.push(newboards);
    boards[boards.length - 1].build();
}