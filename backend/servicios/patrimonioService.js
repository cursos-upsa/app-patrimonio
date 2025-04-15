const MongoLib = require("../lib/MongoLib");

class PatrimonioService {
    constructor() {
        this.coleccionDatosSimbolos = "datos_simbolos";
        this.coleccionSimbolosFavoritos = "simbolos_favoritos";
        this.mongoDB = new MongoLib();
    }

    async getDatosSimbolos() {
        try {
            return await this.mongoDB.getDatos(this.coleccionDatosSimbolos);
        } catch (error) {
            console.log("Error al recuperar los datos de símbolos", error);
            throw error;
        }
    }

    async agregarSimboloFavorito({symbol, cantidad}) {
        try {
            const simboloFavorito = {symbol, cantidad};
            return await this.mongoDB.insertar(this.coleccionSimbolosFavoritos, simboloFavorito);
        } catch (error) {
            console.log("Error al agregar el símbolo favorito:", error);
            throw error;
        }
    }

    async actualizarCantidadSimboloFavorito(symbol, cantidad) {
        try {
            return await this.mongoDB.actualizar(
                this.coleccionSimbolosFavoritos, 
                {symbol: symbol}, 
                {cantidad: cantidad}
            );
        } catch (error) {
            console.log("Error al actualizar la cantidad del símbolo favorito:", error);
            throw error;
        }
    }

    async eliminarSimboloFavorito(symbol) {
        try {
            return await this.mongoDB.eliminar(this.coleccionSimbolosFavoritos, {symbol: symbol});
        } catch (error) {
            console.log("Error al eliminar el símbolo favorito:", error);
            throw error;
        }
    }
}

module.exports = PatrimonioService;
