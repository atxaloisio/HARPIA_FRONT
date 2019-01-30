
import { Router } from '@angular/router';
import { DialogService } from './../dialog/dialog.service';
import { by } from 'protractor';
import { FormControl } from '@angular/forms';
import { DsEmpresa } from './dsempresa';
import { TokenManagerService } from './../token-manager.service';
import { EmpresaService } from './empresa.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort, MatDialog } from '@angular/material';
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
import { Empresa } from './empresa';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { AddEmpresaComponent } from './addempresa.component';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'cnpj', 'razao_social', 'nome_fantasia'];
  // displayedColumns = ['id', 'codigo', 'nome_fantasia'];
  dataSource: DsEmpresa | null;
  selectedRowIndex = -1;
  selectedRow: any | null;
  empresas: Empresa[];
  isLoadingResults: boolean;

  idFilter = new FormControl();
  cnpjFilter = new FormControl();
  razaoSocialFilter = new FormControl();
  nomeFantasiaFilter = new FormControl();

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
    private _empresaService: EmpresaService,
    private _tokenManager: TokenManagerService,
    private dialog: DialogService,
    public modal: MatDialog,
    private _router: Router
  ) {}

  obterEmpresas() {
    // const token = this._tokenManager.retrieve();
    // this._empresaService.getEmpresas(token).subscribe(data => {
    //   this.empresas = data.data;
    //   console.log(data);
    //   console.log(this.empresas.length);
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
    this._router.navigate(['/empresas/empresa', { id: row.id }]);
  }

  //#region botões de ação
  btnEditar_click() {
    this.editarRegistro();
    this.ngOnInit();
  }

  btnIncluir_click() {
    // this.incluirRegistro();
    this.openAddEmpresa();
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
    this._router.navigate(['/empresas/empresa']);
  }

  editarRegistro() {
    if (this.validaSelecao()) {
      this._router.navigate(['/empresas/empresa', { id: this.selectedRow.id }]);
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
          'Deseja realmente excluir a empresa: ' +
            this.selectedRow.id +
            '-' +
            this.selectedRow.nome_fantasia +
            '?'
        )
        .subscribe(result => {
          if (result.retorno) {
            this._empresaService
              .deleteEmpresa(this._tokenManager.retrieve(), this.selectedRow.id)
              .subscribe(
                data => {
                  this.dialog.success('SIH', 'Empresa excluída com sucesso.');
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

    this.dataSource = new DsEmpresa(
      this._tokenManager,
      this._empresaService,
      this.paginator,
      this.sort
    );

    const idFilter$ = this.idFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    const cnpjFilter$ = this.cnpjFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    const razaoSocialFilter$ = this.razaoSocialFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');
    const nomeFantasiaFilter$ = this.nomeFantasiaFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .startWith('');

    combineLatest(
      idFilter$,
      cnpjFilter$,
      razaoSocialFilter$,
      nomeFantasiaFilter$
    )
      .debounceTime(500)
      .distinctUntilChanged()
      .map(([id, cnpj, razao_social, nome_fantasia]) => ({
        id,
        cnpj,
        razao_social,
        nome_fantasia
      }))
      .subscribe(filter => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = filter;
      });
  }

  openAddEmpresa(): void {
    const dialogAddEmpresaRef = this.modal.open(AddEmpresaComponent, {
      width: '400px',
      height: '300px',
      disableClose: true,
      data: { app_key: '', app_secret: '' }
    });

    dialogAddEmpresaRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
