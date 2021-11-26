import "@babel/polyfill";
import app from "./app";


function main() {

    // Ejecuta el programa en el puerto 3000
    app.listen(3000, function() {
        console.log("Server on port 3000");
    });

}

main();