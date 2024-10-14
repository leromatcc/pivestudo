import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITipoAutomovel } from 'app/entities/tipo-automovel/tipo-automovel.model';
import { TipoAutomovelService } from 'app/entities/tipo-automovel/service/tipo-automovel.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { AutomovelService } from '../service/automovel.service';
import { IAutomovel } from '../automovel.model';
import { AutomovelFormGroup, AutomovelFormService } from './automovel-form.service';

@Component({
  standalone: true,
  selector: 'jhi-automovel-update',
  templateUrl: './automovel-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AutomovelUpdateComponent implements OnInit {
  isSaving = false;
  automovel: IAutomovel | null = null;

  tipoAutomovelsSharedCollection: ITipoAutomovel[] = [];
  pessoasSharedCollection: IPessoa[] = [];

  protected automovelService = inject(AutomovelService);
  protected automovelFormService = inject(AutomovelFormService);
  protected tipoAutomovelService = inject(TipoAutomovelService);
  protected pessoaService = inject(PessoaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AutomovelFormGroup = this.automovelFormService.createAutomovelFormGroup();

  compareTipoAutomovel = (o1: ITipoAutomovel | null, o2: ITipoAutomovel | null): boolean =>
    this.tipoAutomovelService.compareTipoAutomovel(o1, o2);

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ automovel }) => {
      this.automovel = automovel;
      if (automovel) {
        this.updateForm(automovel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const automovel = this.automovelFormService.getAutomovel(this.editForm);
    if (automovel.id !== null) {
      this.subscribeToSaveResponse(this.automovelService.update(automovel));
    } else {
      this.subscribeToSaveResponse(this.automovelService.create(automovel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAutomovel>>): void {
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

  protected updateForm(automovel: IAutomovel): void {
    this.automovel = automovel;
    this.automovelFormService.resetForm(this.editForm, automovel);

    this.tipoAutomovelsSharedCollection = this.tipoAutomovelService.addTipoAutomovelToCollectionIfMissing<ITipoAutomovel>(
      this.tipoAutomovelsSharedCollection,
      automovel.tipoAutomovel,
    );
    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      automovel.pessoa,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tipoAutomovelService
      .query()
      .pipe(map((res: HttpResponse<ITipoAutomovel[]>) => res.body ?? []))
      .pipe(
        map((tipoAutomovels: ITipoAutomovel[]) =>
          this.tipoAutomovelService.addTipoAutomovelToCollectionIfMissing<ITipoAutomovel>(tipoAutomovels, this.automovel?.tipoAutomovel),
        ),
      )
      .subscribe((tipoAutomovels: ITipoAutomovel[]) => (this.tipoAutomovelsSharedCollection = tipoAutomovels));

    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.automovel?.pessoa)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));
  }
}
