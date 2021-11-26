import { Router } from "express";
import { ObjectId } from "mongodb";
import db from "../mongodb";

// Instancia del objeto Router
const usersRouter = Router();

// Ruta para ontener todos los usuarios
usersRouter.get("/users", async (req, res) => {
    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Obtengo todos los usuarios
    const users = await usersCollection.find({}).toArray();

    // Mando la respuesta al cliente
    res.json(users);
});

// Ruta para obtener un usuario por el id
usersRouter.get("/users/:id", async (req, res) => {
    // Recibo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Realizo la busqueda en la base de datos por el id
    const user = await usersCollection.findOne({ _id: ObjectId(id) });

    // Mando la respuesta al cliente
    res.json(user);
});

// Ruta para crear un usuario
usersRouter.post("/users", async (req, res) => {
    // Obtengo el cuerpo de la peticion
    const { first_name, last_name, email, age } = req.body; // La manera en que ontengo los datos de llama destructuring

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Creo el usuario
    const user = await usersCollection.insertOne({ first_name, last_name, email, age });

    // Mando la respuesta al cliente
    res.json(user);
});

usersRouter.put("/users/:id", async (req, res) => {
    // Obtengo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo el cuerpo de la peticion
    const { first_name, last_name, email, age } = req.body; // La manera en que ontengo los datos de llama destructuring

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Actualizo el usuario
    const user = await usersCollection.updateOne({ _id: ObjectId(id) }, { $set: { first_name, last_name, email, age } });

    // Mando la respuesta al cliente
    res.json(user);
});

// Ruta para eliminar un usuario
usersRouter.delete("/users/:id", async (req, res) => {
    // Obtengo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Elimino el usuario
    const user = await usersCollection.deleteOne({ _id: ObjectId(id) });

    // Mando la respuesta al cliente
    res.json(user);
});

export default usersRouter;