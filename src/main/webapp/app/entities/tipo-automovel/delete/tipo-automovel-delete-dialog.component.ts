import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITipoAutomovel } from '../tipo-automovel.model';
import { TipoAutomovelService } from '../service/tipo-automovel.service';

@Component({
  standalone: true,
  templateUrl: './tipo-automovel-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TipoAutomovelDeleteDialogComponent {
  tipoAutomovel?: ITipoAutomovel;

  protected tipoAutomovelService = inject(TipoAutomovelService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.tipoAutomovelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
