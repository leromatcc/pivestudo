import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { TelefoneService } from '../service/telefone.service';
import { ITelefone } from '../telefone.model';
import { TelefoneFormService } from './telefone-form.service';

import { TelefoneUpdateComponent } from './telefone-update.component';

describe('Telefone Management Update Component', () => {
  let comp: TelefoneUpdateComponent;
  let fixture: ComponentFixture<TelefoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let telefoneFormService: TelefoneFormService;
  let telefoneService: TelefoneService;
  let pessoaService: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TelefoneUpdateComponent],
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
      .overrideTemplate(TelefoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TelefoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    telefoneFormService = TestBed.inject(TelefoneFormService);
    telefoneService = TestBed.inject(TelefoneService);
    pessoaService = TestBed.inject(PessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const telefone: ITelefone = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: '9c4ece13-eaa3-4882-b1af-40b0ce9ead2a' };
      telefone.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: '851ccb0f-e39a-4243-9c55-89ee996f20c5' }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const telefone: ITelefone = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: '7f29484d-844b-41f1-abe9-04755700b0c5' };
      telefone.pessoa = pessoa;

      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.telefone).toEqual(telefone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITelefone>>();
      const telefone = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(telefoneFormService, 'getTelefone').mockReturnValue(telefone);
      jest.spyOn(telefoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: telefone }));
      saveSubject.complete();

      // THEN
      expect(telefoneFormService.getTelefone).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(telefoneService.update).toHaveBeenCalledWith(expect.objectContaining(telefone));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITelefone>>();
      const telefone = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(telefoneFormService, 'getTelefone').mockReturnValue({ id: null });
      jest.spyOn(telefoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: telefone }));
      saveSubject.complete();

      // THEN
      expect(telefoneFormService.getTelefone).toHaveBeenCalled();
      expect(telefoneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITelefone>>();
      const telefone = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(telefoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(telefoneService.update).toHaveBeenCalled();
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
  });
});
