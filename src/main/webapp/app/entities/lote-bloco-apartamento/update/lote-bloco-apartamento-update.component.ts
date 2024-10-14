import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { LoteBlocoApartamentoService } from '../service/lote-bloco-apartamento.service';
import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import { LoteBlocoApartamentoFormGroup, LoteBlocoApartamentoFormService } from './lote-bloco-apartamento-form.service';

@Component({
  standalone: true,
  selector: 'jhi-lote-bloco-apartamento-update',
  templateUrl: './lote-bloco-apartamento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LoteBlocoApartamentoUpdateComponent implements OnInit {
  isSaving = false;
  loteBlocoApartamento: ILoteBlocoApartamento | null = null;

  enderecosSharedCollection: IEndereco[] = [];
  pessoasSharedCollection: IPessoa[] = [];

  protected loteBlocoApartamentoService = inject(LoteBlocoApartamentoService);
  protected loteBlocoApartamentoFormService = inject(LoteBlocoApartamentoFormService);
  protected enderecoService = inject(EnderecoService);
  protected pessoaService = inject(PessoaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LoteBlocoApartamentoFormGroup = this.loteBlocoApartamentoFormService.createLoteBlocoApartamentoFormGroup();

  compareEndereco = (o1: IEndereco | null, o2: IEndereco | null): boolean => this.enderecoService.compareEndereco(o1, o2);

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loteBlocoApartamento }) => {
      this.loteBlocoApartamento = loteBlocoApartamento;
      if (loteBlocoApartamento) {
        this.updateForm(loteBlocoApartamento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loteBlocoApartamento = this.loteBlocoApartamentoFormService.getLoteBlocoApartamento(this.editForm);
    if (loteBlocoApartamento.id !== null) {
      this.subscribeToSaveResponse(this.loteBlocoApartamentoService.update(loteBlocoApartamento));
    } else {
      this.subscribeToSaveResponse(this.loteBlocoApartamentoService.create(loteBlocoApartamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoteBlocoApartamento>>): void {
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

  protected updateForm(loteBlocoApartamento: ILoteBlocoApartamento): void {
    this.loteBlocoApartamento = loteBlocoApartamento;
    this.loteBlocoApartamentoFormService.resetForm(this.editForm, loteBlocoApartamento);

    this.enderecosSharedCollection = this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(
      this.enderecosSharedCollection,
      loteBlocoApartamento.endereco,
    );
    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      loteBlocoApartamento.pessoa,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query()
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(enderecos, this.loteBlocoApartamento?.endereco),
        ),
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosSharedCollection = enderecos));

    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(
        map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.loteBlocoApartamento?.pessoa)),
      )
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));
  }
}
