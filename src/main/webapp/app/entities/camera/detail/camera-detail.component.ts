import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ICamera } from '../camera.model';

@Component({
  standalone: true,
  selector: 'jhi-camera-detail',
  templateUrl: './camera-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CameraDetailComponent {
  camera = input<ICamera | null>(null);

  previousState(): void {
    window.history.back();
  }
}
