import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEndereco } from '../endereco.model';

@Component({
  standalone: true,
  selector: 'jhi-endereco-detail',
  templateUrl: './endereco-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EnderecoDetailComponent {
  endereco = input<IEndereco | null>(null);

  previousState(): void {
    window.history.back();
  }
}
