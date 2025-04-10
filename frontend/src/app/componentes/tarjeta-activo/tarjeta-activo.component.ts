import {Component, computed, inject, Input} from '@angular/core';
import {DatosActivo} from "../../interfaces/datosActivo";
import {Router} from '@angular/router';
import {GestorApiService} from "../../servicios/gestor-api.service";
import {ButtonFavoritoComponent} from '../button-favorito/button-favorito.component';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-tarjeta-activo',
    templateUrl: './tarjeta-activo.component.html',
    styleUrl: './tarjeta-activo.component.css',
    standalone: true,
    imports: [ButtonFavoritoComponent, CommonModule]
})
export class TarjetaActivoComponent {
    @Input() datosActivo!: DatosActivo;
    @Input() mostrarCantidad: boolean = false;
    gestorApiService: GestorApiService = inject(GestorApiService);
    monedaFiat = computed(() => this.gestorApiService.monedaFiat());

    constructor(private router: Router) {
    }

    verDetalleActivo() {
        const activo = this.datosActivo.symbol.replaceAll('/', '-');
        this.router.navigate(["/activo", activo]);
    }

    esFavorito(): boolean {
        return this.gestorApiService.esSimboloFavorito(this.datosActivo.symbol);
    }

    obtenerCantidadFavorito(): number | undefined {
        return this.gestorApiService.obtenerCantidadFavorito(this.datosActivo.symbol);
    }
}
