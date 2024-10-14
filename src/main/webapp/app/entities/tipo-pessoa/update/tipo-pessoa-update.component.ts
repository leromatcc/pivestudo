import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClassificaPessoa } from 'app/entities/enumerations/classifica-pessoa.model';
import { ITipoPessoa } from '../tipo-pessoa.model';
import { TipoPessoaService } from '../service/tipo-pessoa.service';
import { TipoPessoaFormGroup, TipoPessoaFormService } from './tipo-pessoa-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tipo-pessoa-update',
  templateUrl: './tipo-pessoa-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TipoPessoaUpdateComponent implements OnInit {
  isSaving = false;
  tipoPessoa: ITipoPessoa | null = null;
  classificaPessoaValues = Object.keys(ClassificaPessoa);

  protected tipoPessoaService = inject(TipoPessoaService);
  protected tipoPessoaFormService = inject(TipoPessoaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TipoPessoaFormGroup = this.tipoPessoaFormService.createTipoPessoaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoPessoa }) => {
      this.tipoPessoa = tipoPessoa;
      if (tipoPessoa) {
        this.updateForm(tipoPessoa);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoPessoa = this.tipoPessoaFormService.getTipoPessoa(this.editForm);
    if (tipoPessoa.id !== null) {
      this.subscribeToSaveResponse(this.tipoPessoaService.update(tipoPessoa));
    } else {
      this.subscribeToSaveResponse(this.tipoPessoaService.create(tipoPessoa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoPessoa>>): void {
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

  protected updateForm(tipoPessoa: ITipoPessoa): void {
    this.tipoPessoa = tipoPessoa;
    this.tipoPessoaFormService.resetForm(this.editForm, tipoPessoa);
  }
}
