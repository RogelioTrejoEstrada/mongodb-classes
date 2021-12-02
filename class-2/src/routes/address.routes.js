import { Router } from "express";
import { ObjectId } from "mongodb";
import db from "../mongodb";

const addressRouter = Router();

// Ruta para obtener todas las address
addressRouter.get("/address", async (req, res) => {
    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo todos los address
    const address = await addressCollection.find({}).toArray();

    // Envio la respuesta
    res.send(address);
});

// Ruta para obtener una address por id
addressRouter.get("/address/:id", async (req, res) => {
    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo el id de la address
    const id = req.params.id;

    // Obtengo la address
    const address = await addressCollection.findOne({ _id: ObjectId(id) });

    // Envio la respuesta
    res.send(address);
});

// Ruta para crear una address  
addressRouter.post("/address", async (req, res) => {
    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo los datos de la address
    const { street, number, city, state, postal_code } = req.body;

    // Creo la address
    const address = await addressCollection.insertOne({
        street,
        number,
        city,
        state,
        postal_code
    });

    // Envio la respuesta
    res.send(address);
});

// Ruta para actualizar una address
addressRouter.put("/address/:id", async (req, res) => {
    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo el id de la address
    const id = req.params.id;

    // Obtengo los datos de la address
    const { street, number, city, state, postal_code } = req.body;

    // Actualizo la address
    const address = await addressCollection.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                street,
                number,
                city,
                state,
                postal_code
            }
        }
    );

    // Envio la respuesta
    res.send(address);
});

// Ruta para eliminar una address
addressRouter.delete("/address/:id", async (req, res) => {
    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo el id de la address
    const id = req.params.id;

    // Elimino la address
    const address = await addressCollection.deleteOne({ _id: ObjectId(id) });

    // Envio la respuesta
    res.send(address);
});

// Ruta para obtener todas las address de un usuario
addressRouter.get("/address/user/:id", async (req, res) => {
    // Obtengo el id de la address
    const id = req.params.id;

    // Obtengo la coleccion de address
    const addressCollection = (await db()).collection("address");

    // Obtengo la address
    const address = await addressCollection.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "address",
                as: "user"
            }
        },
        {
            $match: {
                "user._id": ObjectId(id)
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                street: 1,
                number: 1,
                city: 1,
                state: 1,
                postal_code: 1,
                user: {
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    age: 1
                }
        
            }
        }
    ]).toArray();

    // Envio la respuesta
    res.send(address[0]);
});

export default addressRouter;