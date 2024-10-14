import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IAutomovel } from '../automovel.model';

@Component({
  standalone: true,
  selector: 'jhi-automovel-detail',
  templateUrl: './automovel-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AutomovelDetailComponent {
  automovel = input<IAutomovel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
