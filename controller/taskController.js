const path = require("path");
const Ranking = require("../models/schema");

const renderPage = (req, res) => {
    return res.sendFile(path.join(__dirname, "../public", "pages", "index.html"));
};

const renderRanking = (req, res) => {
    return res.sendFile(path.join(__dirname, "../public", "pages", "ranking.html"));
};

const getData = async (req, res) => {
    try {
        const listRanking = await Ranking.find().sort({ score: -1 }).limit(10);
        return res.json({ listRanking });
    } catch(error) {
        res.status(500).send({error: error.message});
    }
};

const saveScore = async (req, res) => {
    const dataRanking = req.body;

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

module.exports = {
    renderPage,
    renderRanking,
    getData,
    saveScore
};