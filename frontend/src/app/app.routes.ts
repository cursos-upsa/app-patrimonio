import { Routes } from '@angular/router';
import {DashboardComponent} from "./paginas/dashboard/dashboard.component";
import {ActivoComponent} from "./paginas/activo/activo.component";

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'activo/:simbolo', component: ActivoComponent},

    {path: '**', redirectTo: ''}
];