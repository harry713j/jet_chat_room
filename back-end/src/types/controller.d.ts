import { UserDocument } from "./schema.js"


type SignupRequest = {
    fullName: string
    username: string
    email: string
    password: string
}

type LoginRequest = {
    identifier: string // username or email
    password: string
}

type ChatgroupCreateRequest = {
    groupName: string
    members: Array<UserDocument> | []
}