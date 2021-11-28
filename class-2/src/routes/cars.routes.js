import { Router } from "express";
import { ObjectId } from "mongodb";
import db from "../mongodb";

const carsRouter = Router();

// Ruta para obtener todos los autos
carsRouter.get("/cars", async (req, res) => {
    // Obtengo la coleccion de carros 
    const carsCollection = (await db()).collection("cars");

    // Obtengo todos los usuarios
    const cars = await carsCollection.find({}).toArray();

    // Mando la respuesta al cliente
    res.json(cars);
});

// Ruta para obtener un auto por id
carsRouter.get("/cars/:id", async (req, res) => {
    // Obtengo el id del auto
    const id = req.params.id;

    // Obtengo la coleccion de carros
    const carsCollection = (await db()).collection("cars");

    // Obtengo el auto por id
    const car = await carsCollection.findOne({ _id: ObjectId(id) });

    // Mando la respuesta al cliente
    res.json(car);
});

// Ruta para crear un auto
carsRouter.post("/cars", async (req, res) => {
    // Obtengo los datos del nuevo carro
    const { car, model, year, price } = req.body;

    // Obtengo la coleccion de carros
    const carsCollection = (await db()).collection("cars");

    // Creo el nuevo carro
    const newCar = await carsCollection.insertOne({car,model,year,price });

    // Obtengo el carro creado
    const carCreated = await carsCollection.findOne({ _id: newCar.insertedId });
    
    // Mando la respuesta al cliente
    res.json(carCreated);
});

// Ruta para actualizar un auto
carsRouter.put("/cars/:id", async (req, res) => {
    // Obtengo el id del auto
    const id = req.params.id;

    // Obtengo los datos del auto
    const { car, model, year, price } = req.body;

    // Obtengo la coleccion de carros
    const carsCollection = (await db()).collection("cars");

    // Actualizo el carro
    await carsCollection.updateOne({ _id: ObjectId(id) }, { $set: { car, model, year, price } });

    // Obtengo el carro actualizado
    const carUpdated = await carsCollection.findOne({ _id: ObjectId(id) });

    // Mando la respuesta al cliente
    res.json(carUpdated);
});

// Ruta para eliminar un auto
carsRouter.delete("/cars/:id", async (req, res) => {
    // Obtengo el id del auto
    const id = req.params.id;

    // Obtengo la coleccion de carros
    const carsCollection = (await db()).collection("cars");

    // Elimino el carro
    await carsCollection.deleteOne({ _id: ObjectId(id) });

    // Mando la respuesta al cliente
    res.json({ message: "Car deleted" });
});

export default carsRouter;