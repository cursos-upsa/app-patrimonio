import {Component, computed, inject} from '@angular/core';
import {GestorApiService} from "../../servicios/gestor-api.service";
import {ActivatedRoute} from "@angular/router";
import formatearMoneda from "../../logica/formatearMoneda";

@Component({
    selector: 'app-activo',
    templateUrl: './activo.component.html',
    styleUrl: './activo.component.css'
})
export class ActivoComponent {
    private route = inject(ActivatedRoute);
    private gestorApiService = inject(GestorApiService);

    simbolo: string;
    precioUSD: number | null = null;
    precioString = computed(() => {
        return formatearMoneda(this.precioUSD, this.gestorApiService.multiplicadorPrecio(),
            this.gestorApiService.monedaFiat());
    });

    constructor() {
        this.simbolo = this.route.snapshot.paramMap.get('simbolo')?.replaceAll('-', '/') || '';
    }

    buscarPrecio() {
        this.gestorApiService.obtenerPrecioUSDSimbolo(this.simbolo).subscribe({
            next: (precio) => {
                this.precioUSD = precio;
            },
            error: (error) => {
                console.error(`Error al obtener el precio de ${this.simbolo}:`, error);
            }
        });
    }
}