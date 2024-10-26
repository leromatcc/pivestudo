import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';
import { EstabelecimentoService } from 'app/entities/estabelecimento/service/estabelecimento.service';
import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { AutorizacaoAcessoService } from '../service/autorizacao-acesso.service';
import { AutorizacaoAcessoFormService } from './autorizacao-acesso-form.service';

import { AutorizacaoAcessoUpdateComponent } from './autorizacao-acesso-update.component';

describe('AutorizacaoAcesso Management Update Component', () => {
  let comp: AutorizacaoAcessoUpdateComponent;
  let fixture: ComponentFixture<AutorizacaoAcessoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let autorizacaoAcessoFormService: AutorizacaoAcessoFormService;
  let autorizacaoAcessoService: AutorizacaoAcessoService;
  let pessoaService: PessoaService;
  let estabelecimentoService: EstabelecimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutorizacaoAcessoUpdateComponent],
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
      .overrideTemplate(AutorizacaoAcessoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoAcessoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    autorizacaoAcessoFormService = TestBed.inject(AutorizacaoAcessoFormService);
    autorizacaoAcessoService = TestBed.inject(AutorizacaoAcessoService);
    pessoaService = TestBed.inject(PessoaService);
    estabelecimentoService = TestBed.inject(EstabelecimentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: '7109e58e-3829-4006-8c78-7d25ef3f036c' };
      autorizacaoAcesso.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: '63bff3c9-cc73-46fb-b6fe-e8e5174f6527' }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ autorizacaoAcesso });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Estabelecimento query and add missing value', () => {
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const estabelecimento: IEstabelecimento = { id: '4d40d0e5-908f-495d-a072-47325420d1dd' };
      autorizacaoAcesso.estabelecimento = estabelecimento;

      const estabelecimentoCollection: IEstabelecimento[] = [{ id: '10b78536-c686-4956-82ba-5a8d2b0dbd0a' }];
      jest.spyOn(estabelecimentoService, 'query').mockReturnValue(of(new HttpResponse({ body: estabelecimentoCollection })));
      const additionalEstabelecimentos = [estabelecimento];
      const expectedCollection: IEstabelecimento[] = [...additionalEstabelecimentos, ...estabelecimentoCollection];
      jest.spyOn(estabelecimentoService, 'addEstabelecimentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ autorizacaoAcesso });
      comp.ngOnInit();

      expect(estabelecimentoService.query).toHaveBeenCalled();
      expect(estabelecimentoService.addEstabelecimentoToCollectionIfMissing).toHaveBeenCalledWith(
        estabelecimentoCollection,
        ...additionalEstabelecimentos.map(expect.objectContaining),
      );
      expect(comp.estabelecimentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: 'b0249b88-5441-4ea3-8a0d-e6d8af3fb8a3' };
      autorizacaoAcesso.pessoa = pessoa;
      const estabelecimento: IEstabelecimento = { id: '6740ed59-f5d2-4d1f-8b53-b41f6dc85c73' };
      autorizacaoAcesso.estabelecimento = estabelecimento;

      activatedRoute.data = of({ autorizacaoAcesso });
      comp.ngOnInit();

      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.estabelecimentosSharedCollection).toContain(estabelecimento);
      expect(comp.autorizacaoAcesso).toEqual(autorizacaoAcesso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutorizacaoAcesso>>();
      const autorizacaoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(autorizacaoAcessoFormService, 'getAutorizacaoAcesso').mockReturnValue(autorizacaoAcesso);
      jest.spyOn(autorizacaoAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autorizacaoAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: autorizacaoAcesso }));
      saveSubject.complete();

      // THEN
      expect(autorizacaoAcessoFormService.getAutorizacaoAcesso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(autorizacaoAcessoService.update).toHaveBeenCalledWith(expect.objectContaining(autorizacaoAcesso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutorizacaoAcesso>>();
      const autorizacaoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(autorizacaoAcessoFormService, 'getAutorizacaoAcesso').mockReturnValue({ id: null });
      jest.spyOn(autorizacaoAcessoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autorizacaoAcesso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: autorizacaoAcesso }));
      saveSubject.complete();

      // THEN
      expect(autorizacaoAcessoFormService.getAutorizacaoAcesso).toHaveBeenCalled();
      expect(autorizacaoAcessoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutorizacaoAcesso>>();
      const autorizacaoAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(autorizacaoAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ autorizacaoAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(autorizacaoAcessoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePessoa', () => {
      it('Should forward to pessoaService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(pessoaService, 'comparePessoa');
        comp.comparePessoa(entity, entity2);
        expect(pessoaService.comparePessoa).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
