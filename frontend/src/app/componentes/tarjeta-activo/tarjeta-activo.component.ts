import {Component, computed, inject, Input, Signal} from '@angular/core';
import { DatosActivo } from "../../interfaces/datosActivo";
import { Router } from '@angular/router';
import {GestorApiService} from "../../servicios/gestor-api.service";

@Component({
    selector: 'app-tarjeta-activo',
    templateUrl: './tarjeta-activo.component.html',
    styleUrl: './tarjeta-activo.component.css'
})
export class TarjetaActivoComponent {
    @Input() datosActivo!: DatosActivo;
    gestorApiService: GestorApiService = inject(GestorApiService);
    monedaFiat = computed(() => this.gestorApiService.monedaFiat());

    constructor(private router: Router) {}

    verDetalleActivo() {
        const activo = this.datosActivo.symbol.replaceAll('/', '-');
        this.router.navigate(["/activo", activo]);
    }
}