import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IRegistroAcesso } from '../registro-acesso.model';

@Component({
  standalone: true,
  selector: 'jhi-registro-acesso-detail',
  templateUrl: './registro-acesso-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class RegistroAcessoDetailComponent {
  registroAcesso = input<IRegistroAcesso | null>(null);

  previousState(): void {
    window.history.back();
  }
}
