import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import { EntityArrayResponseType, LoteBlocoApartamentoService } from '../service/lote-bloco-apartamento.service';
import { LoteBlocoApartamentoDeleteDialogComponent } from '../delete/lote-bloco-apartamento-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-lote-bloco-apartamento',
  templateUrl: './lote-bloco-apartamento.component.html',
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
export class LoteBlocoApartamentoComponent implements OnInit {
  subscription: Subscription | null = null;
  loteBlocoApartamentos?: ILoteBlocoApartamento[];
  isLoading = false;

  sortState = sortStateSignal({});

  public router = inject(Router);
  protected loteBlocoApartamentoService = inject(LoteBlocoApartamentoService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: ILoteBlocoApartamento): string =>
    this.loteBlocoApartamentoService.getLoteBlocoApartamentoIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.loteBlocoApartamentos || this.loteBlocoApartamentos.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(loteBlocoApartamento: ILoteBlocoApartamento): void {
    const modalRef = this.modalService.open(LoteBlocoApartamentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.loteBlocoApartamento = loteBlocoApartamento;
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
    this.loteBlocoApartamentos = this.refineData(dataFromBody);
  }

  protected refineData(data: ILoteBlocoApartamento[]): ILoteBlocoApartamento[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: ILoteBlocoApartamento[] | null): ILoteBlocoApartamento[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.loteBlocoApartamentoService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
