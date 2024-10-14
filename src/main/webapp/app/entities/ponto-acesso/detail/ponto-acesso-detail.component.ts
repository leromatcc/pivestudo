import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPontoAcesso } from '../ponto-acesso.model';

@Component({
  standalone: true,
  selector: 'jhi-ponto-acesso-detail',
  templateUrl: './ponto-acesso-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PontoAcessoDetailComponent {
  pontoAcesso = input<IPontoAcesso | null>(null);

  previousState(): void {
    window.history.back();
  }
}
