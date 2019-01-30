
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsUser } from './dsuser';
import { TokenManagerService } from './../token-manager.service';
import { UserService } from './user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/combineLatest';
import { User } from './user';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';

@Component({
  selector: 'app-user',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'email', 'perfil', 'inativo'];
  // displayedColumns = ['id', 'codigo', 'descricao'];
  dataSource: DsUser | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  users: User[];
  isLoadingResults: boolean;

  idFilter = new FormControl();
  nameFilter = new FormControl();
  emailFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(
    private _userService: UserService,
    private _tokenManager: TokenManagerService,
    private dialog: DialogService,
    private _router: Router
  ) {}

  obterUsers() {
    // const token = this._tokenManager.retrieve();
    // this._userService.getUsers(token).subscribe(data => {
    //   this.users = data.data;
    //   console.log(data);
    //   console.log(this.users.length);
    //   console.log(token);
    // });
  }

  highlight(row) {
    if (this.selectedRowIndex === row.id) {
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    } else {
      this.selectedRowIndex = row.id;
      this.selectedRow = row;
    }
  }

  dblck(row) {
    this._router.navigate(['/users/edituser/', { id: row.id }]);
  }

  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
  }

  btnIncluir_click() {
    this.incluirRegistro();
  }

  btnExcluir_click() {
    this.excluirRegistro();
  }
  //#endregion

  /**
   * Metodo que verifica se existe registro selecionado na grid.
   */
  validaSelecao(): boolean {
    if (this.selectedRowIndex === -1) {
      this.dialog.warning('SIH', 'Nenhum registro selecionado na grade.');
      return false;
    } else {
      return true;
    }
  }

  incluirRegistro() {
    this._router.navigate(['/users/adduser']);
  }

  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/users/edituser/', { id: this.selectedRow.id }]);
      this.ngOnInit();
      this.selectedRowIndex = -1;
      this.selectedRow = null;
    }
  }

  excluirRegistro() {
    if (this.validaSelecao()) {
      this.dialog
        .question(
          'SIH',
          'Deseja realmente excluir o user: ' + this.selectedRow.id + '?'
        )
        .subscribe(result => {
          if (result.retorno) {
            this._userService
              .deleteUser(this._tokenManager.retrieve(), this.selectedRow.id)
              .subscribe(
                data => {
                  this.dialog.success('SIH', 'Usuário excluído com sucesso.');
                  this.ngOnInit();
                },
                error => {
                  this.dialog.error(
                    'SIH',
                    'Erro ao excluir o registro.',
                    error.error + ' - Detalhe: ' + error.message
                  );
                }
              );
            this.selectedRowIndex = -1;
            this.selectedRow = null;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.onChange.subscribe({
      next: (event: boolean) => {
        this.isLoadingResults = event;
        // console.log('estatus do datasource: ' + event);
      }
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por pagina';
    this.paginator._intl.nextPageLabel = 'Próxima Página';
    this.paginator._intl.previousPageLabel = 'Voltar Página';

    this.dataSource = new DsUser(
      this._tokenManager,
      this._userService,
      this.paginator,
      this.sort
    );

    const idFilter$ = this.idFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');

    const nameFilter$ = this.nameFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');

    const emailFilter$ = this.emailFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');

    combineLatest(idFilter$, nameFilter$, emailFilter$)
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id, name, email]) => ({ id, name, email }))
      .subscribe(filter => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = filter;
      });
  }
}
