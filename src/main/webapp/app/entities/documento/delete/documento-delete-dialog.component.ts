import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDocumento } from '../documento.model';
import { DocumentoService } from '../service/documento.service';

@Component({
  standalone: true,
  templateUrl: './documento-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DocumentoDeleteDialogComponent {
  documento?: IDocumento;

  protected documentoService = inject(DocumentoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.documentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
