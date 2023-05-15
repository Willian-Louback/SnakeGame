const mongoose = require("mongoose");

const connectToDb = () => {
    mongoose.connect(
        process.env.KEY_DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => console.log("_MongoDB Atlas_\nServidor: SN4K3."))
        .catch((err) => console.error(err));
};

module.exports = connectToDb;