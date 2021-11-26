import { MongoClient } from "mongodb";

export default async function () {
    // Instancia para conectar al motor de base de datos
    const client = new MongoClient("mongodb://localhost:27017");

    await client.connect();
    console.log(">>DB is conected!!");

    const db = client.db("curso-rogger");

    return db;
}