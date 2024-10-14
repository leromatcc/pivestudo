import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TipoPessoaService } from '../service/tipo-pessoa.service';
import { ITipoPessoa } from '../tipo-pessoa.model';
import { TipoPessoaFormService } from './tipo-pessoa-form.service';

import { TipoPessoaUpdateComponent } from './tipo-pessoa-update.component';

describe('TipoPessoa Management Update Component', () => {
  let comp: TipoPessoaUpdateComponent;
  let fixture: ComponentFixture<TipoPessoaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoPessoaFormService: TipoPessoaFormService;
  let tipoPessoaService: TipoPessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TipoPessoaUpdateComponent],
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
      .overrideTemplate(TipoPessoaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoPessoaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoPessoaFormService = TestBed.inject(TipoPessoaFormService);
    tipoPessoaService = TestBed.inject(TipoPessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoPessoa: ITipoPessoa = { id: 456 };

      activatedRoute.data = of({ tipoPessoa });
      comp.ngOnInit();

      expect(comp.tipoPessoa).toEqual(tipoPessoa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoPessoa>>();
      const tipoPessoa = { id: 123 };
      jest.spyOn(tipoPessoaFormService, 'getTipoPessoa').mockReturnValue(tipoPessoa);
      jest.spyOn(tipoPessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoPessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoPessoa }));
      saveSubject.complete();

      // THEN
      expect(tipoPessoaFormService.getTipoPessoa).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoPessoaService.update).toHaveBeenCalledWith(expect.objectContaining(tipoPessoa));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoPessoa>>();
      const tipoPessoa = { id: 123 };
      jest.spyOn(tipoPessoaFormService, 'getTipoPessoa').mockReturnValue({ id: null });
      jest.spyOn(tipoPessoaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoPessoa: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoPessoa }));
      saveSubject.complete();

      // THEN
      expect(tipoPessoaFormService.getTipoPessoa).toHaveBeenCalled();
      expect(tipoPessoaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoPessoa>>();
      const tipoPessoa = { id: 123 };
      jest.spyOn(tipoPessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoPessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoPessoaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
