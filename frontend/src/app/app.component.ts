import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MenuComponent} from "./componentes/menu/menu.component";
import {EstadoMercadoComponent} from "./componentes/estado-mercado/estado-mercado.component";
import {CambioMonedaComponent} from "./componentes/cambio-moneda/cambio-moneda.component";

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, MenuComponent, EstadoMercadoComponent, CambioMonedaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-patrimonio';
}
