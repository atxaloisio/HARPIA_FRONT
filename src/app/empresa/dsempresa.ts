import { TokenManagerService } from './../token-manager.service';
import { EmpresaService } from './empresa.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { Empresa, EmpresaFilter } from './empresa';
import { merge } from 'rxjs';

export class DsEmpresa extends DataSource<Empresa> {
  _filterChange = new BehaviorSubject({
    id: '',
    cnpj: '',
    razao_social: '',
    nome_fantasia: ''
  });

  public onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get filter(): EmpresaFilter {
    return this._filterChange.value;
  }

  set filter(filter: EmpresaFilter) {
    this._filterChange.next(filter);
  }

  resultsLength = 0;
  // isLoadingResults: boolean;

  paginaInicial: number;
  paginaAtual: number;
  paginaFinal: number;
  registroDe: number;
  registroAte: number;
  nrRegistros: number;

  constructor(
    private _tokenManager: TokenManagerService,
    private _empresaService: EmpresaService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.onChange.emit(false);
  }
  connect(): Observable<Empresa[]> {
    const displayDataChanges = [
      this._sort.sortChange,
      this._paginator.page,
      this._filterChange
    ];
    this._sort.sortChange.subscribe(() => (this._paginator.pageIndex = 0));

    return merge(...displayDataChanges)
      .startWith(null)
      .switchMap(() => {
        this.onChange.emit(true);
        return this._empresaService.getEmpresas(
          this._tokenManager.retrieve(),
          this._sort.active,
          this._sort.direction,
          this._paginator.pageIndex,
          this._paginator.pageSize,
          this.filter
        );
      })
      .retry(3)
      .map(data => {
        // Flip flag to show that loading has finished.
        this.onChange.emit(false);
        this.paginaInicial = 1;
        this.paginaFinal = data.last_page;
        this.registroDe = data.from;
        this.registroAte = data.to;
        this.nrRegistros = data.total;
        return data.data;
      })
      .catch(err => {
        console.log(err);
        return Observable.of([]);
      });
  }
  disconnect(): void {}
}
