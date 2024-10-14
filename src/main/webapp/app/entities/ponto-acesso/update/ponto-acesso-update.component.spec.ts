import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';
import { EstabelecimentoService } from 'app/entities/estabelecimento/service/estabelecimento.service';
import { PontoAcessoService } from '../service/ponto-acesso.service';
import { IPontoAcesso } from '../ponto-acesso.model';
import { PontoAcessoFormService } from './ponto-acesso-form.service';

import { PontoAcessoUpdateComponent } from './ponto-acesso-update.component';

describe('PontoAcesso Management Update Component', () => {
  let comp: PontoAcessoUpdateComponent;
  let fixture: ComponentFixture<PontoAcessoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pontoAcessoFormService: PontoAcessoFormService;
  let pontoAcessoService: PontoAcessoService;
  let estabelecimentoService: EstabelecimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PontoAcessoUpdateComponent],
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
      .overrideTemplate(PontoAcessoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PontoAcessoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pontoAcessoFormService = TestBed.inject(PontoAcessoFormService);
    pontoAcessoService = TestBed.inject(PontoAcessoService);
    estabelecimentoService = TestBed.inject(EstabelecimentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estabelecimento query and add missing value', () => {
      const pontoAcesso: IPontoAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const estabelecimento: IEstabelecimento = { id: '12bac7f7-821f-4ad7-932a-88c7aeb5da2a' };
      pontoAcesso.estabelecimento = estabelecimento;

      const estabelecimentoCollection: IEstabelecimento[] = [{ id: '3262e4a1-6136-42a6-a3a5-c74f3e3145b0' }];
      jest.spyOn(estabelecimentoService, 'query').mockReturnValue(of(new HttpResponse({ body: estabelecimentoCollection })));
      const additionalEstabelecimentos = [estabelecimento];
      const expectedCollection: IEstabelecimento[] = [...additionalEstabelecimentos, ...estabelecimentoCollection];
      jest.spyOn(estabelecimentoService, 'addEstabelecimentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pontoAcesso });
      comp.ngOnInit();

      expect(estabelecimentoService.query).toHaveBeenCalled();
      expect(estabelecimentoService.addEstabelecimentoToCollectionIfMissing).toHaveBeenCalledWith(
        estabelecimentoCollection,
        ...additionalEstabelecimentos.map(expect.objectContaining),
      );
      expect(comp.estabelecimentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pontoAcesso: IPontoAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const estabelecimento: IEstabelecimento = { id: '9ae4b0be-07db-407a-8dec-f437eaeca7b0' };
      pontoAcesso.estabelecimento = estabelecimento;

      activatedRoute.data = of({ pontoAcesso });
      comp.ngOnInit();

      expect(comp.estabelecimentosSharedCollection).toContain(estabelecimento);
      expect(comp.pontoAcesso).toEqual(pontoAcesso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPontoAcesso>>();
      const pontoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pontoAcessoFormService, 'getPontoAcesso').mockReturnValue(pontoAcesso);
      jest.spyOn(pontoAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pontoAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pontoAcesso }));
      saveSubject.complete();

      // THEN
      expect(pontoAcessoFormService.getPontoAcesso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pontoAcessoService.update).toHaveBeenCalledWith(expect.objectContaining(pontoAcesso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPontoAcesso>>();
      const pontoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pontoAcessoFormService, 'getPontoAcesso').mockReturnValue({ id: null });
      jest.spyOn(pontoAcessoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pontoAcesso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pontoAcesso }));
      saveSubject.complete();

      // THEN
      expect(pontoAcessoFormService.getPontoAcesso).toHaveBeenCalled();
      expect(pontoAcessoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPontoAcesso>>();
      const pontoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pontoAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pontoAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pontoAcessoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEstabelecimento', () => {
      it('Should forward to estabelecimentoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(estabelecimentoService, 'compareEstabelecimento');
        comp.compareEstabelecimento(entity, entity2);
        expect(estabelecimentoService.compareEstabelecimento).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
