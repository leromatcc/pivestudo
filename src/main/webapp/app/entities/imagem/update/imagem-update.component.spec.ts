import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IRegistroAcesso } from 'app/entities/registro-acesso/registro-acesso.model';
import { RegistroAcessoService } from 'app/entities/registro-acesso/service/registro-acesso.service';
import { ImagemService } from '../service/imagem.service';
import { IImagem } from '../imagem.model';
import { ImagemFormService } from './imagem-form.service';

import { ImagemUpdateComponent } from './imagem-update.component';

describe('Imagem Management Update Component', () => {
  let comp: ImagemUpdateComponent;
  let fixture: ComponentFixture<ImagemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let imagemFormService: ImagemFormService;
  let imagemService: ImagemService;
  let registroAcessoService: RegistroAcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImagemUpdateComponent],
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
      .overrideTemplate(ImagemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImagemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imagemFormService = TestBed.inject(ImagemFormService);
    imagemService = TestBed.inject(ImagemService);
    registroAcessoService = TestBed.inject(RegistroAcessoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call registroAcesso query and add missing value', () => {
      const imagem: IImagem = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const registroAcesso: IRegistroAcesso = { id: '37b52eab-49a8-4dbc-bf92-843066c27686' };
      imagem.registroAcesso = registroAcesso;

      const registroAcessoCollection: IRegistroAcesso[] = [{ id: '8eea5296-2f9e-4957-a179-1d6a8b545c58' }];
      jest.spyOn(registroAcessoService, 'query').mockReturnValue(of(new HttpResponse({ body: registroAcessoCollection })));
      const expectedCollection: IRegistroAcesso[] = [registroAcesso, ...registroAcessoCollection];
      jest.spyOn(registroAcessoService, 'addRegistroAcessoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(registroAcessoService.query).toHaveBeenCalled();
      expect(registroAcessoService.addRegistroAcessoToCollectionIfMissing).toHaveBeenCalledWith(registroAcessoCollection, registroAcesso);
      expect(comp.registroAcessosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const imagem: IImagem = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const registroAcesso: IRegistroAcesso = { id: 'd35c1a30-10ed-45f8-99f1-b2134db9b876' };
      imagem.registroAcesso = registroAcesso;

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(comp.registroAcessosCollection).toContain(registroAcesso);
      expect(comp.imagem).toEqual(imagem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(imagemFormService, 'getImagem').mockReturnValue(imagem);
      jest.spyOn(imagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imagem }));
      saveSubject.complete();

      // THEN
      expect(imagemFormService.getImagem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(imagemService.update).toHaveBeenCalledWith(expect.objectContaining(imagem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(imagemFormService, 'getImagem').mockReturnValue({ id: null });
      jest.spyOn(imagemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imagem }));
      saveSubject.complete();

      // THEN
      expect(imagemFormService.getImagem).toHaveBeenCalled();
      expect(imagemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(imagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(imagemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRegistroAcesso', () => {
      it('Should forward to registroAcessoService', () => {
        const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        jest.spyOn(registroAcessoService, 'compareRegistroAcesso');
        comp.compareRegistroAcesso(entity, entity2);
        expect(registroAcessoService.compareRegistroAcesso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
