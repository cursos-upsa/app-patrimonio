import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MenuComponent} from "./componentes/menu/menu.component";
import {EstadoMercadoComponent} from "./componentes/estado-mercado/estado-mercado.component";
import {GestorApiService} from "./servicios/gestor-api.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, EstadoMercadoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-patrimonio';
  gestorApiService = inject(GestorApiService);

  constructor() {
    effect(() => {
      const tema = this.gestorApiService.tema();
      document.documentElement.setAttribute('data-theme', tema);
    });
  }
}
