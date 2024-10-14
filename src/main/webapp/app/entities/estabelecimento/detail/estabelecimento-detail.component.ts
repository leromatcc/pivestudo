import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEstabelecimento } from '../estabelecimento.model';

@Component({
  standalone: true,
  selector: 'jhi-estabelecimento-detail',
  templateUrl: './estabelecimento-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EstabelecimentoDetailComponent {
  estabelecimento = input<IEstabelecimento | null>(null);

  previousState(): void {
    window.history.back();
  }
}
