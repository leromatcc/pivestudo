import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOperacao } from '../operacao.model';
import { OperacaoService } from '../service/operacao.service';
import { OperacaoFormGroup, OperacaoFormService } from './operacao-form.service';

@Component({
  standalone: true,
  selector: 'jhi-operacao-update',
  templateUrl: './operacao-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OperacaoUpdateComponent implements OnInit {
  isSaving = false;
  operacao: IOperacao | null = null;

  protected operacaoService = inject(OperacaoService);
  protected operacaoFormService = inject(OperacaoFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OperacaoFormGroup = this.operacaoFormService.createOperacaoFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operacao }) => {
      this.operacao = operacao;
      if (operacao) {
        this.updateForm(operacao);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operacao = this.operacaoFormService.getOperacao(this.editForm);
    if (operacao.id !== null) {
      this.subscribeToSaveResponse(this.operacaoService.update(operacao));
    } else {
      this.subscribeToSaveResponse(this.operacaoService.create(operacao));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperacao>>): void {
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

  protected updateForm(operacao: IOperacao): void {
    this.operacao = operacao;
    this.operacaoFormService.resetForm(this.editForm, operacao);
  }
}
