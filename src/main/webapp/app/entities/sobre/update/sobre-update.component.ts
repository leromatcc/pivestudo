import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISobre } from '../sobre.model';
import { SobreService } from '../service/sobre.service';
import { SobreFormGroup, SobreFormService } from './sobre-form.service';

@Component({
  standalone: true,
  selector: 'jhi-sobre-update',
  templateUrl: './sobre-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SobreUpdateComponent implements OnInit {
  isSaving = false;
  sobre: ISobre | null = null;

  protected sobreService = inject(SobreService);
  protected sobreFormService = inject(SobreFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SobreFormGroup = this.sobreFormService.createSobreFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sobre }) => {
      this.sobre = sobre;
      if (sobre) {
        this.updateForm(sobre);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sobre = this.sobreFormService.getSobre(this.editForm);
    if (sobre.id !== null) {
      this.subscribeToSaveResponse(this.sobreService.update(sobre));
    } else {
      this.subscribeToSaveResponse(this.sobreService.create(sobre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISobre>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(sobre: ISobre): void {
    this.sobre = sobre;
    this.sobreFormService.resetForm(this.editForm, sobre);
  }
}
