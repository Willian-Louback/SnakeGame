const Ranking = require("../models/schema");

const renderPage = (_req, res) => {
    return res.redirect(process.env.BASE_URL + "/index.html");
};

const renderRanking = (_req, res) => {
    return res.redirect(process.env.BASE_URL + "/pages/ranking.html");
};

const getData = async (req, res) => {
    try {
        const listRanking = await Ranking.find().sort({ [`scores${[req.params.position]}`]: -1 }).limit(10); //Cpmsertar aqui
        const users = listRanking.map(user => ({ userName: user.userName, scores: user.scores }));
        return res.status(200).json(users);
    } catch(error) {
        res.status(500).send({error: error.message});
    }
}; //Consertar aqui

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
    const dataRanking = req.body;
    console.log(dataRanking);
    /*const listDelete = await Ranking.find().sort({ score: -1 }).skip(10);

    listDelete.forEach(async (element) => {
        await Ranking.deleteOne({ _id: element._id });
        console.log(element.userName, "excluido do top 10");
    });*/

    if(!dataRanking.userName){
        return res.redirect("/");
    }

    try{
        await Ranking.create(dataRanking);
        return res.status(201).json({ message: "created" });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const updateScore = async (req, res) => {
    const position = req.params.position;

    const dataRanking = await Ranking.findOne({ userName: req.params.userName });
    try {
        await Ranking.updateOne({ _id: dataRanking._id }, { [`score${position}`]: req.params.score });
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