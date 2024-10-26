import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { OperacaoService } from '../service/operacao.service';
import { IOperacao } from '../operacao.model';
import { OperacaoFormService } from './operacao-form.service';

import { OperacaoUpdateComponent } from './operacao-update.component';

describe('Operacao Management Update Component', () => {
  let comp: OperacaoUpdateComponent;
  let fixture: ComponentFixture<OperacaoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let operacaoFormService: OperacaoFormService;
  let operacaoService: OperacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OperacaoUpdateComponent],
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
      .overrideTemplate(OperacaoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperacaoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operacaoFormService = TestBed.inject(OperacaoFormService);
    operacaoService = TestBed.inject(OperacaoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const operacao: IOperacao = { id: 456 };

      activatedRoute.data = of({ operacao });
      comp.ngOnInit();

      expect(comp.operacao).toEqual(operacao);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperacao>>();
      const operacao = { id: 123 };
      jest.spyOn(operacaoFormService, 'getOperacao').mockReturnValue(operacao);
      jest.spyOn(operacaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operacao }));
      saveSubject.complete();

      // THEN
      expect(operacaoFormService.getOperacao).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(operacaoService.update).toHaveBeenCalledWith(expect.objectContaining(operacao));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperacao>>();
      const operacao = { id: 123 };
      jest.spyOn(operacaoFormService, 'getOperacao').mockReturnValue({ id: null });
      jest.spyOn(operacaoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacao: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operacao }));
      saveSubject.complete();

      // THEN
      expect(operacaoFormService.getOperacao).toHaveBeenCalled();
      expect(operacaoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperacao>>();
      const operacao = { id: 123 };
      jest.spyOn(operacaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operacao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operacaoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
