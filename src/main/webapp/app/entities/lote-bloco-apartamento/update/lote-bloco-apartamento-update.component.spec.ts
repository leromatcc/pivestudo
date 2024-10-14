import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import { LoteBlocoApartamentoService } from '../service/lote-bloco-apartamento.service';
import { LoteBlocoApartamentoFormService } from './lote-bloco-apartamento-form.service';

import { LoteBlocoApartamentoUpdateComponent } from './lote-bloco-apartamento-update.component';

describe('LoteBlocoApartamento Management Update Component', () => {
  let comp: LoteBlocoApartamentoUpdateComponent;
  let fixture: ComponentFixture<LoteBlocoApartamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loteBlocoApartamentoFormService: LoteBlocoApartamentoFormService;
  let loteBlocoApartamentoService: LoteBlocoApartamentoService;
  let enderecoService: EnderecoService;
  let pessoaService: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoteBlocoApartamentoUpdateComponent],
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
      .overrideTemplate(LoteBlocoApartamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoteBlocoApartamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loteBlocoApartamentoFormService = TestBed.inject(LoteBlocoApartamentoFormService);
    loteBlocoApartamentoService = TestBed.inject(LoteBlocoApartamentoService);
    enderecoService = TestBed.inject(EnderecoService);
    pessoaService = TestBed.inject(PessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Endereco query and add missing value', () => {
      const loteBlocoApartamento: ILoteBlocoApartamento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const endereco: IEndereco = { id: '8d51324a-ec50-41a2-ba9b-0e6075a446e9' };
      loteBlocoApartamento.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: '8468c968-90d7-40c9-8c58-cb762d01440d' }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const additionalEnderecos = [endereco];
      const expectedCollection: IEndereco[] = [...additionalEnderecos, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loteBlocoApartamento });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(
        enderecoCollection,
        ...additionalEnderecos.map(expect.objectContaining),
      );
      expect(comp.enderecosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Pessoa query and add missing value', () => {
      const loteBlocoApartamento: ILoteBlocoApartamento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: 'a1773bd6-8d28-46e0-9da9-af4ac3e384e8' };
      loteBlocoApartamento.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: '9380634b-7fb6-4df7-8ae6-08fde7b7786f' }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loteBlocoApartamento });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loteBlocoApartamento: ILoteBlocoApartamento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const endereco: IEndereco = { id: '91e24c4b-33b5-46e1-bc38-61ba66ee99cc' };
      loteBlocoApartamento.endereco = endereco;
      const pessoa: IPessoa = { id: '3932ee93-8371-4662-a369-9721adde0244' };
      loteBlocoApartamento.pessoa = pessoa;

      activatedRoute.data = of({ loteBlocoApartamento });
      comp.ngOnInit();

      expect(comp.enderecosSharedCollection).toContain(endereco);
      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.loteBlocoApartamento).toEqual(loteBlocoApartamento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoteBlocoApartamento>>();
      const loteBlocoApartamento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(loteBlocoApartamentoFormService, 'getLoteBlocoApartamento').mockReturnValue(loteBlocoApartamento);
      jest.spyOn(loteBlocoApartamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loteBlocoApartamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loteBlocoApartamento }));
      saveSubject.complete();

      // THEN
      expect(loteBlocoApartamentoFormService.getLoteBlocoApartamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loteBlocoApartamentoService.update).toHaveBeenCalledWith(expect.objectContaining(loteBlocoApartamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoteBlocoApartamento>>();
      const loteBlocoApartamento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(loteBlocoApartamentoFormService, 'getLoteBlocoApartamento').mockReturnValue({ id: null });
      jest.spyOn(loteBlocoApartamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loteBlocoApartamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loteBlocoApartamento }));
      saveSubject.complete();

      // THEN
      expect(loteBlocoApartamentoFormService.getLoteBlocoApartamento).toHaveBeenCalled();
      expect(loteBlocoApartamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoteBlocoApartamento>>();
      const loteBlocoApartamento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(loteBlocoApartamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loteBlocoApartamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loteBlocoApartamentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEndereco', () => {
      it('Should forward to enderecoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(enderecoService, 'compareEndereco');
        comp.compareEndereco(entity, entity2);
        expect(enderecoService.compareEndereco).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePessoa', () => {
      it('Should forward to pessoaService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(pessoaService, 'comparePessoa');
        comp.comparePessoa(entity, entity2);
        expect(pessoaService.comparePessoa).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});