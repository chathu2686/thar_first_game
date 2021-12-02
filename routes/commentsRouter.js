const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments-controller");

commentsRouter.route("/:id").delete(deleteCommentById);

module.exports = commentsRouter;
