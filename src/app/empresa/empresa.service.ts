import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Empresa, EmpresaFilter } from './empresa';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import {
  Http,
  Headers,
  Response,
  RequestOptions,
  URLSearchParams
} from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class EmpresaService {
  private empresaUrl = environment.urlbase + '/api/empresas';

  constructor(private _http: Http) {}

  syncEmpresaOmie(accessToken: string, app_key: string, app_secret: string) {
    const listUrl = environment.urlbase + '/api/syncempresaomie';
    const search: URLSearchParams = new URLSearchParams();
    search.set('app_key', app_key);
    search.set('app_secret', app_secret);

    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers, search: search })
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  deleteEmpresa(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.empresaUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getEmpresa(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.empresaUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  /** Metodo que retorna um observable com dados da listagem de empresas
   *  parametro: acessToken: string
   */
  getEmpresas(
    accessToken: string,
    sort: string,
    order: string,
    page: number,
    pagesize: number,
    filter: EmpresaFilter
  ) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    const params: HttpParams = new HttpParams();
    const search: URLSearchParams = new URLSearchParams();
    search.set('nrcount', pagesize.toString());
    page++;
    search.set('page', page.toString());

    if (!isNullOrUndefined(order) && order.length > 0) {
      search.set('order', order);
    } else {
      order = 'asc';
      search.set('order', order);
    }

    if (!isNullOrUndefined(sort)) {
      search.set('orderkey', sort);
    } else {
      sort = 'id';
      search.set('orderkey', sort);
    }

    if (!isNullOrUndefined(filter.id) && filter.id.toString().length > 0) {
      search.set('id', filter.id.toString());
    }

    if (
      !isNullOrUndefined(filter.nome_fantasia) &&
      filter.nome_fantasia.length > 0
    ) {
      search.set('nome_fantasia', filter.nome_fantasia);
    }

    return this._http
      .get(this.empresaUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }
}
