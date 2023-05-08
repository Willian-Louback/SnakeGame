const TaskController = require("../controller/taskController");
const routes = require("express").Router();

routes.get("/", TaskController.renderPage);
routes.get("/ranking", TaskController.renderRanking);
routes.get("/getData", TaskController.getData);
routes.post("/saveScore", TaskController.saveScore);

module.exports = routes;