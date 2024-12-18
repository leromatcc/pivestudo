import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { AutorizacaoAcessoService, EntityArrayResponseType } from '../service/autorizacao-acesso.service';
import { AutorizacaoAcessoDeleteDialogComponent } from '../delete/autorizacao-acesso-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-autorizacao-acesso',
  templateUrl: './autorizacao-acesso.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class AutorizacaoAcessoComponent implements OnInit {
  subscription: Subscription | null = null;
  autorizacaoAcessos?: IAutorizacaoAcesso[];
  isLoading = false;

  sortState = sortStateSignal({});

  public router = inject(Router);
  protected autorizacaoAcessoService = inject(AutorizacaoAcessoService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IAutorizacaoAcesso): string => this.autorizacaoAcessoService.getAutorizacaoAcessoIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.autorizacaoAcessos || this.autorizacaoAcessos.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(autorizacaoAcesso: IAutorizacaoAcesso): void {
    const modalRef = this.modalService.open(AutorizacaoAcessoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.autorizacaoAcesso = autorizacaoAcesso;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.autorizacaoAcessos = this.refineData(dataFromBody);
  }

  protected refineData(data: IAutorizacaoAcesso[]): IAutorizacaoAcesso[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IAutorizacaoAcesso[] | null): IAutorizacaoAcesso[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.autorizacaoAcessoService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
