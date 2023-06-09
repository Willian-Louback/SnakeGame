const path = require("path");
const Ranking = require("../models/schema");

const renderPage = (_req, res) => {
    return res.sendFile(path.join(__dirname, "../public", "pages", "index.html"));
};

const renderRanking = (_req, res) => {
    return res.sendFile(path.join(__dirname, "../public", "pages", "ranking.html"));
};

const getData = async (_req, res) => {
    try {
        const listRanking = await Ranking.find().sort({ score: -1 }).limit(10);
        return res.json({ listRanking });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const getAllData = async (_req, res) => {
    try {
        const listRanking = await Ranking.find().sort({ score: -1 });
        return res.json({ listRanking });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const saveScore = async (req, res) => {
    const dataRanking = req.body;
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
        return res.redirect("/");
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const updateScore = async (req, res) => {
    const dataRanking = await Ranking.findOne({ userName: req.params.userName });
    try {
        await Ranking.updateOne({ _id: dataRanking._id }, { score: req.params.score });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const updateName = async (req, res) => {
    const dataRanking = await Ranking.findOne({ userName: req.params.userName });
    try {
        await Ranking.updateOne({ _id: dataRanking._id }, { userName: req.params.newUserName });
        return res.redirect("/");
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