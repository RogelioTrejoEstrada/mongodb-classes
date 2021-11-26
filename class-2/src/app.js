import express from "express";

// Importacionde nuevas dependencias para el proyecto
import morgan from "morgan"; // Nos ayudara a ver que ruta se esta visitando
import cors from "cors"; // Nos ayuda a que se pueda acceder a nuestra API desde cualquier lugar

// Routes
import routes from "./routes/routes";
import usersRoute from "./routes/users.routes";

// Instancia de la aplicación de servidor
const app = express();

// Middleares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Se ejecuta los middlewares que se importaron
app.use(morgan('dev'));
app.use(cors());

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