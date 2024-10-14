import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRegistroAcesso } from '../registro-acesso.model';
import { RegistroAcessoService } from '../service/registro-acesso.service';

@Component({
  standalone: true,
  templateUrl: './registro-acesso-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RegistroAcessoDeleteDialogComponent {
  registroAcesso?: IRegistroAcesso;

  protected registroAcessoService = inject(RegistroAcessoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.registroAcessoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
