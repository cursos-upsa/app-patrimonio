import { Component } from '@angular/core';
import {CambioMonedaComponent} from "../../componentes/cambio-moneda/cambio-moneda.component";
import {CambioTemaComponent} from "../../componentes/cambio-tema/cambio-tema.component";

@Component({
  selector: 'app-preferencias',
    imports: [
        CambioMonedaComponent,
        CambioTemaComponent
    ],
  templateUrl: './preferencias.component.html',
  styleUrl: './preferencias.component.css'
})
export class PreferenciasComponent {

}
