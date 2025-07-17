import {Chatgroup} from "../models/chatgroup.model.js"
import { Request, Response } from "express";
import { serverLogger } from "../utils/logger.js";
import { ChatgroupCreateRequest } from "../types/controller.js";
import { User } from "../models/user.model.js";
import {randomUUID} from "crypto"
import { UserDocument } from "../types/schema.js";


export async function createChatgroup(req:Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const {groupName, members}: ChatgroupCreateRequest = req.body

        // if no group name is passed , client side will pass empty array of members or array of members
        if (!groupName) {
            res.status(400).json({
                message: "Group name is required"
            })
        }

        // if group with same name does exist
        const existedGroup = await Chatgroup.findOne({
            groupName: groupName
        })

        if(existedGroup){
            res.status(400).json({
                message: "Group with same name already exists"
            })
        }

        const groupId = randomUUID()

        const createdChatgroup = await Chatgroup.create({
            groupName: groupName,
            groupId: groupId,
            admin: user,
            members: members,
        })

        res.status(201).json({
            message: "Chat group created successfully",
            group: createdChatgroup
        })
    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while creating the chat group"
        })
    }
}

export async function startDirectChat(req: Request, res: Response) {
    try {
        const senderId = req.user?.id
        const recieverId = req.body?.recieverId

        if (!recieverId) {
            res.status(401).json({
                message: "reciever id is required"
            })
            return
        }

        // check if the chat is already exists
        const existingChat = await Chatgroup.findOne({
            isGroup: false,
            members: {$all: [senderId, recieverId], $size: 2}
        })

        if (existingChat) {
            res.status(200).json({
                message: "Chat already exists",
                group: existingChat
            })
        }

        const sender = await User.findById(senderId)
        const reciever = await User.findById(recieverId)

        if (!reciever || !sender) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        const newChat = await Chatgroup.create({
            isGroup: false,
            groupName: `${sender.username}-${reciever.username}`,
            groupId: randomUUID(),
            members: [sender._id, reciever._id]
        })

        res.status(201).json({
            message: "New chat is created",
            group: newChat
        })
    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while starting the chat"
        })
    }
}

export async function getChatgroup(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const {groupId} = req.params

        if(!groupId){
            res.status(400).json({
                message: "Group id is required for get the chat group"
            })
            return
        }

        const chatgroup = await Chatgroup.findOne({groupId: groupId})
        .populate("admin", "fullName username onlineStatus")
        .populate("members", "fullName username onlineStatus")

        res.status(200).json({
            message: "Chatgroup details fetched successfully",
            group: chatgroup
        })

    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while getting the chat group"
        })
    }
}

export async function addMembers(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const {members}: {members: [] | UserDocument[]} = req.body
        const groupId = req.params?.groupId

        if (!groupId || members.length == 0) {
            res.status(400).json({
                message: "All the fields are required"
            })
            return
        }

        const chatgroup = await Chatgroup.findOne({
            groupId: groupId
        })

        if (!chatgroup) {
            res.status(404).json({
                message: `Chat group does not exists`
            })
            return
        }

        // check if the current user is the admin or not
        if (chatgroup.admin._id != user._id) {
            res.status(401).json({
                message: "You are not authorized to add any members"
            })
        }

        chatgroup.members.push(...members)
        const group = await chatgroup.save({validateBeforeSave: false})

        res.status(201).json({
            message: "Memebers added successfully",
            group: group
        })

    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while adding memebers to the group"
        })
    }
}

export async function removeMembers(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const {username}: {username: string} = req.body
        const groupId = req.params?.groupId

        if (!groupId || !username) {
            res.status(400).json({
                message: "Group name and user name are required"
            })
            return
        }

        const chatgroup = await Chatgroup.findOne({
            groupId: groupId
        })

        if (!chatgroup) {
            res.status(404).json({
                message: `Chat group does not exists`
            })
            return
        }

        // check if the current user is the admin or not
        if (chatgroup.admin._id != user._id) {
            res.status(401).json({
                message: "You are not authorized to remove any members"
            })
        }

        chatgroup.members = chatgroup.members.filter((member) => member.username !== username)

        const group = await chatgroup.save({validateBeforeSave: false})

        res.status(200).json({
            message: "Member removed successfully",
            group: group
        })

    } catch (error) {
         const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while removing memebers from the group"
        })
    }
}

export async function updateChatgroupName(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const {newGroupName}: {newGroupName: string} = req.body
        const groupId = req.params?.groupId

        if(!groupId || !newGroupName){
            res.status(400).json({
                message: "All the fields are required for changing the chat group name"
            })
            return
        }

        const chatgroup = await Chatgroup.findOne({
            groupId: groupId
        })

        if (!chatgroup) {
            res.status(404).json({
                message: `Chat group does not exists`
            })
            return
        }

        // check if the current user is the admin or not
        if (chatgroup.admin._id != user._id) {
            res.status(401).json({
                message: "You are not authorized to change group name"
            })
        }

        chatgroup.groupName = newGroupName
        const group = await chatgroup.save({validateBeforeSave: false})

        res.status(201).json({
            message: "Chat group name changed successfully",
            group: group
        })

    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while updating the chat group name"
        })
    }
}

export async function deleteChatgroup(req: Request, res: Response) {
    try {
        const user = await User.findById(req.user?._id)

        if (!user) {
            res.status(401).json({
                message: "Unauthorized request"
            })
            return
        }

        const groupId = req.params?.groupId

        if(!groupId){
            res.status(400).json({
                message: "All the fields are required for deleting the chat group name"
            })
            return
        }

        const chatgroup = await Chatgroup.findOne({
            groupId: groupId
        })

        if (!chatgroup) {
            res.status(404).json({
                message: `Chat group does not exists`
            })
            return
        }

        // check if the current user is the admin or not
        if (chatgroup.admin._id != user._id) {
            res.status(401).json({
                message: "You are not authorized to remove chat group"
            })
        }

        await Chatgroup.deleteOne({
            groupId: groupId
        })

        res.status(200).json({
            message: "Chat group deleted successfully"
        })

    } catch (error) {
        const err = error as Error
        serverLogger(err)
        res.status(500).json({
            messsage: "Something went wrong while deleting the chat group name"
        })
    }
} 
