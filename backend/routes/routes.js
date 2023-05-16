const TaskController = require("../controller/taskController");
const MiddlewareController = require("../middleware/middlewareController");
const routes = require("express").Router();

routes.get("/", TaskController.renderPage);
routes.get("/ranking", TaskController.renderRanking);
routes.get("/getData/:position", TaskController.getData);
routes.get("/getAllData", TaskController.getAllData);
routes.post("/saveScore", MiddlewareController.verifyName, MiddlewareController.saveScore, TaskController.saveScore);
routes.patch("/updateScore", TaskController.updateScore);
routes.patch("/updateName/:userName/:newUserName", MiddlewareController.verifyName, TaskController.updateName);

module.exports = routes;