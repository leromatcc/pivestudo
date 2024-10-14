import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';
import { PontoAcessoService } from 'app/entities/ponto-acesso/service/ponto-acesso.service';
import { IAutomovel } from 'app/entities/automovel/automovel.model';
import { AutomovelService } from 'app/entities/automovel/service/automovel.service';
import { IAutorizacaoAcesso } from 'app/entities/autorizacao-acesso/autorizacao-acesso.model';
import { AutorizacaoAcessoService } from 'app/entities/autorizacao-acesso/service/autorizacao-acesso.service';
import { TipoAcessoAutorizado } from 'app/entities/enumerations/tipo-acesso-autorizado.model';
import { RegistroAcessoService } from '../service/registro-acesso.service';
import { IRegistroAcesso } from '../registro-acesso.model';
import { RegistroAcessoFormGroup, RegistroAcessoFormService } from './registro-acesso-form.service';

@Component({
  standalone: true,
  selector: 'jhi-registro-acesso-update',
  templateUrl: './registro-acesso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RegistroAcessoUpdateComponent implements OnInit {
  isSaving = false;
  registroAcesso: IRegistroAcesso | null = null;
  tipoAcessoAutorizadoValues = Object.keys(TipoAcessoAutorizado);

  pontoAcessosSharedCollection: IPontoAcesso[] = [];
  automovelsSharedCollection: IAutomovel[] = [];
  autorizacaoAcessosSharedCollection: IAutorizacaoAcesso[] = [];

  protected registroAcessoService = inject(RegistroAcessoService);
  protected registroAcessoFormService = inject(RegistroAcessoFormService);
  protected pontoAcessoService = inject(PontoAcessoService);
  protected automovelService = inject(AutomovelService);
  protected autorizacaoAcessoService = inject(AutorizacaoAcessoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RegistroAcessoFormGroup = this.registroAcessoFormService.createRegistroAcessoFormGroup();

  comparePontoAcesso = (o1: IPontoAcesso | null, o2: IPontoAcesso | null): boolean => this.pontoAcessoService.comparePontoAcesso(o1, o2);

  compareAutomovel = (o1: IAutomovel | null, o2: IAutomovel | null): boolean => this.automovelService.compareAutomovel(o1, o2);

  compareAutorizacaoAcesso = (o1: IAutorizacaoAcesso | null, o2: IAutorizacaoAcesso | null): boolean =>
    this.autorizacaoAcessoService.compareAutorizacaoAcesso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroAcesso }) => {
      this.registroAcesso = registroAcesso;
      if (registroAcesso) {
        this.updateForm(registroAcesso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const registroAcesso = this.registroAcessoFormService.getRegistroAcesso(this.editForm);
    if (registroAcesso.id !== null) {
      this.subscribeToSaveResponse(this.registroAcessoService.update(registroAcesso));
    } else {
      this.subscribeToSaveResponse(this.registroAcessoService.create(registroAcesso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistroAcesso>>): void {
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

  protected updateForm(registroAcesso: IRegistroAcesso): void {
    this.registroAcesso = registroAcesso;
    this.registroAcessoFormService.resetForm(this.editForm, registroAcesso);

    this.pontoAcessosSharedCollection = this.pontoAcessoService.addPontoAcessoToCollectionIfMissing<IPontoAcesso>(
      this.pontoAcessosSharedCollection,
      registroAcesso.pontoAcesso,
    );
    this.automovelsSharedCollection = this.automovelService.addAutomovelToCollectionIfMissing<IAutomovel>(
      this.automovelsSharedCollection,
      registroAcesso.automovel,
    );
    this.autorizacaoAcessosSharedCollection = this.autorizacaoAcessoService.addAutorizacaoAcessoToCollectionIfMissing<IAutorizacaoAcesso>(
      this.autorizacaoAcessosSharedCollection,
      registroAcesso.autorizacaoAcesso,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pontoAcessoService
      .query()
      .pipe(map((res: HttpResponse<IPontoAcesso[]>) => res.body ?? []))
      .pipe(
        map((pontoAcessos: IPontoAcesso[]) =>
          this.pontoAcessoService.addPontoAcessoToCollectionIfMissing<IPontoAcesso>(pontoAcessos, this.registroAcesso?.pontoAcesso),
        ),
      )
      .subscribe((pontoAcessos: IPontoAcesso[]) => (this.pontoAcessosSharedCollection = pontoAcessos));

    this.automovelService
      .query()
      .pipe(map((res: HttpResponse<IAutomovel[]>) => res.body ?? []))
      .pipe(
        map((automovels: IAutomovel[]) =>
          this.automovelService.addAutomovelToCollectionIfMissing<IAutomovel>(automovels, this.registroAcesso?.automovel),
        ),
      )
      .subscribe((automovels: IAutomovel[]) => (this.automovelsSharedCollection = automovels));

    this.autorizacaoAcessoService
      .query()
      .pipe(map((res: HttpResponse<IAutorizacaoAcesso[]>) => res.body ?? []))
      .pipe(
        map((autorizacaoAcessos: IAutorizacaoAcesso[]) =>
          this.autorizacaoAcessoService.addAutorizacaoAcessoToCollectionIfMissing<IAutorizacaoAcesso>(
            autorizacaoAcessos,
            this.registroAcesso?.autorizacaoAcesso,
          ),
        ),
      )
      .subscribe((autorizacaoAcessos: IAutorizacaoAcesso[]) => (this.autorizacaoAcessosSharedCollection = autorizacaoAcessos));
  }
}
