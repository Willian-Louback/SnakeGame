document.addEventListener("DOMContentLoaded", async () => {
    const reponse = await fetch("/getData");
    const data = await reponse.json();
    const rankingUl =  document.querySelector(".rankingUl");

    const renderList = () => {
        for(let i = 0; i < 10; i++){
            const rankingLi = rankingUl.appendChild(document.createElement("li"));
            rankingLi.classList.add("list");
            i % 2 === 0 ? rankingLi.classList.add("black") : rankingLi.classList.add("gray");
            i === 0 ? rankingLi.classList.add("fixListFirst") : (i === 9) ? rankingLi.classList.add("fixListLast") : null;
            const spanName = rankingLi.appendChild(document.createElement("span"));
            spanName.classList.add("infoRanking");
            const spanScore = rankingLi.appendChild(document.createElement("span"));
            spanScore.classList.add("infoRanking");
            if(data.listRanking[i]){
                i === 0 ? spanName.innerHTML = `<i class="bi bi-trophy first"></i> ${data.listRanking[i].userName}`
                    : (i === 1) ? spanName.innerHTML = `<i class="bi bi-trophy second"></i> ${data.listRanking[i].userName}`
                        : (i === 2) ? spanName.innerHTML = `<i class="bi bi-trophy third"></i> ${data.listRanking[i].userName}`
                            : spanName.innerHTML = ` ${data.listRanking[i].userName}`;

                spanScore.innerHTML = `Score: ${data.listRanking[i].score}`;
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