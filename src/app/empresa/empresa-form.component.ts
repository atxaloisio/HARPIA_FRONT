import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { EmpresaService } from './empresa.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { by } from 'protractor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ChangeDetectorRef, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { OnlyNumberDirective } from './../only-number.directive';
import { Empresa } from './empresa';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css']
})
export class EmpresaFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  empresa: Empresa;
  empresa_ant: Empresa;
  emProcessamento = false;
  exibeIncluir = false;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('empresaForm') public form: NgForm;

  constructor(
    private _empresaService: EmpresaService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService
  ) {}

  validaCampos(form: NgForm) {
    return form.form.valid;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.empresa = new Empresa();
    this.empresa_ant = new Empresa();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._empresaService
          .getEmpresa(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(dt => {
            this.empresa = dt.json();
            this.empresa_ant = dt.json();
            // console.log(1);
            this.emProcessamento = false;
          });
      } else {
        this.emProcessamento = false;
      }
    });
  }

  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
    // this.vc.first.nativeElement.focus();
    // Promise.resolve(null).then(() => this.focuscomp.nativeElement.focus());
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  btnSalvar_click(form: NgForm) {
    this.emProcessamento = true;
    if (this.validaCampos(form)) {
      // if (isNullOrUndefined(this.empresa.id)) {
      //   this._empresaService.addEmpresa(
      //     this._tokenManager.retrieve(),
      //     this.empresa).subscribe(
      //       data => {
      //         this.emProcessamento = false;
      //         this.empresa = data;
      //         this.empresa_ant = data;
      //         this.exibeIncluir = true;
      //         form.resetForm();
      //         this.dialog.success('SIH', 'Empresa salvo com sucesso.');
      //       },
      //       error => {
      //         this.emProcessamento = false;
      //         this.dialog.error('SIH', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
      //       },
      //     );
      // } else {
      //   this._empresaService.editEmpresa(
      //     this._tokenManager.retrieve(),
      //     this.empresa.id,
      //     this.empresa).subscribe(
      //     data => {
      //     this.emProcessamento = false;
      //     this.empresa = data;
      //     this.empresa_ant = data;
      //     this.exibeIncluir = true;
      //     form.resetForm();
      //     this.dialog.success('SIH', 'Empresa salvo com sucesso.');
      //   },
      //   error => {
      //     this.emProcessamento = false;
      //     this.dialog.error('SIH', 'Erro ao salvar o registro.', error.error + ' - Detalhe: ' + error.message);
      //   },
      // );
      // }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SIH', 'Campos obrigatórios não preenchidos');
    }
  }

  btnIncluir_click(form: NgForm) {
    this.empresa = new Empresa();
    this.empresa_ant = new Empresa();
    // form.form.reset();
    // form.controls['nome_fantasia'].reset('');
    form.controls['nome_fantasia'].clearValidators();
    document.getElementById('nome_fantasia').focus();
  }

  getDescricaoErrorMessage(control: any) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (JSON.stringify(this.empresa) === JSON.stringify(this.empresa_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
