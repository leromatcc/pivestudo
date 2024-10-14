import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';

@Component({
  standalone: true,
  selector: 'jhi-autorizacao-acesso-detail',
  templateUrl: './autorizacao-acesso-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AutorizacaoAcessoDetailComponent {
  autorizacaoAcesso = input<IAutorizacaoAcesso | null>(null);

  previousState(): void {
    window.history.back();
  }
}
