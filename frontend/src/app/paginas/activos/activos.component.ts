import {Component, inject, OnInit} from '@angular/core';
import {TarjetaActivoComponent} from "../../componentes/tarjeta-activo/tarjeta-activo.component";
import {GestorApiService} from "../../servicios/gestor-api.service";
import {DatosActivo} from "../../interfaces/datosActivo";
import {Router, NavigationEnd, RouterLink} from "@angular/router";

@Component({
    selector: 'app-activos-favoritos',
    imports: [
        TarjetaActivoComponent,
        RouterLink
    ],
    templateUrl: './activos.component.html',
    styleUrl: './activos.component.css'
})
export class ActivosComponent {
    gestorApiService: GestorApiService = inject(GestorApiService);
    router: Router = inject(Router);
    datosSimbolos: DatosActivo[] | null = null;
    esPaginaFavoritos: boolean = false;

    constructor() {
        this.actualizarDatosSimbolos();
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.actualizarDatosSimbolos();
            }
        });
    }

    private actualizarDatosSimbolos() {
        const url = this.router.url;
        if (url === '/activos/favoritos') {
            this.datosSimbolos = this.gestorApiService.datosSimbolosFavoritos();
            this.esPaginaFavoritos = true;
            return;
        }
        this.datosSimbolos = this.gestorApiService.obtenerDatosSimbolos();
        this.esPaginaFavoritos = false;
    }
}
