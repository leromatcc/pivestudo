import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IEndereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';
import { EnderecoFormGroup, EnderecoFormService } from './endereco-form.service';

@Component({
  standalone: true,
  selector: 'jhi-endereco-update',
  templateUrl: './endereco-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EnderecoUpdateComponent implements OnInit {
  isSaving = false;
  endereco: IEndereco | null = null;

  pessoasSharedCollection: IPessoa[] = [];

  protected enderecoService = inject(EnderecoService);
  protected enderecoFormService = inject(EnderecoFormService);
  protected pessoaService = inject(PessoaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EnderecoFormGroup = this.enderecoFormService.createEnderecoFormGroup();

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ endereco }) => {
      this.endereco = endereco;
      if (endereco) {
        this.updateForm(endereco);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const endereco = this.enderecoFormService.getEndereco(this.editForm);
    if (endereco.id !== null) {
      this.subscribeToSaveResponse(this.enderecoService.update(endereco));
    } else {
      this.subscribeToSaveResponse(this.enderecoService.create(endereco));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEndereco>>): void {
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

  protected updateForm(endereco: IEndereco): void {
    this.endereco = endereco;
    this.enderecoFormService.resetForm(this.editForm, endereco);

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      endereco.pessoa,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.endereco?.pessoa)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));
  }
}
