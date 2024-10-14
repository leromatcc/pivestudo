import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPontoAcesso } from '../ponto-acesso.model';
import { PontoAcessoService } from '../service/ponto-acesso.service';

@Component({
  standalone: true,
  templateUrl: './ponto-acesso-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PontoAcessoDeleteDialogComponent {
  pontoAcesso?: IPontoAcesso;

  protected pontoAcessoService = inject(PontoAcessoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.pontoAcessoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
