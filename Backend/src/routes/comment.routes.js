import {Router} from "express"
import {createComment,getPostComments,deleteComment} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/post/:id")
    .post(verifyJWT,createComment)
    .get(getPostComments)

router.route("/:id")
    .delete(verifyJWT,deleteComment)

export default router
