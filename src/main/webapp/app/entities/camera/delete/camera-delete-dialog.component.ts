import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICamera } from '../camera.model';
import { CameraService } from '../service/camera.service';

@Component({
  standalone: true,
  templateUrl: './camera-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CameraDeleteDialogComponent {
  camera?: ICamera;

  protected cameraService = inject(CameraService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cameraService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
