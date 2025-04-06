import {Component, computed, inject, signal} from '@angular/core';
import {GestorApiService} from "../../servicios/gestor-api.service";
import {ActivatedRoute} from "@angular/router";
import formatearMoneda from "../../logica/formatearMoneda";
import {ButtonFavoritoComponent} from '../../componentes/button-favorito/button-favorito.component';
import {firstValueFrom} from 'rxjs';

@Component({
    selector: 'app-activo',
    templateUrl: './activo.component.html',
    styleUrl: './activo.component.css',
    imports: [ButtonFavoritoComponent]
})
export class ActivoComponent {
    private route = inject(ActivatedRoute);
    private gestorApiService = inject(GestorApiService);

    simbolo = signal<string>('');
    precioUSD = signal<number | null>(null);

    precioString = computed(() => {
        return formatearMoneda(this.precioUSD(), this.gestorApiService.multiplicadorPrecio(),
            this.gestorApiService.monedaFiat());
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
}
