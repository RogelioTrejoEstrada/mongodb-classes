// Importaciones
import "@babel/polyfill";
import { MongoClient, ObjectId } from "mongodb";

import usersData from "../data/cars.json";
import app from "./app";

const main = async () => {
    // Instancia para conectar al motor de base de datos
    const client = new MongoClient("mongodb://localhost:27017");

    await client.connect();
    console.log(">>DB is conected!!");

    const db = client.db("curso-rogger");

    

    // const resp = await usersCollection.insertMany(usersData);
    // const data = await usersCollection.find({}).toArray();

    // console.log(data)

    app.get("/users",async (req, res) => {
        const usersCollection = db.collection("users");
        const data = await usersCollection.find({}).toArray();

        res.json(data);
    })

    app.listen(3000, function() {
        console.log("Server on port 3000");
    });
};

if (require.main === module)
    main();
