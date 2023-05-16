const Ranking = require("../models/schema");

const renderPage = (_req, res) => {
    return res.redirect(process.env.BASE_URL);
};

const renderRanking = (_req, res) => {
    return res.redirect(process.env.BASE_URL + "/pages/ranking.html");
};

const getData = async (req, res) => {
    try {
        const listRanking = await Ranking.find().sort({ scores: -1 }).limit(10);
        const users = listRanking.map(user => ({ userName: user.userName, scores: user.scores[req.params.position] }));
        return res.status(200).json({ listRanking: users });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const getAllData = async (_req, res) => {
    try {
        const rankingList = await Ranking.find().sort({ score: -1 });
        const users = rankingList.map(user => ({ userName: user.userName, scores: user.scores }));
        return res.status(200).json(users);
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const saveScore = async (req, res) => {
    const dataRanking = req.dataRanking;

    /*const listDelete = await Ranking.find().sort({ score: -1 }).skip(10);

    listDelete.forEach(async (element) => {
        await Ranking.deleteOne({ _id: element._id });
        console.log(element.userName, "excluido do top 10");
    });*/

    try{
        const savedRanking = await Ranking.create(dataRanking);
        return res.status(201).json({ message: "created", id: savedRanking._id });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const updateScore = async (req, res) => {
    const { position, score, id } = req.body;

    if(position > 2){
        return res.status(400).send();
    }

    const rankingFind = await Ranking.findOne({ _id: id });

    const newScore = rankingFind.scores.map((element, indice) => {
        if(indice === position) {
            return score;
        } else {
            return element;
        }
    });

    try {
        await Ranking.updateOne({ _id: id }, { scores: newScore });
        return res.status(200).json({ message: "updated" });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const updateName = async (req, res) => {
    const dataRanking = await Ranking.findOne({ userName: req.params.userName });
    try {
        await Ranking.updateOne({ _id: dataRanking._id }, { userName: req.params.newUserName });
        return res.status(200).json({ message: "updated" });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

module.exports = {
    renderPage,
    renderRanking,
    getData,
    saveScore,
    updateScore,
    updateName,
    getAllData
};