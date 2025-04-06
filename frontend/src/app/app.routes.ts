import { Routes } from '@angular/router';
import {DashboardComponent} from "./paginas/dashboard/dashboard.component";
import {ActivoComponent} from "./paginas/activo/activo.component";
import {PreferenciasComponent} from "./paginas/preferencias/preferencias.component";

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'preferencias', component: PreferenciasComponent},
    {path: 'activo/:simbolo', component: ActivoComponent},

    {path: '**', redirectTo: ''}
];