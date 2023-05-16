const columnBoard = parseInt(localStorage.boardHeight) || 10;
const lineBoard = parseInt(localStorage.boardWidth) || 10;
let attemps = 0;
let maxScore = localStorage.score ? JSON.parse(localStorage.score) : [0, 0, 0];
let boardMode = localStorage.boardMode || "Normal";
let positionBoard = localStorage.positionBoard || 1;
const BASE_URL = "https://snakegamewillianbackend.up.railway.app";

function loadInfo() {
    localStorage.snakeColor ? document.documentElement.style.setProperty("--snakeColor", localStorage.snakeColor) : null;
    const getName = document.querySelector("#getName");
    const nameLi = document.querySelector(".nameLi");
    getName.innerHTML = localStorage.name || "Anônimo";
    !localStorage.name ? nameLi.style.cursor = "pointer" : nameLi.style.cursor = "default";
}

function createMenu(menu, message, key) {
    menu.classList.add("menu");
    menu.appendChild(document.createElement("span")).innerHTML = message;

    const a = menu.appendChild(document.createElement("a"));
    a.id = "aMenu";

    a.addEventListener("click", () => {
        document.querySelector("#score").innerHTML = `Score: 0`;
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
    });


    const spanA = a.appendChild(document.createElement("span"));
    spanA.innerHTML = "X";
    spanA.id = "spanA";

    const divForm = menu.appendChild(document.createElement("div"));
    if(key === "saveScore"){
        menu.appendChild(document.createElement("span")).innerHTML = "Salve o seu score!";

        const inputName = divForm.appendChild(document.createElement("input"));
        inputName.type = "text";
        inputName.placeholder = "Digite o seu nome...";
        inputName.name = "userName";
        inputName.classList.add("inputName");

        inputName.addEventListener("input", () => {
            if(inputName.value.length >= 3 && inputName.value.length <= 10){
                button.disabled = true;
                button.style.backgroundColor = "black";
                button.style.color = "#8e0eff";

                const verifyName = async () => {
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

                verifyName();
            } else {
                button.disabled = true;
                button.style.backgroundColor = "black";
                button.style.color = "#8e0eff";
            }
        });

        const button = divForm.appendChild(document.createElement("Button"));
        button.innerHTML = "Salvar";
        button.name = "submitRanking";
        button.classList.add("buttonTryAgain");

        button.addEventListener("click", () => {
            button.disabled = true;
            localStorage.name = inputName.value;
            localStorage.score = this.score;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";
            fetch(BASE_URL + "/saveScore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userName: inputName.value, score:  this.score, position: positionBoard })
            })
                .then(response => {
                    if(response.status === 201){
                        return response.json();
                    } else {
                        return null;
                    }
                })
                .then(data => {
                    if(data){
                        localStorage.id = data._id;
                    }
                })
                .catch(err => console.error(err));
        });
    } else if(key === "updateScore"){
        fetch(BASE_URL + "/updateScore", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: localStorage.id, score:  this.score, position: positionBoard })
        }).then(response => response.status === 200 ? console.log("Deu certo") : console.log("F"));

        const button = divForm.appendChild(document.createElement("button"));
        button.innerHTML = "Try Again";
        button.name = "updateRanking";

        button.addEventListener("click", () => {
            document.querySelector("#score").innerHTML = `Score: 0`;
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
        });
    } else if(key === "lost"){
        const button = divForm.appendChild(document.createElement("button"));
        button.innerHTML = "Try Again";

        button.addEventListener("click", () => {
            document.querySelector("#score").innerHTML = `Score: 0`;
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
        });
    }
}

