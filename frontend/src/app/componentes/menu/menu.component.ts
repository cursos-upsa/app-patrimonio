import {Component, inject, Signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CambioMonedaComponent} from "../cambio-moneda/cambio-moneda.component";
import {GestorApiService} from "../../servicios/gestor-api.service";
import {DatosActivo} from "../../interfaces/datosActivo";

@Component({
  selector: 'app-menu',
    imports: [
        RouterLink
    ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
    gestorApiService = inject(GestorApiService);
}
