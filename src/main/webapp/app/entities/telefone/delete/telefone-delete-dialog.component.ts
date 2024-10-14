import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITelefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';

@Component({
  standalone: true,
  templateUrl: './telefone-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TelefoneDeleteDialogComponent {
  telefone?: ITelefone;

  protected telefoneService = inject(TelefoneService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.telefoneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
