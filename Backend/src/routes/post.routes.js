import {Router} from "express"
import {createPost,getAllPost,postById,updatePost,deletePost,toggleLike} from "../controllers/post.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/").post(verifyJWT,createPost).get(getAllPost)
router.route("/:id").get(postById).put(verifyJWT,updatePost).delete(verifyJWT, deletePost);
router.route("/:id/like").post(verifyJWT, toggleLike);



export default router;