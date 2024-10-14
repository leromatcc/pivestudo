import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';

@Component({
  standalone: true,
  selector: 'jhi-lote-bloco-apartamento-detail',
  templateUrl: './lote-bloco-apartamento-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LoteBlocoApartamentoDetailComponent {
  loteBlocoApartamento = input<ILoteBlocoApartamento | null>(null);

  previousState(): void {
    window.history.back();
  }
}
