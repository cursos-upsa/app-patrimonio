import {Component, computed, inject, signal} from '@angular/core';
import {GestorApiService} from "../../servicios/gestor-api.service";
import {EstadoMercado} from "../../interfaces/estadoMercado";

@Component({
    selector: 'app-estado-mercado',
    imports: [],
    templateUrl: './estado-mercado.component.html',
    styleUrl: './estado-mercado.component.css'
})
export class EstadoMercadoComponent {
    gestorApiService = inject(GestorApiService);
    idIntervalo: any = null;

    estadoMercado = signal<EstadoMercado | null>(null);
    tiempoMercado = signal<number>(0);

    nombreMercadoString = computed(() => {
        if (!this.estadoMercado()) return '';
        return this.estadoMercado()?.name;
    });
    estadoMercadoString = computed(() => {
        if (!this.estadoMercado()) return '';
        return this.estadoMercado()?.is_market_open ? 'abierto' : 'cerrado';
    });
    siguienteEventoString = computed(() => {
        if (!this.estadoMercado()) return '';
        return this.estadoMercado()?.is_market_open ? 'Cerrará' : 'Abrirá';
    });
    tiempoMercadoString = computed(() => {
        if (!this.estadoMercado()) return '';
        return this.formatearTiempo(this.tiempoMercado());
    });

    obtenerEstadoMercado() {
        this.gestorApiService.obtenerEstadoMercado().subscribe({
            next: (estadoMercado) => {
                this.estadoMercado.set(estadoMercado);

                this.actualizarTiempo(
                    estadoMercado.is_market_open ?
                        estadoMercado.time_to_close :
                        estadoMercado.time_to_open
                );
            },
            error: (error) => {
                console.error(`Error al obtener el estado del mercado:`, error);
            }
        });
    }

    private actualizarTiempo(tiempoStr: string) {
        const [horas, minutos, segundos] = tiempoStr.split(':').map(Number);
        const segundosTotales = horas * 3600 + minutos * 60 + segundos;

        this.tiempoMercado.set(segundosTotales);
        this.iniciarCuentaRegresiva();
    }

    private iniciarCuentaRegresiva() {
        if (this.idIntervalo) {
            clearInterval(this.idIntervalo);
        }
        this.idIntervalo = setInterval(() => {
            if (this.tiempoMercado() > 0) {
                this.tiempoMercado.update((valor) => valor - 1);
                return;
            }
            // Cuando el tiempo se acaba, se vuelve a llamar
            // a la API para obtener el nuevo estado del mercado.
            clearInterval(this.idIntervalo);
            this.obtenerEstadoMercado();
        }, 1000);
    }

    private formatearTiempo(tiempoEnSegundos: number): string {
        const horas = Math.floor(tiempoEnSegundos / 3600).toString().padStart(2, '0');
        const minutos = Math.floor((tiempoEnSegundos % 3600) / 60).toString().padStart(2, '0');
        const segundos = (tiempoEnSegundos % 60).toString().padStart(2, '0');

        return `${horas}:${minutos}:${segundos}`;
    }
}
