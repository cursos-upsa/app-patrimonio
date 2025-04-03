import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import simbolosJson from '../../../assets/simbolos.json';
import {ParametroApi} from '../interfaces/parametroApi';
import {EstadoMercado} from "../interfaces/estadoMercado";
import {DatosActivo} from "../interfaces/datosActivo";
import {MonedaFiat} from "../interfaces/monedaFiat";

@Injectable({
    providedIn: 'root',
})
export class GestorApiService {
    http = inject(HttpClient);
    URL_BASE = 'https://api.twelvedata.com';
    API_KEY_TWELVE_DATA = "32bfee0e890c481c80189a34d97fa5b4";

    simbolosFavoritos = signal<string[]>([]);

    monedaFiat = signal<MonedaFiat>('USD', {
        equal: (prev, next) => {
            if (next === "EUR" && prev !== next) {
                this.asignarCambioDolarEuro();
            }
            return prev === next;
        }
    });
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

    obtenerSimbolosEjemplo(): DatosActivo[] {
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

    private crearUrl(ambito: string, parametros: ParametroApi[]): string {
        let nuevaUrl = `${this.URL_BASE}/${ambito}?apikey=${this.API_KEY_TWELVE_DATA}`;

        parametros.forEach(parametro => {
            nuevaUrl += `&${parametro.nombre}=${parametro.valores.join(',')}`;
        });

        return nuevaUrl;
    }

    obtenerInfoSimbolo(simbolo: string): Observable<DatosActivo> {
        const url = this.crearUrl('stocks', [{nombre: 'symbol', valores: [simbolo]}]);
        return this.http.get<DatosActivo>(url);
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
        const esFavorito = favoritos.includes(simbolo);

        if (!esFavorito) {
            this.simbolosFavoritos.set([...favoritos, simbolo]);
            return;
        }
        const nuevosFavoritos = favoritos.filter(s => s !== simbolo);
        this.simbolosFavoritos.set(nuevosFavoritos);
    }

    esSimboloFavorito(simbolo: string): boolean {
        return this.simbolosFavoritos().includes(simbolo);
    }
}
