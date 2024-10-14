import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PontoAcessoDetailComponent } from './ponto-acesso-detail.component';

describe('PontoAcesso Management Detail Component', () => {
  let comp: PontoAcessoDetailComponent;
  let fixture: ComponentFixture<PontoAcessoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PontoAcessoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./ponto-acesso-detail.component').then(m => m.PontoAcessoDetailComponent),
              resolve: { pontoAcesso: () => of({ id: '9fec3727-3421-4967-b213-ba36557ca194' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PontoAcessoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoAcessoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pontoAcesso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PontoAcessoDetailComponent);

      // THEN
      expect(instance.pontoAcesso()).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
