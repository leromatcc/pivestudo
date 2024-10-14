import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITelefone } from '../telefone.model';

@Component({
  standalone: true,
  selector: 'jhi-telefone-detail',
  templateUrl: './telefone-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TelefoneDetailComponent {
  telefone = input<ITelefone | null>(null);

  previousState(): void {
    window.history.back();
  }
}
