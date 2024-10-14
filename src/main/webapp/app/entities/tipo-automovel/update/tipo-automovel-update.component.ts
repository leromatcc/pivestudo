import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClassificaAutomovel } from 'app/entities/enumerations/classifica-automovel.model';
import { ITipoAutomovel } from '../tipo-automovel.model';
import { TipoAutomovelService } from '../service/tipo-automovel.service';
import { TipoAutomovelFormGroup, TipoAutomovelFormService } from './tipo-automovel-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tipo-automovel-update',
  templateUrl: './tipo-automovel-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TipoAutomovelUpdateComponent implements OnInit {
  isSaving = false;
  tipoAutomovel: ITipoAutomovel | null = null;
  classificaAutomovelValues = Object.keys(ClassificaAutomovel);

  protected tipoAutomovelService = inject(TipoAutomovelService);
  protected tipoAutomovelFormService = inject(TipoAutomovelFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TipoAutomovelFormGroup = this.tipoAutomovelFormService.createTipoAutomovelFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoAutomovel }) => {
      this.tipoAutomovel = tipoAutomovel;
      if (tipoAutomovel) {
        this.updateForm(tipoAutomovel);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoAutomovel = this.tipoAutomovelFormService.getTipoAutomovel(this.editForm);
    if (tipoAutomovel.id !== null) {
      this.subscribeToSaveResponse(this.tipoAutomovelService.update(tipoAutomovel));
    } else {
      this.subscribeToSaveResponse(this.tipoAutomovelService.create(tipoAutomovel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoAutomovel>>): void {
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

  protected updateForm(tipoAutomovel: ITipoAutomovel): void {
    this.tipoAutomovel = tipoAutomovel;
    this.tipoAutomovelFormService.resetForm(this.editForm, tipoAutomovel);
  }
}
