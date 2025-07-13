/** Declaration types of all the database schemas */
import {Document} from "mongoose"


interface ChatGroupSchema extends Document {
    groupName: string
    groupId: string // randomly generated
    admin: UserSchema
    members: UserSchema[]
}

interface UserSchema extends Document {
    fullName: string
    username: string
    email: string
    password?: string
    groups: Array<ChatGroupSchema>
    refreshToken?: string
}