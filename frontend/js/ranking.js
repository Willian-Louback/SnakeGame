document.addEventListener("DOMContentLoaded", async () => {
    const BASE_URL = "https://snakegamewillianbackend.up.railway.app";
    const titleButton = document.querySelector(".titleButton");
    const changePosition = localStorage.changePosition || 1;
    localStorage.changeMode ? titleButton.innerHTML = `${localStorage.changeMode}<i class="bi bi-chevron-compact-down iconChoice" style="font-size: 17px;">` : titleButton.innerHTML = "Normal <i class=\"bi bi-chevron-compact-down iconChoice\" style=\"font-size: 17px;\">";
    const reponse = await fetch(BASE_URL + `/getData/${changePosition}`);
    const data = await reponse.json();
    const rankingUl =  document.querySelector(".rankingUl");

    const renderList = () => {
        let j = 0;

        function createLi(i) {
            j++;

            const rankingLi = rankingUl.appendChild(document.createElement("li"));
            rankingLi.classList.add("list");
            i % 2 === 0 ? rankingLi.classList.add("black") : rankingLi.classList.add("gray");
            i === 0 ? rankingLi.classList.add("fixListFirst") : (i === 9) ? rankingLi.classList.add("fixListLast") : null;
            const spanName = rankingLi.appendChild(document.createElement("span"));
            spanName.classList.add("infoRanking");
            const spanScore = rankingLi.appendChild(document.createElement("span"));
            spanScore.classList.add("infoRanking");

            if(data.listRanking[i].scores !== 0 && data.listRanking[i].scores){
                return { spanName, spanScore };
            }
        }

        for(let i = 0; i < 10; i++){
            if(data.listRanking[i].scores !== 0 && data.listRanking[i].scores){
                const { spanName, spanScore } = createLi(i);

                i === 0 ? spanName.innerHTML = `<i class="bi bi-trophy first"></i> ${data.listRanking[i].userName}`
                    : (i === 1) ? spanName.innerHTML = `<i class="bi bi-trophy second"></i> ${data.listRanking[i].userName}`
                        : (i === 2) ? spanName.innerHTML = `<i class="bi bi-trophy third"></i> ${data.listRanking[i].userName}`
                            : spanName.innerHTML = ` ${data.listRanking[i].userName}`;

                spanScore.innerHTML = `Score: ${data.listRanking[i].scores}`;
            }
        }

        if(j < 10){
            for(let i = (j + 1); i < 10; i++){
                createLi(i);
            }
        }
    };

    renderList();
});

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

const choiceRanking = () => {
    const containerButtonChoice = document.querySelector(".container-buttonChoice");
    const iconChoice = document.querySelector(".iconChoice");

    if(containerButtonChoice.dataset.isTrue){
        iconChoice.classList.remove("bi-chevron-compact-up");
        iconChoice.classList.add("bi-chevron-compact-down");
        delete containerButtonChoice.dataset.isTrue;
        document.querySelector(".menuChoice").remove();
        return;
    }

    containerButtonChoice.dataset.isTrue = true;

    iconChoice.classList.remove("bi-chevron-compact-down");
    iconChoice.classList.add("bi-chevron-compact-up");

    const menu = containerButtonChoice.appendChild(document.createElement("ul"));
    menu.classList.add("menuChoice");
    const easy = menu.appendChild(document.createElement("li"));
    easy.innerHTML = "Easy";
    easy.classList.add("liMenuChoice", "gray");
    const normal = menu.appendChild(document.createElement("li"));
    normal.innerHTML = "Normal";
    normal.classList.add("liMenuChoice", "black");
    const hard = menu.appendChild(document.createElement("li"));
    hard.innerHTML = "Hard";
    hard.classList.add("liMenuChoice", "gray", "fixLastHard");

    easy.onclick = () => {
        localStorage.changeMode = "Easy ";
        localStorage.changePosition = 0;
        window.location.href = "/pages/ranking";
        return;
    };

    normal.onclick = () => {
        localStorage.changeMode = "Normal ";
        localStorage.changePosition = 1;
        window.location.href = "/pages/ranking";
        return;
    };

    hard.onclick = () => {
        localStorage.changeMode = "Hard ";
        localStorage.changePosition = 2;
        window.location.href = "/pages/ranking";
        return;
    };
};