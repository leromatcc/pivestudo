import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { IEstabelecimento } from '../estabelecimento.model';
import { EstabelecimentoService } from '../service/estabelecimento.service';
import { EstabelecimentoFormGroup, EstabelecimentoFormService } from './estabelecimento-form.service';

@Component({
  standalone: true,
  selector: 'jhi-estabelecimento-update',
  templateUrl: './estabelecimento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstabelecimentoUpdateComponent implements OnInit {
  isSaving = false;
  estabelecimento: IEstabelecimento | null = null;

  enderecosSharedCollection: IEndereco[] = [];

  protected estabelecimentoService = inject(EstabelecimentoService);
  protected estabelecimentoFormService = inject(EstabelecimentoFormService);
  protected enderecoService = inject(EnderecoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EstabelecimentoFormGroup = this.estabelecimentoFormService.createEstabelecimentoFormGroup();

  compareEndereco = (o1: IEndereco | null, o2: IEndereco | null): boolean => this.enderecoService.compareEndereco(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estabelecimento }) => {
      this.estabelecimento = estabelecimento;
      if (estabelecimento) {
        this.updateForm(estabelecimento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estabelecimento = this.estabelecimentoFormService.getEstabelecimento(this.editForm);
    if (estabelecimento.id !== null) {
      this.subscribeToSaveResponse(this.estabelecimentoService.update(estabelecimento));
    } else {
      this.subscribeToSaveResponse(this.estabelecimentoService.create(estabelecimento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstabelecimento>>): void {
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

  protected updateForm(estabelecimento: IEstabelecimento): void {
    this.estabelecimento = estabelecimento;
    this.estabelecimentoFormService.resetForm(this.editForm, estabelecimento);

    this.enderecosSharedCollection = this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(
      this.enderecosSharedCollection,
      estabelecimento.endereco,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query()
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(enderecos, this.estabelecimento?.endereco),
        ),
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosSharedCollection = enderecos));
  }
}
