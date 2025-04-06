import {Component, inject} from '@angular/core';
import {TarjetaActivoComponent} from "../../componentes/tarjeta-activo/tarjeta-activo.component";
import {GestorApiService} from "../../servicios/gestor-api.service";
import {DatosActivo} from "../../interfaces/datosActivo";

@Component({
  selector: 'app-activos-favoritos',
    imports: [
        TarjetaActivoComponent
    ],
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.css'
})
export class Activos {
    gestorApiService: GestorApiService = inject(GestorApiService);
    datosSimbolos: DatosActivo[] | null = null;

    constructor() {
        this.datosSimbolos = this.gestorApiService.obtenerDatosSimbolos();
    }
}
