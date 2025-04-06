import { Component } from '@angular/core';
import {CambioMonedaComponent} from "../../componentes/cambio-moneda/cambio-moneda.component";

@Component({
  selector: 'app-preferencias',
    imports: [
        CambioMonedaComponent
    ],
  templateUrl: './preferencias.component.html',
  styleUrl: './preferencias.component.css'
})
export class PreferenciasComponent {

}
