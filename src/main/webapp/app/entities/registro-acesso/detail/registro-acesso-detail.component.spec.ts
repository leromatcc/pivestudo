import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { RegistroAcessoDetailComponent } from './registro-acesso-detail.component';

describe('RegistroAcesso Management Detail Component', () => {
  let comp: RegistroAcessoDetailComponent;
  let fixture: ComponentFixture<RegistroAcessoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAcessoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./registro-acesso-detail.component').then(m => m.RegistroAcessoDetailComponent),
              resolve: { registroAcesso: () => of({ id: '9fec3727-3421-4967-b213-ba36557ca194' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RegistroAcessoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAcessoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load registroAcesso on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RegistroAcessoDetailComponent);

      // THEN
      expect(instance.registroAcesso()).toEqual(expect.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
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
