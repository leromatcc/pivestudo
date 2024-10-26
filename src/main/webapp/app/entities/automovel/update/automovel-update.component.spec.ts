import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITipoAutomovel } from 'app/entities/tipo-automovel/tipo-automovel.model';
import { TipoAutomovelService } from 'app/entities/tipo-automovel/service/tipo-automovel.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { IAutomovel } from '../automovel.model';
import { AutomovelService } from '../service/automovel.service';
import { AutomovelFormService } from './automovel-form.service';

import { AutomovelUpdateComponent } from './automovel-update.component';

describe('Automovel Management Update Component', () => {
  let comp: AutomovelUpdateComponent;
  let fixture: ComponentFixture<AutomovelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let automovelFormService: AutomovelFormService;
  let automovelService: AutomovelService;
  let tipoAutomovelService: TipoAutomovelService;
  let pessoaService: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutomovelUpdateComponent],
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
      .overrideTemplate(AutomovelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AutomovelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    automovelFormService = TestBed.inject(AutomovelFormService);
    automovelService = TestBed.inject(AutomovelService);
    tipoAutomovelService = TestBed.inject(TipoAutomovelService);
    pessoaService = TestBed.inject(PessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TipoAutomovel query and add missing value', () => {
      const automovel: IAutomovel = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const tipoAutomovel: ITipoAutomovel = { id: '86781745-cea0-4350-a748-cc3dbbbd82e1' };
      automovel.tipoAutomovel = tipoAutomovel;

      const tipoAutomovelCollection: ITipoAutomovel[] = [{ id: 'd0a5246a-f849-42bc-85d2-6eaa07bfa8a0' }];
      jest.spyOn(tipoAutomovelService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoAutomovelCollection })));
      const additionalTipoAutomovels = [tipoAutomovel];
      const expectedCollection: ITipoAutomovel[] = [...additionalTipoAutomovels, ...tipoAutomovelCollection];
      jest.spyOn(tipoAutomovelService, 'addTipoAutomovelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ automovel });
      comp.ngOnInit();

      expect(tipoAutomovelService.query).toHaveBeenCalled();
      expect(tipoAutomovelService.addTipoAutomovelToCollectionIfMissing).toHaveBeenCalledWith(
        tipoAutomovelCollection,
        ...additionalTipoAutomovels.map(expect.objectContaining),
      );
      expect(comp.tipoAutomovelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Pessoa query and add missing value', () => {
      const automovel: IAutomovel = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pessoa: IPessoa = { id: 'f6c89bb0-be2e-4655-a052-5f2310f04385' };
      automovel.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: '133fd991-21dd-4d67-804f-790d998fe13a' }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ automovel });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining),
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const automovel: IAutomovel = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const tipoAutomovel: ITipoAutomovel = { id: '45fc0a45-bedb-4ede-a65a-1bcfbb44d074' };
      automovel.tipoAutomovel = tipoAutomovel;
      const pessoa: IPessoa = { id: '8ef557af-e465-43ea-9e34-d81c32312c59' };
      automovel.pessoa = pessoa;

      activatedRoute.data = of({ automovel });
      comp.ngOnInit();

      expect(comp.tipoAutomovelsSharedCollection).toContain(tipoAutomovel);
      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.automovel).toEqual(automovel);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomovel>>();
      const automovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(automovelFormService, 'getAutomovel').mockReturnValue(automovel);
      jest.spyOn(automovelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automovel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: automovel }));
      saveSubject.complete();

      // THEN
      expect(automovelFormService.getAutomovel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(automovelService.update).toHaveBeenCalledWith(expect.objectContaining(automovel));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomovel>>();
      const automovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(automovelFormService, 'getAutomovel').mockReturnValue({ id: null });
      jest.spyOn(automovelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automovel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: automovel }));
      saveSubject.complete();

      // THEN
      expect(automovelFormService.getAutomovel).toHaveBeenCalled();
      expect(automovelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAutomovel>>();
      const automovel = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(automovelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ automovel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(automovelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTipoAutomovel', () => {
      it('Should forward to tipoAutomovelService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(tipoAutomovelService, 'compareTipoAutomovel');
        comp.compareTipoAutomovel(entity, entity2);
        expect(tipoAutomovelService.compareTipoAutomovel).toHaveBeenCalledWith(entity, entity2);
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
