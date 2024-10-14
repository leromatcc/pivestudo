import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import { LoteBlocoApartamentoService } from '../service/lote-bloco-apartamento.service';

@Component({
  standalone: true,
  templateUrl: './lote-bloco-apartamento-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LoteBlocoApartamentoDeleteDialogComponent {
  loteBlocoApartamento?: ILoteBlocoApartamento;

  protected loteBlocoApartamentoService = inject(LoteBlocoApartamentoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.loteBlocoApartamentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
