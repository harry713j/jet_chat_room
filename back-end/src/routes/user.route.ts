import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import {registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, refreshAccessToken,
     updateUserEmail, updateUserFullName} from "../controller/user.controller.js"


const router = express.Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyToken, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyToken, changeCurrentPassword)
router.route("/current-user").get(verifyToken, getCurrentUser)
router.route("/change-email").patch(verifyToken, updateUserEmail)
router.route("/change-name").patch(verifyToken, updateUserFullName)


export default router