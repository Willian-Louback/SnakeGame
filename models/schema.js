const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
}, { collection: "Ranking" });

module.exports = mongoose.model("Ranking", taskSchema);

/*const Ranking = mongoose.model("Ranking", taskSchema);

const add = new Ranking({
    score: 100,
    userName: "Joel3"
});

add.save()
    .then(() => console.log("Salvo com sucesso"))
    .catch((err) => console.error(err));*/