loadInfo();

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
        document.querySelector("#maxScore").innerHTML = `Melhor Score: ${maxScore[positionBoard]}`;
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
        document.querySelector("#score").innerHTML = `Score: ${this.score}`;
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

        function tryAgainF(target){
            if((target.key === " ") || (target.key === "Enter")){
                document.removeEventListener("keydown", tryAgainF);
                document.querySelector("#score").innerHTML = `Score: 0`;
                const food = document.querySelector(".food");
                food ? food.classList.remove("food") : null;

                document.querySelectorAll(".square").forEach(value => {
                    value.remove();
                });

                board.menu.remove();

                setTimeout(() => {
                    board = new Board(columnBoard, lineBoard);
                    board.build();
                }, 200);
            }
        }

        const verifyDB = async () => {
            if(localStorage.name){
                return false;
            }

            return true;
        };

        const waitVerify = async() => {
            const result = await verifyDB();

            if(result === true){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerHTML = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu.bind(this)(document.querySelector(".board").appendChild(document.createElement("div")), "Você perdeu", "saveScore");
            } else if(
                (maxScore[positionBoard] < this.score) &&
                (result === false)
            ){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerHTML = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu.bind(this)(document.querySelector(".board").appendChild(document.createElement("div")), "New Record!", "updateScore");
            } else {
                createMenu.bind(this)(document.querySelector(".board").appendChild(document.createElement("div")), "Você perdeu!", "lost");
            }
        };

        waitVerify();
    }

    win(){
        this.stop = true;
        clearInterval(this.setIntervalID);

        const verifyDB = async () => {
            if(localStorage.name){
                return false;
            }

            return true;
        };

        const waitVerify = async() => {
            const result = await verifyDB();

            if(result === true){
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerHTML = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu.bind(this)(document.querySelector(".board").appendChild(document.createElement("div")), "Você Venceu!", "saveScore");
            } else {
                maxScore[positionBoard] = this.score;
                localStorage.score = JSON.stringify(maxScore);
                document.querySelector("#maxScore").innerHTML = `Melhor Score: ${maxScore[positionBoard]}`;

                createMenu.bind(this)(document.querySelector(".board").appendChild(document.createElement("div")), "Você venceu!", "updateScore");
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
            document.querySelector("#attemps").innerHTML = `Tentativas: ${attemps}`;
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
                document.querySelector("#attemps").innerHTML = `Tentativas: ${attemps}`;
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

let board = new Board(columnBoard, lineBoard);

board.build();

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

    const menu = document.querySelector(".board").appendChild(document.createElement("div"));
    menu.classList.add("menu");

    const a = menu.appendChild(document.createElement("a"));
    a.id = "aMenu";
    a.href = "/";
    a.style.textDecoration = "none";
    a.style.color ="#8e0eff";

    const spanA = a.appendChild(document.createElement("span"));
    spanA.innerHTML = "X";
    spanA.id = "spanA";

    menu.appendChild(document.createElement("span")).innerHTML = "Mudar Nome";

    const form = menu.appendChild(document.createElement("form"));
    form.method = "POST";

    const inputName = form.appendChild(document.createElement("input"));
    inputName.type = "text";
    inputName.placeholder = "Digite o nome...";
    inputName.name = "userName";
    inputName.classList.add("inputName");
    inputName.focus();

    inputName.addEventListener("input", () => {
        if(inputName.value.length >= 3 && inputName.value.length <= 10){
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";

            const verifyName = async () => {
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

            verifyName();
        } else {
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";
        }
    });

    const button = form.appendChild(document.createElement("input"));
    button.type = "submit";
    button.value = "Salvar";
    button.name = "submitName";
    button.classList.add("buttonTryAgain");
    button.addEventListener("click", () => {
        button.disabled = true;
        form.action = `/updateName/${localStorage.name}/${inputName.value}`;
        localStorage.name = inputName.value;
        button.style.backgroundColor = "black";
        button.style.color = "#8e0eff";
        form.submit();
    });
};

const snakeColor = () => {
    const arrayColors = [
        "#8e0eff",
        "red",
        "#33ff00",
        "white",
        "blue",
        "#ff00bb"
    ];

    let positionColor = localStorage.positionColor || 0;

    const menuItens = document.querySelector("#menuItens");

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    const menu = document.querySelector(".board").appendChild(document.createElement("div"));
    menu.classList.add("menu");

    const spanA = menu.appendChild(document.createElement("span"));
    spanA.innerHTML = "X";
    spanA.id = "spanA";
    spanA.style.position = "absolute";
    spanA.style.top = "15px";
    spanA.style.right = "15px";
    spanA.onclick = () => menu.remove();

    menu.appendChild(document.createElement("span")).innerHTML = "Mudar Cor";

    const divChoiceColor = menu.appendChild(document.createElement("div"));
    divChoiceColor.classList.add("divChoiceColor");

    const buttonLeftColor = divChoiceColor.appendChild(document.createElement("button"));
    buttonLeftColor.innerHTML = "<-";
    buttonLeftColor.classList.add("buttonChoiceColor");

    const colorExample = divChoiceColor.appendChild(document.createElement("div"));
    colorExample.classList.add("colorExample");
    colorExample.style.backgroundColor = arrayColors[positionColor];

    const buttonRightColor = divChoiceColor.appendChild(document.createElement("button"));
    buttonRightColor.innerHTML = "->";
    buttonRightColor.classList.add("buttonChoiceColor");

    const buttonSave = menu.appendChild(document.createElement("button"));
    buttonSave.innerHTML = "Salvar";
    buttonSave.classList.add("buttonTryAgain");

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


    buttonSave.onclick = () => {
        localStorage.positionColor = positionColor;
        localStorage.snakeColor = arrayColors[positionColor];
        document.documentElement.style.setProperty("--snakeColor", arrayColors[positionColor]);

        menu.remove();
    };
};

const createAccount = () => {
    if(localStorage.name){
        return alert(`Este é o seu nome: ${localStorage.name}`);
    }

    board.stop = true;
    const menuItens = document.querySelector("#menuItens");

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    const menu = document.querySelector(".board").appendChild(document.createElement("div"));
    menu.classList.add("menu");

    const a = menu.appendChild(document.createElement("a"));
    a.id = "aMenu";
    a.href = "/";
    a.style.textDecoration = "none";
    a.style.color ="#8e0eff";

    const spanA = a.appendChild(document.createElement("span"));
    spanA.innerHTML = "X";
    spanA.id = "spanA";

    menu.appendChild(document.createElement("span")).innerHTML = "Cadastrar User";

    const form = menu.appendChild(document.createElement("form"));
    form.method = "POST";
    form.action = `/saveScore`;

    const inputScore = form.appendChild(document.createElement("input"));
    inputScore.name = "score";
    inputScore.value = localStorage.score || 0;
    inputScore.style.display = "none";

    const inputName = form.appendChild(document.createElement("input"));
    inputName.type = "text";
    inputName.placeholder = "Digite o nome...";
    inputName.name = "userName";
    inputName.classList.add("inputName");
    inputName.focus();

    inputName.addEventListener("input", () => {
        if(inputName.value.length >= 3 && inputName.value.length <= 10){
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";

            const verifyName = async () => {
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

            verifyName();
        } else {
            button.disabled = true;
            button.style.backgroundColor = "black";
            button.style.color = "#8e0eff";
        }
    });

    const button = form.appendChild(document.createElement("input"));
    button.type = "submit";
    button.value = "Salvar";
    button.name = "submitRanking";
    button.classList.add("buttonTryAgain");

    button.addEventListener("click", () => {
        button.disabled = true;
        localStorage.name = inputName.value;
        button.style.backgroundColor = "black";
        button.style.color = "#8e0eff";
        form.submit();
    });
};
const getBoard = () => {
    const arrayBoard = [
        [6, 6, "Easy"],
        [10, 10, "Normal"],
        [15, 15, "Hard"]
    ];

    let positionBoard = localStorage.positionBoard || 1;

    const menuItens = document.querySelector("#menuItens");

    menuItens.style.display = "none";
    document.querySelector("#menuHamburguerSpan").style.color = "black";

    const menu = document.querySelector(".board").appendChild(document.createElement("div"));
    menu.classList.add("menu");

    const spanA = menu.appendChild(document.createElement("span"));
    spanA.innerHTML = "X";
    spanA.id = "spanA";
    spanA.style.position = "absolute";
    spanA.style.top = "15px";
    spanA.style.right = "15px";
    spanA.onclick = () => menu.remove();

    menu.appendChild(document.createElement("span")).innerHTML = "Mudar Tamanho";

    const divChoiceBoard = menu.appendChild(document.createElement("div"));
    divChoiceBoard.classList.add("divChoiceBoard");

    const buttonLeftBoard = divChoiceBoard.appendChild(document.createElement("button"));
    buttonLeftBoard.innerHTML = "<-";
    buttonLeftBoard.classList.add("buttonChoiceBoard");

    const boardHW = divChoiceBoard.appendChild(document.createElement("div"));
    boardHW.classList.add("boardHW");
    const spanBoard = boardHW.appendChild(document.createElement("span"));
    spanBoard.innerHTML = arrayBoard[positionBoard][2];
    spanBoard.id = "spanBoard";

    const buttonRightBoard = divChoiceBoard.appendChild(document.createElement("button"));
    buttonRightBoard.innerHTML = "->";
    buttonRightBoard.classList.add("buttonChoiceBoard");

    const buttonSave = menu.appendChild(document.createElement("button"));
    buttonSave.innerHTML = "Salvar";
    buttonSave.classList.add("buttonTryAgain");

    buttonLeftBoard.onclick = () => {
        if(positionBoard != 0){
            positionBoard--;
        } else {
            positionBoard = arrayBoard.length - 1;
        }

        spanBoard.innerHTML = arrayBoard[positionBoard][2];
    };

    buttonRightBoard.onclick = () => {
        if(positionBoard != arrayBoard.length - 1){
            positionBoard++;
        } else {
            positionBoard = 0;
        }

        spanBoard.innerHTML = arrayBoard[positionBoard][2];
    };


    buttonSave.onclick = () => {
        localStorage.positionBoard = positionBoard;
        localStorage.boardHeight = arrayBoard[positionBoard][0];
        localStorage.boardWidth = arrayBoard[positionBoard][1];

        window.location.href = "/";
    };
};