import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT
const ALLOWED_CLIENT = process.env.ALLOWED_ORIGIN


export {
    PORT, ALLOWED_CLIENT
}