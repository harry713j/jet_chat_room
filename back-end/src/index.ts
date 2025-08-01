import { httpServer } from "./app.js";
import { PORT } from "./constants.js";
import { connectDB } from "./db/index.js";

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("🚀 Server started on port ", PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to Database: ", err);
    process.exit(1);
  });
