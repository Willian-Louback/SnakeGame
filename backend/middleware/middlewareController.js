const Ranking = require("../models/schema");

const verifyName = async (req, res, next) => {
    const { userName } = req.body;
    const newUserName = req.params.newUserName || userName;

    const verify = await Ranking.findOne({ userName: newUserName });

    if(verify){
        return res.status(409).json({ message: "Nome já cadastrado." });
    }

    next();
};

const saveScore = async (req, res, next) => {
    const { userName, position, score } = req.body;
    const scores = [];

    if(!userName || !position || !score){
        return res.status(400).json({ message: "Está faltando informações." });
    } else if(userName == "" || position == "" || score == "") {
        return res.status(204).json({ message: "Conteúdo vazio." });
    }

    if(isNaN(score) || isNaN(position)){
        return res.status(400).json({ message: "Is NaN." });
    }

    if(position > 2) {
        return res.status(400).json({ message: "Informações erradas." });
    }

    for(let i = 0; i < 3; i++){
        if(i == position){
            scores.push(score);
        } else {
            scores.push(0);
        }
    }

    req.dataRanking = { userName: userName, scores: scores };

    next();
};

module.exports = {
    saveScore,
    verifyName
};