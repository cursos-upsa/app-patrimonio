import {Component, computed, inject, signal} from '@angular/core';
import {GestorApiService} from '../../servicios/gestor-api.service';
import {CommonModule} from '@angular/common';
import formatearMoneda from "../../logica/formatearMoneda";
import {firstValueFrom} from 'rxjs';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    gestorApiService = inject(GestorApiService);

    precios = signal<Map<string, number>>(new Map());
    datosSimbolosFavoritos = computed(() => this.gestorApiService.datosSimbolosFavoritos());
    valorTotal = computed(() => {
        if (this.precios().size === 0) return null;

        let total = 0;
        this.datosSimbolosFavoritos().forEach(activo => {
            const precio = this.precios().get(activo.symbol);
            if (precio) {
                const cantidad = this.gestorApiService.obtenerCantidadFavorito(activo.symbol) || 0;
                total += precio * cantidad * this.gestorApiService.multiplicadorPrecio();
            }
        });

        return total;
    });
    valorTotalString = computed(() => {
        return formatearMoneda(this.valorTotal(), 1, this.gestorApiService.monedaFiat());
    });

    async buscarPrecios() {
        const nuevosPrecios = new Map<string, number>();

        for (const activo of this.datosSimbolosFavoritos()) {
            try {
                const precio = await firstValueFrom(
                    this.gestorApiService.obtenerPrecioUSDSimbolo(activo.symbol)
                );
                nuevosPrecios.set(activo.symbol, precio);
            } catch (error) {
                console.error(`Error al obtener el precio de ${activo.symbol}:`, error);
            }
        }

        this.precios.set(nuevosPrecios);
    }

    obtenerPrecio(symbol: string): number | undefined {
        return this.precios().get(symbol);
    }

    calcularValor(symbol: string): number | null {
        const precio = this.precios().get(symbol);
        if (!precio) return null;

        const cantidad = this.gestorApiService.obtenerCantidadFavorito(symbol) || 0;
        return precio * cantidad * this.gestorApiService.multiplicadorPrecio();
    }

    formatearPrecio(precio: number | undefined): string {
        return formatearMoneda(precio || null, this.gestorApiService.multiplicadorPrecio(), this.gestorApiService.monedaFiat());
    }

    formatearValor(valor: number | null): string {
        return formatearMoneda(valor, 1, this.gestorApiService.monedaFiat());
    }
}
