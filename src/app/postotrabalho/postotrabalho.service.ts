import { environment } from './../../environments/environment';
import { isEmpty } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { PostoTrabalho, PostoTrabalhoFilter } from './postotrabalho';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class PostoTrabalhoService {
  private postotrabalhoUrl = environment.urlbase + '/api/postostrabalho';

  constructor(private _http: Http) {}

  addPostoTrabalho(accessToken: string, _postotrabalho: PostoTrabalho): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      descricao: _postotrabalho.descricao
    };
    // _params.set('codigo', '1');

    return this._http
      .post(this.postotrabalhoUrl, _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  editPostoTrabalho(
    accessToken: string,
    _id: number,
    _postotrabalho: PostoTrabalho
  ): Observable<any> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      id: _id,
      descricao: _postotrabalho.descricao
    };
    // _params.set('id', _id.toString());

    return this._http
      .put(this.postotrabalhoUrl + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  deletePostoTrabalho(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.postotrabalhoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getPostoTrabalho(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.postotrabalhoUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  /** Metodo que retorna um observable com dados da listagem de postotrabalhos
   *  parametro: acessToken: string
   */
  getPostoTrabalhos(
    accessToken: string,
    sort: string,
    order: string,
    page: number,
    pagesize: number,
    filter: PostoTrabalhoFilter
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

    if (!isNullOrUndefined(filter.descricao) && filter.descricao.length > 0) {
      search.set('descricao', filter.descricao);
    }

    return this._http
      .get(this.postotrabalhoUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getListPostoTrabalhos(accessToken: string) {
    const listUrl = environment.urlbase + '/api/listpostostrabalho';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(listUrl, { headers: headers })
      .map((res: Response) => res)
      .retry(3)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }
}
