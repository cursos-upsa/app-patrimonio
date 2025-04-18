class TwelveDataService {
    constructor() {
        this.URL_TWELVE_DATA_BASE = 'https://api.twelvedata.com';
        this.API_KEY_TWELVE_DATA = process.env.API_KEY_TWELVE_DATA;
    }

    crearUrl(ambito, parametros) {
        let nuevaUrl = `${this.URL_TWELVE_DATA_BASE}/${ambito}?apikey=${this.API_KEY_TWELVE_DATA}`;

        parametros.forEach(parametro => {
            nuevaUrl += `&${parametro.nombre}=${parametro.valores.join(',')}`;
        });

        return nuevaUrl;
    }

    async obtenerCambioDolarEuro() {
        try {
            const url = this.crearUrl('exchange_rate', [{nombre: 'symbol', valores: ['USD/EUR']}]);
            const response = await fetch(url);
            const data = await response.json();
            return parseFloat(data.rate);
        } catch (error) {
            console.error("Error al obtener el cambio de dolar a euro:", error);
            throw error;
        }
    }

    async obtenerPrecioSimbolo(simbolo, moneda) {
        try {
            const url = this.crearUrl('price', [
                {nombre: 'symbol', valores: [simbolo]},
                {nombre: 'currency', valores: [moneda]}
            ]);
            const response = await fetch(url);
            const data = await response.json();
            return parseFloat(data.price);
        } catch (error) {
            console.error(`Error al obtener el precio del símbolo ${simbolo}:`, error);
            throw error;
        }
    }

    async obtenerEstadoMercado() {
        try {
            const url = this.crearUrl('market_state', [{nombre: 'code', valores: ['XNGS']}]);
            const response = await fetch(url);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error("Error al obtener el estado del mercado:", error);
            throw error;
        }
    }
}

module.exports = TwelveDataService;