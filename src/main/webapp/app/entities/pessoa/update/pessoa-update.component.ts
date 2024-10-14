import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ITipoPessoa } from 'app/entities/tipo-pessoa/tipo-pessoa.model';
import { TipoPessoaService } from 'app/entities/tipo-pessoa/service/tipo-pessoa.service';
import { PessoaService } from '../service/pessoa.service';
import { IPessoa } from '../pessoa.model';
import { PessoaFormGroup, PessoaFormService } from './pessoa-form.service';

@Component({
  standalone: true,
  selector: 'jhi-pessoa-update',
  templateUrl: './pessoa-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PessoaUpdateComponent implements OnInit {
  isSaving = false;
  pessoa: IPessoa | null = null;

  usersSharedCollection: IUser[] = [];
  tipoPessoasCollection: ITipoPessoa[] = [];

  protected pessoaService = inject(PessoaService);
  protected pessoaFormService = inject(PessoaFormService);
  protected userService = inject(UserService);
  protected tipoPessoaService = inject(TipoPessoaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PessoaFormGroup = this.pessoaFormService.createPessoaFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareTipoPessoa = (o1: ITipoPessoa | null, o2: ITipoPessoa | null): boolean => this.tipoPessoaService.compareTipoPessoa(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pessoa }) => {
      this.pessoa = pessoa;
      if (pessoa) {
        this.updateForm(pessoa);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pessoa = this.pessoaFormService.getPessoa(this.editForm);
    if (pessoa.id !== null) {
      this.subscribeToSaveResponse(this.pessoaService.update(pessoa));
    } else {
      this.subscribeToSaveResponse(this.pessoaService.create(pessoa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPessoa>>): void {
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

  protected updateForm(pessoa: IPessoa): void {
    this.pessoa = pessoa;
    this.pessoaFormService.resetForm(this.editForm, pessoa);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, pessoa.user);
    this.tipoPessoasCollection = this.tipoPessoaService.addTipoPessoaToCollectionIfMissing<ITipoPessoa>(
      this.tipoPessoasCollection,
      pessoa.tipoPessoa,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.pessoa?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.tipoPessoaService
      .query({ filter: 'pessoa-is-null' })
      .pipe(map((res: HttpResponse<ITipoPessoa[]>) => res.body ?? []))
      .pipe(
        map((tipoPessoas: ITipoPessoa[]) =>
          this.tipoPessoaService.addTipoPessoaToCollectionIfMissing<ITipoPessoa>(tipoPessoas, this.pessoa?.tipoPessoa),
        ),
      )
      .subscribe((tipoPessoas: ITipoPessoa[]) => (this.tipoPessoasCollection = tipoPessoas));
  }
}
