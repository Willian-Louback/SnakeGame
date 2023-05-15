const Ranking = require("../models/schema");

const saveScore = async (req, res, next) => {
    const dataRanking = req.body;

    if(dataRanking.scores.length !== 3) {
        return res.status(400).json({ message: "informações erradas." });
    }

    if(!dataRanking.userName){
        return res.status(400).json({ message: "Está faltando informações." });
    } else if(dataRanking.userName == "") {
        return res.status(204).json({ message: "Conteúdo vazio." });
    }

    for(let i = 0; i < 3; i++){
        if(!dataRanking.scores[i]){
            return res.status(400).json({ message: "Está faltando informações." });
        } else if(isNaN(dataRanking.scores[i])){
            return res.status(400).json({ message: "Is NaN." });
        }
    }

    next();
};

const verifyName = async (req, res, next) => {
    const { userName } = req.body;
    const newUserName = req.params.newUserName || userName;

    const verify = await Ranking.findOne({ userName: newUserName });

    if(verify){
        return res.status(409).json({ message: "Nome já cadastrado." });
    }

    next();
};
module.exports = {
    saveScore,
    verifyName
};