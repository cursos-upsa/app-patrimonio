import {MonedaFiat} from "../interfaces/monedaFiat";

export default function formatearMoneda(precio: number | null, multiplicador: number, moneda: MonedaFiat): string {
    const numeroFormateadoLocalEste = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: moneda
    });
    return precio ? numeroFormateadoLocalEste.format(precio * multiplicador) : ''
}