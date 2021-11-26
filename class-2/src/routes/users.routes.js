import { Router } from "express";
import { ObjectId } from "mongodb";
import db from "../mongodb";

const usersRouter = Router();

usersRouter.get("/users",async (req, res) => {
    const usersCollection = (await db()).collection("users");
    const users = await usersCollection.find({ }).toArray();

    res.json(users);
});

usersRouter.get("/users/:id", async (req, res) => {
    // Recibo el parametro de la URL
    const id = req.params.id;

    const usersCollection = (await db()).collection("users");
    const user = await usersCollection.findOne({ _id: ObjectId(id) });

    res.json(user);
})

export default usersRouter;