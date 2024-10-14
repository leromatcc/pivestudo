import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IImagem } from '../imagem.model';

@Component({
  standalone: true,
  selector: 'jhi-imagem-detail',
  templateUrl: './imagem-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ImagemDetailComponent {
  imagem = input<IImagem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
