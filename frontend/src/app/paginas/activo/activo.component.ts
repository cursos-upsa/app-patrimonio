import {Component, computed, inject, signal} from '@angular/core';
import {GestorApiService} from "../../servicios/gestor-api.service";
import {ActivatedRoute} from "@angular/router";
import formatearMoneda from "../../logica/formatearMoneda";
import {ButtonFavoritoComponent} from '../../componentes/button-favorito/button-favorito.component';
import {firstValueFrom} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-activo',
    templateUrl: './activo.component.html',
    styleUrl: './activo.component.css',
    imports: [ButtonFavoritoComponent, CommonModule]
})
export class ActivoComponent {
    simbolo = signal<string>('');
    precioUSD = signal<number | null>(null);
    private route = inject(ActivatedRoute);
    private gestorApiService = inject(GestorApiService);
    precioString = computed(() => {
        return formatearMoneda(this.precioUSD(), this.gestorApiService.multiplicadorPrecio(),
            this.gestorApiService.monedaFiat());
    });

    valorTotal = computed(() => {
        if (!this.precioUSD() || !this.esFavorito()) return null;
        const cantidad = this.obtenerCantidadFavorito() || 0;
        return this.precioUSD()! * this.gestorApiService.multiplicadorPrecio() * cantidad;
    });

    valorTotalString = computed(() => {
        return formatearMoneda(this.valorTotal(), 1, this.gestorApiService.monedaFiat());
    });

    constructor() {
        this.route.params.subscribe(params => {
            const nuevoSimbolo = params['simbolo']?.replaceAll('-', '/') || '';
            this.simbolo.set(nuevoSimbolo);
            this.precioUSD.set(null);
        });
    }

    async buscarPrecio() {
        try {
            const precio = await firstValueFrom(
                this.gestorApiService.obtenerPrecioUSDSimbolo(this.simbolo())
            );
            this.precioUSD.set(precio);
        } catch (error) {
            console.error(`Error al obtener el precio de ${this.simbolo()}:`, error);
        }
    }

    esFavorito(): boolean {
        return this.gestorApiService.esSimboloFavorito(this.simbolo());
    }

    obtenerCantidadFavorito(): number | undefined {
        return this.gestorApiService.obtenerCantidadFavorito(this.simbolo());
    }
}
