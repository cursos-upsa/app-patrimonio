const express = require("express");
const PatrimonioService = require("../servicios/patrimonioService.js");

function patrimonioAPI(app) {
    const router = express.Router();
    const patrimonioService = new PatrimonioService();

    app.use("/api/patrimonio", router);

    // GET para obtener datos de símbolos
    // Ejemplo de llamada GET: http://localhost:8080/api/patrimonio/datos-simbolos
    router.get("/datos-simbolos", async function (solicitud, respuesta, siguiente) {
        try {
            const datosSimbolos = await patrimonioService.getDatosSimbolos();
            respuesta.status(200).json({
                data: datosSimbolos,
                message: "Datos de símbolos recuperados con éxito."
            });
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // POST para añadir un símbolo favorito
    // Ejemplo de llamada POST: http://localhost:8080/api/patrimonio/simbolos-favoritos con body:
    // { "symbol": "AAPL", "cantidad": 10 }
    router.post("/simbolos-favoritos", async function (solicitud, respuesta, siguiente) {
        try {
            const {symbol, cantidad} = solicitud.body;
            if (!symbol)
                return respuesta.status(400).json({message: "Falta el símbolo a añadir."});
            if (cantidad === undefined || cantidad === null)
                return respuesta.status(400).json({message: "Falta la cantidad del símbolo a añadir."});

            console.log(`Símbolo favorito recibido para añadir: ${symbol}`);

            await patrimonioService.agregarSimboloFavorito({symbol, cantidad});

            respuesta.status(201).json({message: `Símbolo favorito '${symbol}' añadido con éxito.`});
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // PUT para actualizar la cantidad de un símbolo favorito
    // Ejemplo de llamada PUT: http://localhost:8080/api/patrimonio/simbolos-favoritos/AAPL con body:
    // { "cantidad": 20 }
    router.put("/simbolos-favoritos/:symbol", async function (solicitud, respuesta, siguiente) {
        try {
            const {symbol} = solicitud.params;
            const {cantidad} = solicitud.body;

            if (!symbol)
                return respuesta.status(400).json({message: "Falta el símbolo a actualizar."});
            if (cantidad === undefined || cantidad === null)
                return respuesta.status(400).json({message: "Falta la cantidad del símbolo a actualizar."});

            console.log(`Símbolo favorito recibido para actualizar: ${symbol}`);

            await patrimonioService.actualizarCantidadSimboloFavorito(symbol, cantidad);

            respuesta.status(200).json({message: `Cantidad del símbolo favorito '${symbol}' actualizada con éxito.`});
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // DELETE para eliminar un símbolo favorito
    // Ejemplo de llamada DELETE: http://localhost:8080/api/patrimonio/simbolos-favoritos/AAPL
    router.delete("/simbolos-favoritos/:symbol", async function (solicitud, respuesta, siguiente) {
        try {
            const {symbol} = solicitud.params;
            if (!symbol)
                return respuesta.status(400).json({message: "Falta el símbolo a eliminar."});

            console.log(`Símbolo favorito recibido para eliminar: ${symbol}`);

            await patrimonioService.eliminarSimboloFavorito(symbol);

            respuesta.status(200).json({message: `Símbolo favorito '${symbol}' eliminado con éxito.`});
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // GET para obtener símbolos favoritos
    // Ejemplo de llamada GET: http://localhost:8080/api/patrimonio/simbolos-favoritos
    router.get("/simbolos-favoritos", async function (solicitud, respuesta, siguiente) {
        try {
            const simbolosFavoritos = await patrimonioService.getSimbolosFavoritos();
            respuesta.status(200).json({
                data: simbolosFavoritos,
                message: "Símbolos favoritos recuperados con éxito."
            });
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });
}

module.exports = patrimonioAPI;
