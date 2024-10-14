import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';
import { EstabelecimentoService } from 'app/entities/estabelecimento/service/estabelecimento.service';
import { IPontoAcesso } from '../ponto-acesso.model';
import { PontoAcessoService } from '../service/ponto-acesso.service';
import { PontoAcessoFormGroup, PontoAcessoFormService } from './ponto-acesso-form.service';

@Component({
  standalone: true,
  selector: 'jhi-ponto-acesso-update',
  templateUrl: './ponto-acesso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PontoAcessoUpdateComponent implements OnInit {
  isSaving = false;
  pontoAcesso: IPontoAcesso | null = null;

  estabelecimentosSharedCollection: IEstabelecimento[] = [];

  protected pontoAcessoService = inject(PontoAcessoService);
  protected pontoAcessoFormService = inject(PontoAcessoFormService);
  protected estabelecimentoService = inject(EstabelecimentoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PontoAcessoFormGroup = this.pontoAcessoFormService.createPontoAcessoFormGroup();

  compareEstabelecimento = (o1: IEstabelecimento | null, o2: IEstabelecimento | null): boolean =>
    this.estabelecimentoService.compareEstabelecimento(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pontoAcesso }) => {
      this.pontoAcesso = pontoAcesso;
      if (pontoAcesso) {
        this.updateForm(pontoAcesso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pontoAcesso = this.pontoAcessoFormService.getPontoAcesso(this.editForm);
    if (pontoAcesso.id !== null) {
      this.subscribeToSaveResponse(this.pontoAcessoService.update(pontoAcesso));
    } else {
      this.subscribeToSaveResponse(this.pontoAcessoService.create(pontoAcesso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPontoAcesso>>): void {
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

  protected updateForm(pontoAcesso: IPontoAcesso): void {
    this.pontoAcesso = pontoAcesso;
    this.pontoAcessoFormService.resetForm(this.editForm, pontoAcesso);

    this.estabelecimentosSharedCollection = this.estabelecimentoService.addEstabelecimentoToCollectionIfMissing<IEstabelecimento>(
      this.estabelecimentosSharedCollection,
      pontoAcesso.estabelecimento,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estabelecimentoService
      .query()
      .pipe(map((res: HttpResponse<IEstabelecimento[]>) => res.body ?? []))
      .pipe(
        map((estabelecimentos: IEstabelecimento[]) =>
          this.estabelecimentoService.addEstabelecimentoToCollectionIfMissing<IEstabelecimento>(
            estabelecimentos,
            this.pontoAcesso?.estabelecimento,
          ),
        ),
      )
      .subscribe((estabelecimentos: IEstabelecimento[]) => (this.estabelecimentosSharedCollection = estabelecimentos));
  }
}
