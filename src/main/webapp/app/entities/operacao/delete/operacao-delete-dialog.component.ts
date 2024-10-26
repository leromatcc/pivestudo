import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOperacao } from '../operacao.model';
import { OperacaoService } from '../service/operacao.service';

@Component({
  standalone: true,
  templateUrl: './operacao-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OperacaoDeleteDialogComponent {
  operacao?: IOperacao;

  protected operacaoService = inject(OperacaoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operacaoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
