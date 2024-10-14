import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TipoAutomovelService } from '../service/tipo-automovel.service';
import { ITipoAutomovel } from '../tipo-automovel.model';
import { TipoAutomovelFormService } from './tipo-automovel-form.service';

import { TipoAutomovelUpdateComponent } from './tipo-automovel-update.component';

describe('TipoAutomovel Management Update Component', () => {
  let comp: TipoAutomovelUpdateComponent;
  let fixture: ComponentFixture<TipoAutomovelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoAutomovelFormService: TipoAutomovelFormService;
  let tipoAutomovelService: TipoAutomovelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TipoAutomovelUpdateComponent],
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
      .overrideTemplate(TipoAutomovelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoAutomovelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoAutomovelFormService = TestBed.inject(TipoAutomovelFormService);
    tipoAutomovelService = TestBed.inject(TipoAutomovelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoAutomovel: ITipoAutomovel = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ tipoAutomovel });
      comp.ngOnInit();

      expect(comp.tipoAutomovel).toEqual(tipoAutomovel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAutomovel>>();
      const tipoAutomovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(tipoAutomovelFormService, 'getTipoAutomovel').mockReturnValue(tipoAutomovel);
      jest.spyOn(tipoAutomovelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAutomovel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoAutomovel }));
      saveSubject.complete();

      // THEN
      expect(tipoAutomovelFormService.getTipoAutomovel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoAutomovelService.update).toHaveBeenCalledWith(expect.objectContaining(tipoAutomovel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAutomovel>>();
      const tipoAutomovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(tipoAutomovelFormService, 'getTipoAutomovel').mockReturnValue({ id: null });
      jest.spyOn(tipoAutomovelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAutomovel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoAutomovel }));
      saveSubject.complete();

      // THEN
      expect(tipoAutomovelFormService.getTipoAutomovel).toHaveBeenCalled();
      expect(tipoAutomovelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoAutomovel>>();
      const tipoAutomovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(tipoAutomovelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoAutomovel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoAutomovelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
