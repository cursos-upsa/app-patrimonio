import { Component, Input } from '@angular/core';
import { DatosActivo } from "../../interfaces/datosActivo";
import { Router } from '@angular/router';

@Component({
    selector: 'app-tarjeta-activo',
    templateUrl: './tarjeta-activo.component.html',
    styleUrl: './tarjeta-activo.component.css'
})
export class TarjetaActivoComponent {
    @Input() datosActivo!: DatosActivo;

    constructor(private router: Router) {}

    verDetalleActivo() {
        const activo = this.datosActivo.symbol.replaceAll('/', '-');
        this.router.navigate(["/activo", activo]);
    }
}