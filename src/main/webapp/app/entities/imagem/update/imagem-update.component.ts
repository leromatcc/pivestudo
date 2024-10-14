import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRegistroAcesso } from 'app/entities/registro-acesso/registro-acesso.model';
import { RegistroAcessoService } from 'app/entities/registro-acesso/service/registro-acesso.service';
import { IImagem } from '../imagem.model';
import { ImagemService } from '../service/imagem.service';
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

  protected imagemService = inject(ImagemService);
  protected imagemFormService = inject(ImagemFormService);
  protected registroAcessoService = inject(RegistroAcessoService);
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
