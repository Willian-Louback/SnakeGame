const TaskController = require("../controller/taskController");
const routes = require("express").Router();

routes.get("/", TaskController.renderPage);
routes.get("/ranking", TaskController.renderRanking);
routes.get("/getData", TaskController.getData);
routes.get("/getAllData", TaskController.getAllData);
routes.post("/saveScore", TaskController.saveScore);
routes.post("/updateScore/:userName/:score", TaskController.updateScore);
routes.post("/updateName/:userName/:newUserName", TaskController.updateName);

module.exports = routes;