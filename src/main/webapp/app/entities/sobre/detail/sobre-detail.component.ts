import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ISobre } from '../sobre.model';

@Component({
  standalone: true,
  selector: 'jhi-sobre-detail',
  templateUrl: './sobre-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SobreDetailComponent {
  sobre = input<ISobre | null>(null);

  previousState(): void {
    window.history.back();
  }
}
