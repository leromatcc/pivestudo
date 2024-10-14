import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { AutorizacaoAcessoService } from '../service/autorizacao-acesso.service';

@Component({
  standalone: true,
  templateUrl: './autorizacao-acesso-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AutorizacaoAcessoDeleteDialogComponent {
  autorizacaoAcesso?: IAutorizacaoAcesso;

  protected autorizacaoAcessoService = inject(AutorizacaoAcessoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.autorizacaoAcessoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
