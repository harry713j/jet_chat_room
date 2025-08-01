import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const ALLOWED_CLIENT = process.env.ALLOWED_ORIGIN;
const DB_NAME = "jet-room";

export { PORT, ALLOWED_CLIENT, DB_NAME };
