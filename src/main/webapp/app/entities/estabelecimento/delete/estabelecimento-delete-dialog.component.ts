import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEstabelecimento } from '../estabelecimento.model';
import { EstabelecimentoService } from '../service/estabelecimento.service';

@Component({
  standalone: true,
  templateUrl: './estabelecimento-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EstabelecimentoDeleteDialogComponent {
  estabelecimento?: IEstabelecimento;

  protected estabelecimentoService = inject(EstabelecimentoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.estabelecimentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
