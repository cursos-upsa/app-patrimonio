import {Component, inject, Input} from '@angular/core';
import {GestorApiService} from '../../servicios/gestor-api.service';

@Component({
    selector: 'app-button-favorito',
    templateUrl: './button-favorito.component.html',
    styleUrl: './button-favorito.component.css',
    standalone: true
})
export class ButtonFavoritoComponent {
    @Input() symbol!: string;
    gestorApiService = inject(GestorApiService);

    alternarFavorito(event: Event) {
        event.stopPropagation();
        this.gestorApiService.alternarAgregarComoFavorito(this.symbol);
    }

    esFavorito(): boolean {
        return this.gestorApiService.esSimboloFavorito(this.symbol);
    }
}
