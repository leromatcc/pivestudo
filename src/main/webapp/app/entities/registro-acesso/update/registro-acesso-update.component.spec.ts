import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';
import { PontoAcessoService } from 'app/entities/ponto-acesso/service/ponto-acesso.service';
import { IAutomovel } from 'app/entities/automovel/automovel.model';
import { AutomovelService } from 'app/entities/automovel/service/automovel.service';
import { IAutorizacaoAcesso } from 'app/entities/autorizacao-acesso/autorizacao-acesso.model';
import { AutorizacaoAcessoService } from 'app/entities/autorizacao-acesso/service/autorizacao-acesso.service';
import { IRegistroAcesso } from '../registro-acesso.model';
import { RegistroAcessoService } from '../service/registro-acesso.service';
import { RegistroAcessoFormService } from './registro-acesso-form.service';

import { RegistroAcessoUpdateComponent } from './registro-acesso-update.component';

describe('RegistroAcesso Management Update Component', () => {
  let comp: RegistroAcessoUpdateComponent;
  let fixture: ComponentFixture<RegistroAcessoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let registroAcessoFormService: RegistroAcessoFormService;
  let registroAcessoService: RegistroAcessoService;
  let pontoAcessoService: PontoAcessoService;
  let automovelService: AutomovelService;
  let autorizacaoAcessoService: AutorizacaoAcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistroAcessoUpdateComponent],
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
      .overrideTemplate(RegistroAcessoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroAcessoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    registroAcessoFormService = TestBed.inject(RegistroAcessoFormService);
    registroAcessoService = TestBed.inject(RegistroAcessoService);
    pontoAcessoService = TestBed.inject(PontoAcessoService);
    automovelService = TestBed.inject(AutomovelService);
    autorizacaoAcessoService = TestBed.inject(AutorizacaoAcessoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PontoAcesso query and add missing value', () => {
      const registroAcesso: IRegistroAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pontoAcesso: IPontoAcesso = { id: 'a8c9d735-6bc5-4a07-bd08-9eaffe0aa39a' };
      registroAcesso.pontoAcesso = pontoAcesso;

      const pontoAcessoCollection: IPontoAcesso[] = [{ id: 'f5c8d0d8-e81e-4029-8543-6bbebd450ccd' }];
      jest.spyOn(pontoAcessoService, 'query').mockReturnValue(of(new HttpResponse({ body: pontoAcessoCollection })));
      const additionalPontoAcessos = [pontoAcesso];
      const expectedCollection: IPontoAcesso[] = [...additionalPontoAcessos, ...pontoAcessoCollection];
      jest.spyOn(pontoAcessoService, 'addPontoAcessoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      expect(pontoAcessoService.query).toHaveBeenCalled();
      expect(pontoAcessoService.addPontoAcessoToCollectionIfMissing).toHaveBeenCalledWith(
        pontoAcessoCollection,
        ...additionalPontoAcessos.map(expect.objectContaining),
      );
      expect(comp.pontoAcessosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Automovel query and add missing value', () => {
      const registroAcesso: IRegistroAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const automovel: IAutomovel = { id: '3b7138cd-75c3-44a8-9341-a4901e78c223' };
      registroAcesso.automovel = automovel;

      const automovelCollection: IAutomovel[] = [{ id: 'f19f6131-296c-4871-9385-d4f24e1155f3' }];
      jest.spyOn(automovelService, 'query').mockReturnValue(of(new HttpResponse({ body: automovelCollection })));
      const additionalAutomovels = [automovel];
      const expectedCollection: IAutomovel[] = [...additionalAutomovels, ...automovelCollection];
      jest.spyOn(automovelService, 'addAutomovelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      expect(automovelService.query).toHaveBeenCalled();
      expect(automovelService.addAutomovelToCollectionIfMissing).toHaveBeenCalledWith(
        automovelCollection,
        ...additionalAutomovels.map(expect.objectContaining),
      );
      expect(comp.automovelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AutorizacaoAcesso query and add missing value', () => {
      const registroAcesso: IRegistroAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: 'd0050429-f473-45c4-acf5-0922b3a67bee' };
      registroAcesso.autorizacaoAcesso = autorizacaoAcesso;

      const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [{ id: '81c5253b-d208-45bb-89c4-9876b8b25718' }];
      jest.spyOn(autorizacaoAcessoService, 'query').mockReturnValue(of(new HttpResponse({ body: autorizacaoAcessoCollection })));
      const additionalAutorizacaoAcessos = [autorizacaoAcesso];
      const expectedCollection: IAutorizacaoAcesso[] = [...additionalAutorizacaoAcessos, ...autorizacaoAcessoCollection];
      jest.spyOn(autorizacaoAcessoService, 'addAutorizacaoAcessoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      expect(autorizacaoAcessoService.query).toHaveBeenCalled();
      expect(autorizacaoAcessoService.addAutorizacaoAcessoToCollectionIfMissing).toHaveBeenCalledWith(
        autorizacaoAcessoCollection,
        ...additionalAutorizacaoAcessos.map(expect.objectContaining),
      );
      expect(comp.autorizacaoAcessosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const registroAcesso: IRegistroAcesso = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const pontoAcesso: IPontoAcesso = { id: 'd961584d-273e-49df-921e-7cd04f4d5e2b' };
      registroAcesso.pontoAcesso = pontoAcesso;
      const automovel: IAutomovel = { id: '6e55cf06-8f64-46a9-86bf-ca28308e2b8a' };
      registroAcesso.automovel = automovel;
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: 'dbebdace-45e9-43cd-81cb-4427ea6077bc' };
      registroAcesso.autorizacaoAcesso = autorizacaoAcesso;

      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      expect(comp.pontoAcessosSharedCollection).toContain(pontoAcesso);
      expect(comp.automovelsSharedCollection).toContain(automovel);
      expect(comp.autorizacaoAcessosSharedCollection).toContain(autorizacaoAcesso);
      expect(comp.registroAcesso).toEqual(registroAcesso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroAcesso>>();
      const registroAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(registroAcessoFormService, 'getRegistroAcesso').mockReturnValue(registroAcesso);
      jest.spyOn(registroAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroAcesso }));
      saveSubject.complete();

      // THEN
      expect(registroAcessoFormService.getRegistroAcesso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(registroAcessoService.update).toHaveBeenCalledWith(expect.objectContaining(registroAcesso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroAcesso>>();
      const registroAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(registroAcessoFormService, 'getRegistroAcesso').mockReturnValue({ id: null });
      jest.spyOn(registroAcessoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroAcesso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroAcesso }));
      saveSubject.complete();

      // THEN
      expect(registroAcessoFormService.getRegistroAcesso).toHaveBeenCalled();
      expect(registroAcessoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroAcesso>>();
      const registroAcesso = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(registroAcessoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroAcesso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(registroAcessoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePontoAcesso', () => {
      it('Should forward to pontoAcessoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(pontoAcessoService, 'comparePontoAcesso');
        comp.comparePontoAcesso(entity, entity2);
        expect(pontoAcessoService.comparePontoAcesso).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAutomovel', () => {
      it('Should forward to automovelService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(automovelService, 'compareAutomovel');
        comp.compareAutomovel(entity, entity2);
        expect(automovelService.compareAutomovel).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAutorizacaoAcesso', () => {
      it('Should forward to autorizacaoAcessoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(autorizacaoAcessoService, 'compareAutorizacaoAcesso');
        comp.compareAutorizacaoAcesso(entity, entity2);
        expect(autorizacaoAcessoService.compareAutorizacaoAcesso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
