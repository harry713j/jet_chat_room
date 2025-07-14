

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