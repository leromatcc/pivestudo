import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IRegistroAcesso } from 'app/entities/registro-acesso/registro-acesso.model';
import { RegistroAcessoService } from 'app/entities/registro-acesso/service/registro-acesso.service';
import { ImagemService } from '../service/imagem.service';
import { IImagem } from '../imagem.model';
import { ImagemFormGroup, ImagemFormService } from './imagem-form.service';

@Component({
  standalone: true,
  selector: 'jhi-imagem-update',
  templateUrl: './imagem-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ImagemUpdateComponent implements OnInit {
  isSaving = false;
  imagem: IImagem | null = null;

  registroAcessosCollection: IRegistroAcesso[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected imagemService = inject(ImagemService);
  protected imagemFormService = inject(ImagemFormService);
  protected registroAcessoService = inject(RegistroAcessoService);
  protected elementRef = inject(ElementRef);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ImagemFormGroup = this.imagemFormService.createImagemFormGroup();

  compareRegistroAcesso = (o1: IRegistroAcesso | null, o2: IRegistroAcesso | null): boolean =>
    this.registroAcessoService.compareRegistroAcesso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ imagem }) => {
      this.imagem = imagem;
      if (imagem) {
        this.updateForm(imagem);
      }

      this.loadRelationshipsOptions();
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
    const imagem = this.imagemFormService.getImagem(this.editForm);
    if (imagem.id !== null) {
      this.subscribeToSaveResponse(this.imagemService.update(imagem));
    } else {
      this.subscribeToSaveResponse(this.imagemService.create(imagem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImagem>>): void {
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

  protected updateForm(imagem: IImagem): void {
    this.imagem = imagem;
    this.imagemFormService.resetForm(this.editForm, imagem);

    this.registroAcessosCollection = this.registroAcessoService.addRegistroAcessoToCollectionIfMissing<IRegistroAcesso>(
      this.registroAcessosCollection,
      imagem.registroAcesso,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.registroAcessoService
      .query({ filter: 'imagem-is-null' })
      .pipe(map((res: HttpResponse<IRegistroAcesso[]>) => res.body ?? []))
      .pipe(
        map((registroAcessos: IRegistroAcesso[]) =>
          this.registroAcessoService.addRegistroAcessoToCollectionIfMissing<IRegistroAcesso>(registroAcessos, this.imagem?.registroAcesso),
        ),
      )
      .subscribe((registroAcessos: IRegistroAcesso[]) => (this.registroAcessosCollection = registroAcessos));
  }
}
