import {Request, Response} from "express"
import { Message } from "../models/messages.model.js"
import { serverLogger } from "../utils/logger.js"
import { User } from "../models/user.model.js"


export async function getMessages(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?.id)

        if(!user){
            res.status(401).json({
                message: "Unauthorized access"
            })
            return
        }

        const {groupId} = req.params
        const page = parseInt(req.query?.page as string || "1")
        const limit = parseInt(req.query?.limit as string || "20")

        if (!groupId) {
            res.status(400).json({
                message: "Group id is required"
            })
            return
        }

        if (page <= 0 || limit <= 0) {
            res.status(400).json({
                message: "Page number or message limit can't be less than 1"
            })
            return
        }

        const messages = await Message.find({chatgroupId: groupId})
        .sort({creaetdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "fullName username")

        res.status(200).json({
            message: "Messages fetched successfully",
            messages: messages
        })

    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            message: "Something went wrong while getting the messages "
        })
    }
}