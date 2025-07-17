import express from "express";
import {getMessages} from "../controller/message.controller.js"
import {verifyToken} from "../middleware/auth.middleware.js"

const router = express.Router()

router.route("/:groupId").get(verifyToken, getMessages)

export default router