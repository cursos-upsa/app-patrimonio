import {Component, inject, Input} from '@angular/core';
import {GestorApiService} from '../../servicios/gestor-api.service';

@Component({
    selector: 'app-button-editar',
    templateUrl: './button-editar.component.html',
    styleUrl: './button-editar.component.css',
    standalone: true
})
export class ButtonEditarComponent {
    @Input() symbol!: string;
    gestorApiService = inject(GestorApiService);

    editarCantidad(event: Event) {
        event.stopPropagation();
        const cantidadActual = this.obtenerCantidadFavorito() || 0;
        const cantidadString = prompt("Introduce la nueva cantidad del activo:", cantidadActual.toString());

        if (cantidadString === null) {
            return;
        }

        const nuevaCantidad = Number(cantidadString);
        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            alert("Por favor, introduce una cantidad válida mayor que cero.");
            return;
        }

        this.gestorApiService.actualizarCantidadFavorito(this.symbol, nuevaCantidad);
    }

    obtenerCantidadFavorito(): number | undefined {
        return this.gestorApiService.obtenerCantidadFavorito(this.symbol);
    }
}