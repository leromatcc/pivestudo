import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';
import { EstabelecimentoService } from 'app/entities/estabelecimento/service/estabelecimento.service';
import { StatusAutorizacao } from 'app/entities/enumerations/status-autorizacao.model';
import { AutorizacaoAcessoService } from '../service/autorizacao-acesso.service';
import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { AutorizacaoAcessoFormGroup, AutorizacaoAcessoFormService } from './autorizacao-acesso-form.service';

@Component({
  standalone: true,
  selector: 'jhi-autorizacao-acesso-update',
  templateUrl: './autorizacao-acesso-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AutorizacaoAcessoUpdateComponent implements OnInit {
  isSaving = false;
  autorizacaoAcesso: IAutorizacaoAcesso | null = null;
  statusAutorizacaoValues = Object.keys(StatusAutorizacao);

  pessoasSharedCollection: IPessoa[] = [];
  estabelecimentosSharedCollection: IEstabelecimento[] = [];

  protected autorizacaoAcessoService = inject(AutorizacaoAcessoService);
  protected autorizacaoAcessoFormService = inject(AutorizacaoAcessoFormService);
  protected pessoaService = inject(PessoaService);
  protected estabelecimentoService = inject(EstabelecimentoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AutorizacaoAcessoFormGroup = this.autorizacaoAcessoFormService.createAutorizacaoAcessoFormGroup();

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  compareEstabelecimento = (o1: IEstabelecimento | null, o2: IEstabelecimento | null): boolean =>
    this.estabelecimentoService.compareEstabelecimento(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ autorizacaoAcesso }) => {
      this.autorizacaoAcesso = autorizacaoAcesso;
      if (autorizacaoAcesso) {
        this.updateForm(autorizacaoAcesso);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const autorizacaoAcesso = this.autorizacaoAcessoFormService.getAutorizacaoAcesso(this.editForm);
    if (autorizacaoAcesso.id !== null) {
      this.subscribeToSaveResponse(this.autorizacaoAcessoService.update(autorizacaoAcesso));
    } else {
      this.subscribeToSaveResponse(this.autorizacaoAcessoService.create(autorizacaoAcesso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAutorizacaoAcesso>>): void {
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

  protected updateForm(autorizacaoAcesso: IAutorizacaoAcesso): void {
    this.autorizacaoAcesso = autorizacaoAcesso;
    this.autorizacaoAcessoFormService.resetForm(this.editForm, autorizacaoAcesso);

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      autorizacaoAcesso.pessoa,
    );
    this.estabelecimentosSharedCollection = this.estabelecimentoService.addEstabelecimentoToCollectionIfMissing<IEstabelecimento>(
      this.estabelecimentosSharedCollection,
      autorizacaoAcesso.estabelecimento,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(
        map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.autorizacaoAcesso?.pessoa)),
      )
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));

    this.estabelecimentoService
      .query()
      .pipe(map((res: HttpResponse<IEstabelecimento[]>) => res.body ?? []))
      .pipe(
        map((estabelecimentos: IEstabelecimento[]) =>
          this.estabelecimentoService.addEstabelecimentoToCollectionIfMissing<IEstabelecimento>(
            estabelecimentos,
            this.autorizacaoAcesso?.estabelecimento,
          ),
        ),
      )
      .subscribe((estabelecimentos: IEstabelecimento[]) => (this.estabelecimentosSharedCollection = estabelecimentos));
  }
}
