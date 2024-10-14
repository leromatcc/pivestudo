import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';
import { PontoAcessoService } from 'app/entities/ponto-acesso/service/ponto-acesso.service';
import { ICamera } from '../camera.model';
import { CameraService } from '../service/camera.service';
import { CameraFormGroup, CameraFormService } from './camera-form.service';

@Component({
  standalone: true,
  selector: 'jhi-camera-update',
  templateUrl: './camera-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CameraUpdateComponent implements OnInit {
  isSaving = false;
  camera: ICamera | null = null;

  pontoAcessosSharedCollection: IPontoAcesso[] = [];

  protected cameraService = inject(CameraService);
  protected cameraFormService = inject(CameraFormService);
  protected pontoAcessoService = inject(PontoAcessoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CameraFormGroup = this.cameraFormService.createCameraFormGroup();

  comparePontoAcesso = (o1: IPontoAcesso | null, o2: IPontoAcesso | null): boolean => this.pontoAcessoService.comparePontoAcesso(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ camera }) => {
      this.camera = camera;
      if (camera) {
        this.updateForm(camera);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const camera = this.cameraFormService.getCamera(this.editForm);
    if (camera.id !== null) {
      this.subscribeToSaveResponse(this.cameraService.update(camera));
    } else {
      this.subscribeToSaveResponse(this.cameraService.create(camera));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICamera>>): void {
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

  protected updateForm(camera: ICamera): void {
    this.camera = camera;
    this.cameraFormService.resetForm(this.editForm, camera);

    this.pontoAcessosSharedCollection = this.pontoAcessoService.addPontoAcessoToCollectionIfMissing<IPontoAcesso>(
      this.pontoAcessosSharedCollection,
      camera.pontoAcesso,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pontoAcessoService
      .query()
      .pipe(map((res: HttpResponse<IPontoAcesso[]>) => res.body ?? []))
      .pipe(
        map((pontoAcessos: IPontoAcesso[]) =>
          this.pontoAcessoService.addPontoAcessoToCollectionIfMissing<IPontoAcesso>(pontoAcessos, this.camera?.pontoAcesso),
        ),
      )
      .subscribe((pontoAcessos: IPontoAcesso[]) => (this.pontoAcessosSharedCollection = pontoAcessos));
  }
}
