import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {GestorApiService} from "../../servicios/gestor-api.service";

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
