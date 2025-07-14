/** Declaration types of all the database schemas */
import {Document} from "mongoose"


interface ChatGroupSchema extends Document {
    groupName: string
    groupId: string // randomly generated
    admin: UserSchema
    members: UserSchema[]
}

interface UserSchema {
    fullName: string
    username: string
    email: string
    password?: string
    groups: Array<ChatGroupSchema>
    refreshToken?: string
}

interface UserMethods {
    // functions
    generateRefreshToken: () => string
    generateAccessToken: () => string
}

type UserDocument = Document & UserSchema & UserMethods
