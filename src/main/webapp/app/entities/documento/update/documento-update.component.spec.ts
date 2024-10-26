import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { DocumentoService } from '../service/documento.service';
import { IDocumento } from '../documento.model';
import { DocumentoFormService } from './documento-form.service';

import { DocumentoUpdateComponent } from './documento-update.component';

describe('Documento Management Update Component', () => {
  let comp: DocumentoUpdateComponent;
  let fixture: ComponentFixture<DocumentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentoFormService: DocumentoFormService;
  let documentoService: DocumentoService;
  let pessoaService: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DocumentoUpdateComponent],
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
      .overrideTemplate(DocumentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentoFormService = TestBed.inject(DocumentoFormService);
    documentoService = TestBed.inject(DocumentoService);
    pessoaService = TestBed.inject(PessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const documento: IDocumento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: '192e3316-3971-4de2-8419-203a129e7ffc' };
      documento.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: '01c72d54-2e37-4fa1-84a3-8c4d9fc3059d' }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const documento: IDocumento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: 'da8aea54-81cc-43f4-8399-bf8b2002282a' };
      documento.pessoa = pessoa;

      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.documento).toEqual(documento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(documentoFormService, 'getDocumento').mockReturnValue(documento);
      jest.spyOn(documentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documento }));
      saveSubject.complete();

      // THEN
      expect(documentoFormService.getDocumento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentoService.update).toHaveBeenCalledWith(expect.objectContaining(documento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(documentoFormService, 'getDocumento').mockReturnValue({ id: null });
      jest.spyOn(documentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documento }));
      saveSubject.complete();

      // THEN
      expect(documentoFormService.getDocumento).toHaveBeenCalled();
      expect(documentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(documentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(documentoService.update).toHaveBeenCalled();
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
