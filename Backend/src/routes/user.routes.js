import {Router} from "express"
import {toggleFollow,getUserProfile} from "../controllers/user.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:id").get(getUserProfile)
router.route("/:id/follow").post(verifyJWT,toggleFollow)

export default router
