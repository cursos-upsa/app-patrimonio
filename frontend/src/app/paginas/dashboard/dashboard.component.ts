import {Component, inject} from '@angular/core';
import {GestorApiService} from '../../servicios/gestor-api.service';
import {DatosActivo} from "../../interfaces/datosActivo";
import {TarjetaActivoComponent} from "../../componentes/tarjeta-activo/tarjeta-activo.component";

@Component({
    selector: 'app-dashboard',
    imports: [
        TarjetaActivoComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    gestorApiService: GestorApiService = inject(GestorApiService);
    datosSimbolos: DatosActivo[] | null = null;

    constructor() {
        this.datosSimbolos = this.gestorApiService.obtenerSimbolosEjemplo();
    }
}
