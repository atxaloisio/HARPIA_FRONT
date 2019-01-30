import { isNullOrUndefined } from 'util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { User, UserFilter } from './user';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable()
export class UserService {
  private usersUrl = environment.urlbase + '/api/users';

  constructor(private _http: Http, private _httpClient: HttpClient) {}

  getUser(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .get(this.usersUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  /** Metodo que retorna um observable com dados da listagem de servicos
   *  parametro: acessToken: string
   */
  getUsers(
    accessToken: string,
    sort: string,
    order: string,
    page: number,
    pagesize: number,
    filter: UserFilter
  ) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const params: HttpParams = new HttpParams();
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

    if (!isNullOrUndefined(filter.name) && filter.name.length > 0) {
      search.set('name', filter.name);
    }

    if (!isNullOrUndefined(filter.email) && filter.email.length > 0) {
      search.set('email', filter.email);
    }

    return this._http
      .get(this.usersUrl, { headers: headers, search: search })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  // public getUsers(accessToken: string): Observable<User[]> {
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken
  //   });

  //   return this._http
  //     .get(this.usersUrl, { headers: headers })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  // }

  deleteUser(accessToken: string, _id: number) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    return this._http
      .delete(this.usersUrl + '/' + _id.toString(), { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public resetPassword(email: string): Observable<string> {
    const urlreset = environment.urlbase + '/api/aclcontrol/reset';
    const headers = new Headers({
      Accept: 'application/json'
      // Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      email: email
    };
    // _params.set('id', _id.toString());

    return this._http
      .post(urlreset, _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public addUser(accessToken: string, _user: User): Observable<User> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    // const _params: HttpParams = new HttpParams();
    const _body = {
      name: _user.name,
      email: _user.email,
      password: _user.password,
      password_confirmation: _user.confpassword,
      id_perfil: _user.id_perfil,
      inativo: _user.inativo
    };
    // _params.set('id', _id.toString());

    return this._http
      .post(this.usersUrl, _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public editUser(
    accessToken: string,
    _id: number,
    _user: User
  ): Observable<User> {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let retorno: Observable<User>;
    // const _params: HttpParams = new HttpParams();

    if (
      !isNullOrUndefined(_user.password) &&
      !isNullOrUndefined(_user.confpassword)
    ) {
      const _body = {
        name: _user.name,
        email: _user.email,
        password: _user.password,
        password_confirmation: _user.confpassword,
        id_perfil: _user.id_perfil,
        inativo: _user.inativo
      };
      retorno = this._http
        .put(this.usersUrl + '/' + _id.toString(), _body, {
          headers: headers
        })
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json() || 'Server error')
        );
    } else {
      const _body = {
        name: _user.name,
        email: _user.email,
        id_perfil: _user.id_perfil,
        inativo: _user.inativo
      };

      retorno = this._http
        .put(this.usersUrl + '/' + _user.id.toString(), _body, {
          headers: headers
        })
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json() || 'Server error')
        );
    }
    return retorno;
  }

  public changePasswordUsuario(
    accessToken: string,
    _id: number,
    _password: string,
    _confPassword: string
  ): Observable<User[]> {
    const url = environment.urlbase + '/api/aclcontrol/changepassword';
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken.toString().replace(/"/g, '')
    });

    let retorno: Observable<User[]>;

    const _body = {
      password: _password,
      password_confirmation: _confPassword
    };

    retorno = this._http
      .put(url + '/' + _id.toString(), _body, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));

    return retorno;
  }

  downloadPDF(): any {
    const url = environment.urlbase + '/api/relatorios/clientes';
    return this._httpClient.get(url, { responseType: 'blob' }).map(res => {
      return new Blob([res], { type: 'application/pdf' });
    });
  }

  getListPerfis(accessToken: string) {
    const listUrl = environment.urlbase + '/api/aclcontrol/listperfil';
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

  getListUsers(accessToken: string) {
    const listUrl = environment.urlbase + '/api/aclcontrol/listuser';
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
