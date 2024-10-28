import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { OperacaoService } from '../service/operacao.service';
import { IOperacao } from '../operacao.model';
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

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected operacaoService = inject(OperacaoService);
  protected operacaoFormService = inject(OperacaoFormService);
  protected elementRef = inject(ElementRef);
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('pivestudoApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector(`#${idInput}`)) {
      this.elementRef.nativeElement.querySelector(`#${idInput}`).value = null;
    }
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
