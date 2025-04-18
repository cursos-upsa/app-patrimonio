const express = require("express");
const TwelveDataService = require("../servicios/twelveDataService.js");

function twelveDataAPI(app) {
    const router = express.Router();
    const twelveDataService = new TwelveDataService();

    app.use("/api/twelvedata", router);

    // GET para obtener el cambio de dolar a euro
    // Ejemplo de llamada GET: http://localhost:8080/api/twelvedata/exchange-rate/usd-eur
    router.get("/exchange-rate/usd-eur", async function (solicitud, respuesta, siguiente) {
        try {
            const rate = await twelveDataService.obtenerCambioDolarEuro();
            respuesta.status(200).json({
                rate: rate,
                message: "Cambio de dolar a euro recuperado con éxito."
            });
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // GET para obtener el precio de un símbolo en una moneda específica
    // Ejemplo de llamada GET: http://localhost:8080/api/twelvedata/price/AAPL/USD
    router.get("/price/:symbol/:currency", async function (solicitud, respuesta, siguiente) {
        try {
            const { symbol, currency } = solicitud.params;
            if (!symbol)
                return respuesta.status(400).json({message: "Falta el símbolo."});
            if (!currency)
                return respuesta.status(400).json({message: "Falta la moneda."});

            const price = await twelveDataService.obtenerPrecioSimbolo(symbol, currency);
            respuesta.status(200).json({
                price: price,
                message: `Precio del símbolo ${symbol} en ${currency} recuperado con éxito.`
            });
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });

    // GET para obtener el estado del mercado
    // Ejemplo de llamada GET: http://localhost:8080/api/twelvedata/market-state
    router.get("/market-state", async function (solicitud, respuesta, siguiente) {
        try {
            const marketState = await twelveDataService.obtenerEstadoMercado();
            respuesta.status(200).json(marketState);
        } catch (error) {
            console.error(`Ha habido un error: ${error}`);
            siguiente(error);
        }
    });
}

module.exports = twelveDataAPI;