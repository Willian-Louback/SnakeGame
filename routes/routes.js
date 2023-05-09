const TaskController = require("../controller/taskController");
const routes = require("express").Router();

routes.get("/", TaskController.renderPage);
routes.get("/ranking", TaskController.renderRanking);
routes.get("/getData", TaskController.getData);
routes.post("/saveScore", TaskController.saveScore);
routes.post("/updateScore/:userName/:score", TaskController.updateScore);

module.exports = routes;