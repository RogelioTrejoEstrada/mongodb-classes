import express from "express";

// Routes
import routes from "./routes/routes";
import usersRoute from "./routes/users.routes";

// Instancia de la aplicación de servidor
const app = express();

// Middleares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la aplicación
app.use(routes);
app.use(usersRoute);

// app.get("/", function (req, res) {
//     res.send("Hola mundo!!!");
// });

// app.get("/hola", function (req, res) {
//     res.json({
//         message: "hola mundo desde json!"
//     });
// });

// Exportamos la aplicación
export default app;