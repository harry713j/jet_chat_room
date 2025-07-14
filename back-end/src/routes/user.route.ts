import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js"
import {registerUser, loginUser, logoutUser} from "../controller/user.controller.js"

const router = express.Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyToken, logoutUser)


export default router