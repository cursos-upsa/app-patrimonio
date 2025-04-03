import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {GestorApiService} from '../../servicios/gestor-api.service';

@Component({
    selector: 'app-cambio-moneda',
    templateUrl: './cambio-moneda.component.html',
    styleUrl: './cambio-moneda.component.css',
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class CambioMonedaComponent implements OnInit {
    gestorApiService = inject(GestorApiService);

    form!: FormGroup;
    fb = inject(FormBuilder);

    monedaFiat = this.gestorApiService.monedaFiat;

    ngOnInit() {
        this.form = this.fb.group({
            moneda: [this.monedaFiat()]
        });
        
        this.form.get('moneda')?.valueChanges.subscribe((moneda) => {
            this.monedaFiat.set(moneda);
        });
    }
}