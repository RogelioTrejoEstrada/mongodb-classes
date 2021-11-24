import express from "express";

const app = express();

app.get("/", function (req, res) {
    res.send("Hola mundo!!!");
});

app.get("/hola", function (req, res) {
    res.json({
        message: "hola mundo desde json!"
    });
});

export default app;