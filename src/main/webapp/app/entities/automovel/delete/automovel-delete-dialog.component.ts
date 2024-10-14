import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAutomovel } from '../automovel.model';
import { AutomovelService } from '../service/automovel.service';

@Component({
  standalone: true,
  templateUrl: './automovel-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AutomovelDeleteDialogComponent {
  automovel?: IAutomovel;

  protected automovelService = inject(AutomovelService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.automovelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
