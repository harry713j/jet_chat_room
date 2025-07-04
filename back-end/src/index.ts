import express from "express";

const PORT = 4000

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Server")
})


app.listen(PORT, () => {
    console.log("Server started on Port ", PORT)
})