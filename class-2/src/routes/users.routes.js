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

// Ruta para crear un usuario con mas informacion
usersRouter.post("/users/info", async (req, res) => {
    // Obtengo el cuerpo de la peticion
    const { first_name, last_name, email, age, address, cars } = req.body; // La manera en que ontengo los datos de llama destructuring

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Creo el usuario
    const result = await usersCollection.insertOne({
        first_name,
        last_name,
        email,
        age,
        address: ObjectId(address),
        cars: cars.map(car => ObjectId(car))
    });

    // Busco el usuario creado anteriormente
    const user = await usersCollection.findOne({ _id: ObjectId(result.insertedId) });

    // Mando la respuesta al cliente
    res.json(user);
});

// Ruta para obtener la relacion de usuarios con su direccion
usersRouter.get("/users/address/:id", async (req, res) => {
    // Obtengo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Realizo la relacion
    const user = await usersCollection.aggregate([
        {
            /**
             * La funcion match busca la considencia que le pasemos por parametro en 
             * algun campo de la coleccion, en este caso el id del usuario:
             *      Esto es equivalente a decir en SQL algo como:
             *         SELECT * FROM users WHERE id = 'id'
             */
            $match: {
                _id: ObjectId(id)
            }
        },
        {
            /**
             * La funcion lookup busca en la coleccion address la informacion de la
             * direccion del usuario, en este caso el id de la direccion:
             *     Esto es equivalente a decir en SQL algo como:
             *        SELECT * 
             *        FROM users 
             *          LEFT JOIN address ON users.addressId = address.id
             *        WHERE id = 'id'
             *        
             */
            $lookup: {
                from: "address",
                localField: "address",
                foreignField: "_id",
                as: "address"
            }
        },
        {
            /**
             * La funcion unwind expande la informacion de la coleccion address
             * en una nueva coleccion, en este caso la coleccion address
             */
            $unwind: "$address"
        },
        {
            /**
             * la funcion project es la que se encarga de filtrar la informacion 
             * y mostrar solo los campos que queremos mostrar y de la forma que uno desee
             */
            $project: {
                first_name: 1,
                last_name: 1,
                email: 1,
                age: 1,
                // address: {
                //     street: 1,
                //     city: 1,
                //     state: 1,
                //     postal_code: 1,
                //     number: 1
                // },
                street: "$address.street",
                city: "$address.city",
                state: "$address.state",
                postal_code: "$address.postal_code",
                number: "$address.number"

            }
        }
    ]).toArray();

    // Mando la respuesta al cliente
    res.json(user);
});

// Ruta para obtener la relacion de usuarios con sus carros
usersRouter.get("/users/cars/:id", async (req, res) => {
    // Obtengo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Realizo la relacion
    const user = await usersCollection.aggregate([
        {
            /**
             * La funcion match busca la considencia que le pasemos por parametro en 
             * algun campo de la coleccion, en este caso el id del usuario:
             *      Esto es equivalente a decir en SQL algo como:
             *         SELECT * FROM users WHERE id = 'id'
             */
            $match: {
                _id: ObjectId(id)
            }
        },
        {
            /**
            * La funcion lookup busca en la coleccion address la informacion de la
            * direccion del usuario, en este caso el id de la direccion:
            *     Esto es equivalente a decir en SQL algo como:
            *        SELECT * 
            *        FROM users 
            *          LEFT JOIN cars ON users.carsId = address.id
            *        WHERE users.id = 'id'
            *        
            */
            $lookup: {
                from: "cars",
                localField: "cars",
                foreignField: "_id",
                as: "cars"
            }
        },
        // {
        //     /**
        //      * La funcion unwind expande la informacion de la coleccion address
        //      * en una nueva coleccion, en este caso la coleccion address
        //     */
        //     $unwind: "$cars"
        // },
        {
            /**
             * la funcion project es la que se encarga de filtrar la informacion 
             * y mostrar solo los campos que queremos mostrar y de la forma que uno desee
             */
            $project: {
                first_name: 1,
                last_name: 1,
                email: 1,
                age: 1,
                cars: {
                    car: 1,
                    model: 1,
                    year: 1
                },
                // car: "$cars.car",
                // model: "$cars.model",
                // year: "$cars.year"
            }
        }
    ]).toArray();

    // Mando la respuesta al cliente
    res.json(user);
});

// Ruta para obtener la relacion de usuarios con sus carros y direccion
usersRouter.get("/users/allinfo/:id", async (req, res) => {
    // Obtengo el parametro de la URL que nombre
    const id = req.params.id;

    // Obtengo la coleccion de usuarios
    const usersCollection = (await db()).collection("users");

    // Realizo la relacion
    const user = await usersCollection.aggregate([
        {
            $match: {
                _id: ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "address",
                localField: "address",
                foreignField: "_id",
                as: "address"
            }
        },
        {
            $unwind: "$address"
        },
        {
            $lookup: {
                from: "cars",
                localField: "cars",
                foreignField: "_id",
                as: "cars"
            }
        },
        {
            $project: {
                first_name: 1,
                last_name: 1,
                email: 1,
                age: 1,
                address: {
                    street: 1,
                    city: 1,
                    state: 1,
                    postal_code: 1,
                    number: 1
                },
                cars: {
                    car: 1,
                    model: 1,
                    year: 1,
                    price: 1
                }
            }
        }
    ]).toArray();

    // Mando la respuesta al cliente
    res.json(user[0]);
});

export default usersRouter;