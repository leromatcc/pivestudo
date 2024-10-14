import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';
import { PontoAcessoService } from 'app/entities/ponto-acesso/service/ponto-acesso.service';
import { CameraService } from '../service/camera.service';
import { ICamera } from '../camera.model';
import { CameraFormService } from './camera-form.service';

import { CameraUpdateComponent } from './camera-update.component';

describe('Camera Management Update Component', () => {
  let comp: CameraUpdateComponent;
  let fixture: ComponentFixture<CameraUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cameraFormService: CameraFormService;
  let cameraService: CameraService;
  let pontoAcessoService: PontoAcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CameraUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CameraUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CameraUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cameraFormService = TestBed.inject(CameraFormService);
    cameraService = TestBed.inject(CameraService);
    pontoAcessoService = TestBed.inject(PontoAcessoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PontoAcesso query and add missing value', () => {
      const camera: ICamera = { id: 456 };
      const pontoAcesso: IPontoAcesso = { id: '4a8b69af-2e58-454b-a6de-72ddce617ad7' };
      camera.pontoAcesso = pontoAcesso;

      const pontoAcessoCollection: IPontoAcesso[] = [{ id: '4af701e4-5055-4d9e-bf98-1f2cc851ff3b' }];
      jest.spyOn(pontoAcessoService, 'query').mockReturnValue(of(new HttpResponse({ body: pontoAcessoCollection })));
      const additionalPontoAcessos = [pontoAcesso];
      const expectedCollection: IPontoAcesso[] = [...additionalPontoAcessos, ...pontoAcessoCollection];
      jest.spyOn(pontoAcessoService, 'addPontoAcessoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ camera });
      comp.ngOnInit();

      expect(pontoAcessoService.query).toHaveBeenCalled();
      expect(pontoAcessoService.addPontoAcessoToCollectionIfMissing).toHaveBeenCalledWith(
        pontoAcessoCollection,
        ...additionalPontoAcessos.map(expect.objectContaining),
      );
      expect(comp.pontoAcessosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const camera: ICamera = { id: 456 };
      const pontoAcesso: IPontoAcesso = { id: '7ac29016-6a3c-4bef-bdc0-7a5258539c90' };
      camera.pontoAcesso = pontoAcesso;

      activatedRoute.data = of({ camera });
      comp.ngOnInit();

      expect(comp.pontoAcessosSharedCollection).toContain(pontoAcesso);
      expect(comp.camera).toEqual(camera);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICamera>>();
      const camera = { id: 123 };
      jest.spyOn(cameraFormService, 'getCamera').mockReturnValue(camera);
      jest.spyOn(cameraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camera });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: camera }));
      saveSubject.complete();

      // THEN
      expect(cameraFormService.getCamera).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cameraService.update).toHaveBeenCalledWith(expect.objectContaining(camera));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICamera>>();
      const camera = { id: 123 };
      jest.spyOn(cameraFormService, 'getCamera').mockReturnValue({ id: null });
      jest.spyOn(cameraService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camera: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: camera }));
      saveSubject.complete();

      // THEN
      expect(cameraFormService.getCamera).toHaveBeenCalled();
      expect(cameraService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICamera>>();
      const camera = { id: 123 };
      jest.spyOn(cameraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ camera });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cameraService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePontoAcesso', () => {
      it('Should forward to pontoAcessoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(pontoAcessoService, 'comparePontoAcesso');
        comp.comparePontoAcesso(entity, entity2);
        expect(pontoAcessoService.comparePontoAcesso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
