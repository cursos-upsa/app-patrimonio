import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {GestorApiService} from '../../servicios/gestor-api.service';

@Component({
    selector: 'app-cambio-tema',
    templateUrl: './cambio-tema.component.html',
    styleUrl: './cambio-tema.component.css',
    standalone: true,
    imports: [ReactiveFormsModule]
})
export class CambioTemaComponent implements OnInit {
    gestorApiService = inject(GestorApiService);

    form!: FormGroup;
    fb = inject(FormBuilder);

    tema = this.gestorApiService.tema;

    ngOnInit() {
        this.form = this.fb.group({
            tema: [this.tema()]
        });
        
        this.form.get('tema')?.valueChanges.subscribe((tema) => {
            this.tema.set(tema);
        });
    }
}