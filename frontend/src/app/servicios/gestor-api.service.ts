import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import simbolosJson from '../../../assets/simbolos.json';
import {ParametroApi} from '../interfaces/parametroApi';
import {EstadoMercado} from "../interfaces/estadoMercado";
import {DatosActivo} from "../interfaces/datosActivo";
import {MonedaFiat} from "../interfaces/monedaFiat";
import {Tema} from "../interfaces/tema";
import {SimboloFavorito} from "../interfaces/simboloFavorito";

@Injectable({
    providedIn: 'root',
})
export class GestorApiService {
    http = inject(HttpClient);
    URL_BASE = 'https://api.twelvedata.com';
    API_KEY_TWELVE_DATA = "32bfee0e890c481c80189a34d97fa5b4";

    simbolosFavoritos = signal<SimboloFavorito[]>([]);
    datosSimbolosFavoritos = computed(() => {
        return this.obtenerDatosSimbolos().filter(simbolo =>
            this.simbolosFavoritos().some(fav => fav.symbol === simbolo.symbol));
    });

    monedaFiat = signal<MonedaFiat>('USD', {
        equal: (prev, next) => {
            if (next === "EUR" && prev !== next) {
                this.asignarCambioDolarEuro();
            }
            return prev === next;
        }
    });

    tema = signal<Tema>('claro');
    cambioDolarEuro = signal<number>(1);
    multiplicadorPrecio = computed(() => this.monedaFiat() === "USD" ? 1 : this.cambioDolarEuro());

    asignarCambioDolarEuro() {
        const url = this.crearUrl('exchange_rate', [{nombre: 'symbol', valores: ['USD/EUR']}]);
        this.http.get<{ rate: string }>(url).pipe(
            map(response => parseFloat(response.rate))
        ).subscribe({
            next: (rate) => {
                console.log(`Cambio de dolar a euro: ${rate}`);
                this.cambioDolarEuro.set(rate);
            },
            error: (error) => {
                console.error(`Error al obtener el cambio de dolar a euro:`, error);
            }
        });
    }

    obtenerDatosSimbolos(): DatosActivo[] {
        const simbolos: DatosActivo[] = [];

        simbolosJson.forEach(datos => {
            datos.data.forEach(simbolo => {
                if (simbolo.country === "United States" && simbolo.currency === "USD") {
                    simbolos.push(simbolo);
                    return;
                }
            });
        });
        return simbolos;
    }

    obtenerPrecioUSDSimbolo(simbolo: string): Observable<number> {
        const url = this.crearUrl('price', [
            {nombre: 'symbol', valores: [simbolo]},
            {nombre: 'currency', valores: [this.monedaFiat()]}
        ]);
        return this.http.get<{ price: string }>(url).pipe(
            map(response => parseFloat(response.price))
        );
    }

    obtenerEstadoMercado() {
        const url = this.crearUrl('market_state', [{nombre: 'code', valores: ['XNGS']}]);
        return this.http.get<EstadoMercado[]>(url).pipe(
            map(response => response[0])
        );
    }

    alternarAgregarComoFavorito(simbolo: string) {
        const favoritos = this.simbolosFavoritos();
        const esFavorito = favoritos.some(fav => fav.symbol === simbolo);

        if (!esFavorito) {
            const cantidadString = prompt("Introduce la cantidad del activo:", "1");
            if (cantidadString === null) {
                return;
            }

            const cantidad = Number(cantidadString);
            if (isNaN(cantidad)) {
                return;
            }

            this.simbolosFavoritos.set([...favoritos, {symbol: simbolo, cantidad}]);
            return;
        }
        const nuevosFavoritos = favoritos.filter(fav => fav.symbol !== simbolo);
        this.simbolosFavoritos.set(nuevosFavoritos);
    }

    esSimboloFavorito(simbolo: string): boolean {
        return this.simbolosFavoritos().some(fav => fav.symbol === simbolo);
    }

    obtenerCantidadFavorito(simbolo: string): number | undefined {
        const favorito = this.simbolosFavoritos().find(fav => fav.symbol === simbolo);
        return favorito?.cantidad;
    }

    private crearUrl(ambito: string, parametros: ParametroApi[]): string {
        let nuevaUrl = `${this.URL_BASE}/${ambito}?apikey=${this.API_KEY_TWELVE_DATA}`;

        parametros.forEach(parametro => {
            nuevaUrl += `&${parametro.nombre}=${parametro.valores.join(',')}`;
        });

        return nuevaUrl;
    }
}
