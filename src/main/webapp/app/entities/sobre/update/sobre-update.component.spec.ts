import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { SobreService } from '../service/sobre.service';
import { ISobre } from '../sobre.model';
import { SobreFormService } from './sobre-form.service';

import { SobreUpdateComponent } from './sobre-update.component';

describe('Sobre Management Update Component', () => {
  let comp: SobreUpdateComponent;
  let fixture: ComponentFixture<SobreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sobreFormService: SobreFormService;
  let sobreService: SobreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SobreUpdateComponent],
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
      .overrideTemplate(SobreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SobreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sobreFormService = TestBed.inject(SobreFormService);
    sobreService = TestBed.inject(SobreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sobre: ISobre = { id: 456 };

      activatedRoute.data = of({ sobre });
      comp.ngOnInit();

      expect(comp.sobre).toEqual(sobre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISobre>>();
      const sobre = { id: 123 };
      jest.spyOn(sobreFormService, 'getSobre').mockReturnValue(sobre);
      jest.spyOn(sobreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sobre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sobre }));
      saveSubject.complete();

      // THEN
      expect(sobreFormService.getSobre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sobreService.update).toHaveBeenCalledWith(expect.objectContaining(sobre));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISobre>>();
      const sobre = { id: 123 };
      jest.spyOn(sobreFormService, 'getSobre').mockReturnValue({ id: null });
      jest.spyOn(sobreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sobre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sobre }));
      saveSubject.complete();

      // THEN
      expect(sobreFormService.getSobre).toHaveBeenCalled();
      expect(sobreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISobre>>();
      const sobre = { id: 123 };
      jest.spyOn(sobreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sobre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sobreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
