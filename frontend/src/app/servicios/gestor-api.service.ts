import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
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

    // ¡IMPORTANTE! En desarrollo la URL_BACKEND_BASE debe ser `http://localhost:8080`.
    URL_BACKEND_BASE = 'http://localhost:8080';
    URL_BACKEND = `${this.URL_BACKEND_BASE}/api/patrimonio`;
    URL_TWELVEDATA_BACKEND = `${this.URL_BACKEND_BASE}/api/twelvedata`;

    datosSimbolosCache: Observable<DatosActivo[]> | null = null;
    datosSimbolosArray = signal<DatosActivo[]>([]);

    simbolosFavoritosCache: Observable<SimboloFavorito[]> | null = null;
    simbolosFavoritos = signal<SimboloFavorito[]>([]);

    datosSimbolosFavoritos = computed(() => {
        return this.datosSimbolosArray().filter(simbolo =>
            this.simbolosFavoritos().some(fav => fav.symbol === simbolo.symbol));
    });

    constructor() {
        this.inicializarDatos();
    }

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
        const url = `${this.URL_TWELVEDATA_BACKEND}/exchange-rate/usd-eur`;
        this.http.get<{ rate: number, message: string }>(url).pipe(
            map(response => response.rate)
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

    obtenerDatosSimbolos(): Observable<DatosActivo[]> {
        if (this.datosSimbolosCache) {
            return this.datosSimbolosCache;
        }
        this.datosSimbolosCache = this.http.get<{
            data: DatosActivo[],
            message: string
        }>(`${this.URL_BACKEND}/datos-simbolos`)
            .pipe(
                map(response => {
                    const simbolos = response.data;
                    this.datosSimbolosArray.set(simbolos);
                    return simbolos;
                }),
            );
        return this.datosSimbolosCache;
    }

    obtenerSimbolosFavoritos(): Observable<SimboloFavorito[]> {
        if (this.simbolosFavoritosCache) {
            return this.simbolosFavoritosCache;
        }
        this.simbolosFavoritosCache = this.http.get<{
            data: SimboloFavorito[],
            message: string
        }>(`${this.URL_BACKEND}/simbolos-favoritos`)
            .pipe(
                map(response => {
                    const favoritos = response.data;
                    this.simbolosFavoritos.set(favoritos);
                    return favoritos;
                })
            );
        return this.simbolosFavoritosCache;
    }

    inicializarDatos() {
        this.obtenerDatosSimbolos().subscribe({
            error: (error) => {
                console.error('Error al obtener los datos de símbolos:', error);
            }
        });

        this.obtenerSimbolosFavoritos().subscribe({
            error: (error) => {
                console.error('Error al obtener los símbolos favoritos:', error);
            }
        });
    }

    obtenerPrecioUSDSimbolo(simbolo: string): Observable<number> {
        const url = `${this.URL_TWELVEDATA_BACKEND}/price/${simbolo}/${this.monedaFiat()}`;
        return this.http.get<{ price: number, message: string }>(url).pipe(
            map(response => response.price)
        );
    }

    obtenerEstadoMercado() {
        const url = `${this.URL_TWELVEDATA_BACKEND}/market-state`;
        return this.http.get<EstadoMercado>(url);
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

            const nuevoFavorito = {symbol: simbolo, cantidad};
            this.http.post(`${this.URL_BACKEND}/simbolos-favoritos`, nuevoFavorito)
                .subscribe({
                    next: () => {
                        console.log(`Símbolo ${simbolo} añadido a favoritos`);
                        this.simbolosFavoritosCache = null;
                        this.simbolosFavoritos.set([...favoritos, nuevoFavorito]);
                    },
                    error: (error) => {
                        console.error(`Error al añadir el símbolo ${simbolo} a favoritos:`, error);
                    }
                });
            return;
        }

        this.http.delete(`${this.URL_BACKEND}/simbolos-favoritos/${simbolo}`)
            .subscribe({
                next: () => {
                    console.log(`Símbolo ${simbolo} eliminado de favoritos`);
                    this.simbolosFavoritosCache = null;
                    const nuevosFavoritos = favoritos.filter(fav => fav.symbol !== simbolo);
                    this.simbolosFavoritos.set(nuevosFavoritos);
                },
                error: (error) => {
                    console.error(`Error al eliminar el símbolo ${simbolo} de favoritos:`, error);
                }
            });
    }

    esSimboloFavorito(simbolo: string): boolean {
        return this.simbolosFavoritos().some(fav => fav.symbol === simbolo);
    }

    obtenerCantidadFavorito(simbolo: string): number | undefined {
        const favorito = this.simbolosFavoritos().find(fav => fav.symbol === simbolo);
        return favorito?.cantidad;
    }

    actualizarCantidadFavorito(simbolo: string, nuevaCantidad: number) {
        const favoritos = this.simbolosFavoritos();
        if (!this.esSimboloFavorito(simbolo)) {
            console.error(`El símbolo ${simbolo} no es favorito`);
            return;
        }

        this.http.put(`${this.URL_BACKEND}/simbolos-favoritos/${simbolo}`, { cantidad: nuevaCantidad })
            .subscribe({
                next: () => {
                    console.log(`Cantidad del símbolo ${simbolo} actualizada a ${nuevaCantidad}`);
                    this.simbolosFavoritosCache = null;
                    const nuevosFavoritos = favoritos.map(fav => 
                        fav.symbol === simbolo ? { ...fav, cantidad: nuevaCantidad } : fav
                    );
                    this.simbolosFavoritos.set(nuevosFavoritos);
                },
                error: (error) => {
                    console.error(`Error al actualizar la cantidad del símbolo ${simbolo}:`, error);
                }
            });
    }

}
