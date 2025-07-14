import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { serverLogger } from "../utils/logger.js";
import bcrypt from "bcrypt"
import { Types } from "mongoose";



export async function registerUser(req: Request, res: Response) {
   try {
     const {fullName, username, email, password}: SignupRequest = req.body
 
     // if something is missing
     if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
         res.status(400).json({
             message: "All fields are required"
         })
     }
 
     // check of existance
     const existedUser = await User.findOne({
         $or: [{username}, {email}]
     })
 
     if (existedUser) {
         res.status(400).json({
             message: "User with this email or username already exists"
         })
     }

     // hashed the password
     const hashedPassword = await bcrypt.hash(password, 10)
 
     // register the user in db
     const user = await User.create({
         fullName: fullName, username: username, email: email, password: hashedPassword, 
         groups: [],
     })
 
     const createdUser = await User.findById(user._id).select("-password -refreshToken")
 
     if(!createdUser){
          res.status(500).json({
             message: "Failed creating the user"
         })
     }

     res.status(201).json({
        message: "User created successfully",
        user: createdUser
     })
   } catch (error) {
        serverLogger(error as Error)
         res.status(500).json({
            message: "Something went wrong"
        })
   }

}

export async function loginUser(req: Request, res: Response) {
    try {
        const {identifier, password}: LoginRequest = req.body

        // if something is missing
     if (!identifier.trim() || !password.trim()) {
          res.status(400).json({
             message: "All fields are required"
         })
     }

     // check of existance
     const existedUser = await User.findOne({
         $or: [{username: identifier}, {email: identifier}]
     })
     
     if (!existedUser) {
         res.status(404).json({
            message: "User not found"
        })
     }

     // check the password
     const isPasswordValid = await bcrypt.compare(password, existedUser?.password!)

     if (!isPasswordValid) {
         res.status(401).json({
            message: "Password Incorrect"
        })
     }

     // generate refresh and access token and assign 
     const tokens = await generateTokens(res, existedUser?._id as Types.ObjectId)

     if (typeof tokens === "string") {
        res.status(500).json({
            message: tokens
        })
        return
     }
     
     const {accessToken, refreshToken} = tokens

     // assign the tokens
     const options = {
        httpOnly: true,
        secure: true
     }

          res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Successfully login the user"
            })

    } catch (error) {
        serverLogger(error as Error)
         res.status(500).json({
            message: "Something went wrong while login"
        })
    }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        await User.findByIdAndUpdate(req.user?._id, {
            $unset: {
                refreshToken: 1
            }
        }, {new: true})

        const options = {
            httpOnly: true,
        secure: true
        }

        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                message: "Successfully log out the user"
            })
    } catch (error) {
        serverLogger(error as Error)
         res.status(500).json({
            message: "Something went wrong while logout"
        })
    }
}

async function generateTokens(res: Response, userId: Types.ObjectId): Promise<string | {accessToken: string, refreshToken: string}> {
    try {
        const user = await User.findById(userId)

        if(!user){
            return "Failed to find the user"
        }

        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {
            refreshToken, accessToken
        }
    } catch (error) {
        serverLogger(error as Error)
        return "Something went wrong while generating the tokens"
    }
}

