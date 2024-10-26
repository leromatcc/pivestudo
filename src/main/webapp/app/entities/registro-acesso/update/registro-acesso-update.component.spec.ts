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
      const pontoAcesso: IPontoAcesso = { id: '8975b50d-8efe-4a3a-8fcd-de10946bb40c' };
      registroAcesso.pontoAcesso = pontoAcesso;

      const pontoAcessoCollection: IPontoAcesso[] = [{ id: '918d7ed2-ec0f-4deb-b501-a9a010bc88db' }];
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
      const automovel: IAutomovel = { id: '5878a705-fa19-4238-ba23-675b4745fadf' };
      registroAcesso.automovel = automovel;

      const automovelCollection: IAutomovel[] = [{ id: '8cf124c5-bbe8-4f2b-961b-798dfdfbcdfd' }];
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
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: '4ae6c35d-7e79-4129-89fb-cded0dee2fa0' };
      registroAcesso.autorizacaoAcesso = autorizacaoAcesso;

      const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [{ id: '67f15ace-da17-40c2-8367-850b17415703' }];
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
      const pontoAcesso: IPontoAcesso = { id: 'acae9b70-f285-4081-8707-717bd5c5eae0' };
      registroAcesso.pontoAcesso = pontoAcesso;
      const automovel: IAutomovel = { id: '73adde32-e628-43c5-9729-d9ea1501c885' };
      registroAcesso.automovel = automovel;
      const autorizacaoAcesso: IAutorizacaoAcesso = { id: 'f4a53231-a5ea-4dab-855d-927b71da788a' };
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
