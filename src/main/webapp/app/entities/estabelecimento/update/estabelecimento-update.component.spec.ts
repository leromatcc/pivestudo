import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { EstabelecimentoService } from '../service/estabelecimento.service';
import { IEstabelecimento } from '../estabelecimento.model';
import { EstabelecimentoFormService } from './estabelecimento-form.service';

import { EstabelecimentoUpdateComponent } from './estabelecimento-update.component';

describe('Estabelecimento Management Update Component', () => {
  let comp: EstabelecimentoUpdateComponent;
  let fixture: ComponentFixture<EstabelecimentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estabelecimentoFormService: EstabelecimentoFormService;
  let estabelecimentoService: EstabelecimentoService;
  let enderecoService: EnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstabelecimentoUpdateComponent],
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
      .overrideTemplate(EstabelecimentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstabelecimentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estabelecimentoFormService = TestBed.inject(EstabelecimentoFormService);
    estabelecimentoService = TestBed.inject(EstabelecimentoService);
    enderecoService = TestBed.inject(EnderecoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Endereco query and add missing value', () => {
      const estabelecimento: IEstabelecimento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const endereco: IEndereco = { id: '5676befd-8f00-4e81-bdcb-2d7fa5e22357' };
      estabelecimento.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: 'a0660ed9-1b8c-488f-b539-51342c15b838' }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const additionalEnderecos = [endereco];
      const expectedCollection: IEndereco[] = [...additionalEnderecos, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estabelecimento });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(
        enderecoCollection,
        ...additionalEnderecos.map(expect.objectContaining),
      );
      expect(comp.enderecosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estabelecimento: IEstabelecimento = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const endereco: IEndereco = { id: '948cd882-04b7-4707-8073-fbf35c1e9100' };
      estabelecimento.endereco = endereco;

      activatedRoute.data = of({ estabelecimento });
      comp.ngOnInit();

      expect(comp.enderecosSharedCollection).toContain(endereco);
      expect(comp.estabelecimento).toEqual(estabelecimento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstabelecimento>>();
      const estabelecimento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(estabelecimentoFormService, 'getEstabelecimento').mockReturnValue(estabelecimento);
      jest.spyOn(estabelecimentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estabelecimento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estabelecimento }));
      saveSubject.complete();

      // THEN
      expect(estabelecimentoFormService.getEstabelecimento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estabelecimentoService.update).toHaveBeenCalledWith(expect.objectContaining(estabelecimento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstabelecimento>>();
      const estabelecimento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(estabelecimentoFormService, 'getEstabelecimento').mockReturnValue({ id: null });
      jest.spyOn(estabelecimentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estabelecimento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estabelecimento }));
      saveSubject.complete();

      // THEN
      expect(estabelecimentoFormService.getEstabelecimento).toHaveBeenCalled();
      expect(estabelecimentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstabelecimento>>();
      const estabelecimento = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(estabelecimentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estabelecimento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estabelecimentoService.update).toHaveBeenCalled();
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
  });
});
