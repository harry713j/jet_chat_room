import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createChatgroup,
  addMembers,
  deleteChatgroup,
  removeMembers,
  updateChatgroupName,
  startDirectChat,
  getChatgroupByGroupId,
} from "../controller/chatgroup.controller.js";

const router = express.Router();

router.route("/create-group").post(verifyToken, createChatgroup);
router.route("/direct-chat").post(verifyToken, startDirectChat);
router.route("/:groupId").get(verifyToken, getChatgroupByGroupId);
router.route("/:groupId/add-members").patch(verifyToken, addMembers);
router
  .route("/:groupId/change-group-name")
  .patch(verifyToken, updateChatgroupName);
router.route("/:groupId/remove-member").patch(verifyToken, removeMembers);
router.route("/:groupId/delete-group").delete(verifyToken, deleteChatgroup);

export default router;
