const TaskController = require("../controller/taskController");
const routes = require("express").Router();

routes.get("/", TaskController.renderPage);
routes.get("/ranking", TaskController.renderRanking);
routes.get("/getData/:position", TaskController.getData);
routes.get("/getAllData", TaskController.getAllData);
routes.post("/saveScore", TaskController.saveScore);
routes.post("/updateScore/:userName/:score/:position", TaskController.updateScore);
routes.post("/updateName/:userName/:newUserName", TaskController.updateName);

module.exports = routes;