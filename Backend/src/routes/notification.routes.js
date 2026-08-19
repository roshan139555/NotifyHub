import {Router} from "express"
import {getNotifications,markNotificationAsRead,markAllNotificationsAsRead} from "../controllers/notification.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").get(verifyJWT,getNotifications)
router.route("/:id/read").patch(verifyJWT,markNotificationAsRead)
router.route("/read-all").patch(verifyJWT,markAllNotificationsAsRead)

export default router
