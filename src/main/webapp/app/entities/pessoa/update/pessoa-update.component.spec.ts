import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ITipoPessoa } from 'app/entities/tipo-pessoa/tipo-pessoa.model';
import { TipoPessoaService } from 'app/entities/tipo-pessoa/service/tipo-pessoa.service';
import { IPessoa } from '../pessoa.model';
import { PessoaService } from '../service/pessoa.service';
import { PessoaFormService } from './pessoa-form.service';

import { PessoaUpdateComponent } from './pessoa-update.component';

describe('Pessoa Management Update Component', () => {
  let comp: PessoaUpdateComponent;
  let fixture: ComponentFixture<PessoaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pessoaFormService: PessoaFormService;
  let pessoaService: PessoaService;
  let userService: UserService;
  let tipoPessoaService: TipoPessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PessoaUpdateComponent],
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
      .overrideTemplate(PessoaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PessoaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pessoaFormService = TestBed.inject(PessoaFormService);
    pessoaService = TestBed.inject(PessoaService);
    userService = TestBed.inject(UserService);
    tipoPessoaService = TestBed.inject(TipoPessoaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const pessoa: IPessoa = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const user: IUser = { id: 28055 };
      pessoa.user = user;

      const userCollection: IUser[] = [{ id: 26832 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call tipoPessoa query and add missing value', () => {
      const pessoa: IPessoa = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const tipoPessoa: ITipoPessoa = { id: 24807 };
      pessoa.tipoPessoa = tipoPessoa;

      const tipoPessoaCollection: ITipoPessoa[] = [{ id: 8525 }];
      jest.spyOn(tipoPessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoPessoaCollection })));
      const expectedCollection: ITipoPessoa[] = [tipoPessoa, ...tipoPessoaCollection];
      jest.spyOn(tipoPessoaService, 'addTipoPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      expect(tipoPessoaService.query).toHaveBeenCalled();
      expect(tipoPessoaService.addTipoPessoaToCollectionIfMissing).toHaveBeenCalledWith(tipoPessoaCollection, tipoPessoa);
      expect(comp.tipoPessoasCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pessoa: IPessoa = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const user: IUser = { id: 22481 };
      pessoa.user = user;
      const tipoPessoa: ITipoPessoa = { id: 15113 };
      pessoa.tipoPessoa = tipoPessoa;

      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tipoPessoasCollection).toContain(tipoPessoa);
      expect(comp.pessoa).toEqual(pessoa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pessoaFormService, 'getPessoa').mockReturnValue(pessoa);
      jest.spyOn(pessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pessoa }));
      saveSubject.complete();

      // THEN
      expect(pessoaFormService.getPessoa).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pessoaService.update).toHaveBeenCalledWith(expect.objectContaining(pessoa));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pessoaFormService, 'getPessoa').mockReturnValue({ id: null });
      jest.spyOn(pessoaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pessoa }));
      saveSubject.complete();

      // THEN
      expect(pessoaFormService.getPessoa).toHaveBeenCalled();
      expect(pessoaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPessoa>>();
      const pessoa = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(pessoaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pessoa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pessoaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTipoPessoa', () => {
      it('Should forward to tipoPessoaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tipoPessoaService, 'compareTipoPessoa');
        comp.compareTipoPessoa(entity, entity2);
        expect(tipoPessoaService.compareTipoPessoa).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
