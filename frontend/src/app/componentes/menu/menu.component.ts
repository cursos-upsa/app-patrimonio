import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {CambioMonedaComponent} from "../cambio-moneda/cambio-moneda.component";

@Component({
  selector: 'app-menu',
    imports: [
        RouterLink,
        CambioMonedaComponent
    ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
