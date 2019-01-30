import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { PostoTrabalhoService } from './postotrabalho.service';
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
import { PostoTrabalho } from './postotrabalho';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-postotrabalho-form',
  templateUrl: './postotrabalho-form.component.html',
  styleUrls: ['./postotrabalho-form.component.css']
})
export class PostoTrabalhoFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  postotrabalho: PostoTrabalho;
  postotrabalho_ant: PostoTrabalho;
  emProcessamento = false;
  exibeIncluir = false;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('postotrabalhoForm') public form: NgForm;

  constructor(
    private _postotrabalhoService: PostoTrabalhoService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService
  ) {}

  validaCampos(form: NgForm) {
    return form.form.valid;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.postotrabalho = new PostoTrabalho();
    this.postotrabalho_ant = new PostoTrabalho();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._postotrabalhoService
          .getPostoTrabalho(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(dt => {
            this.postotrabalho = dt.json();
            this.postotrabalho_ant = dt.json();
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
      if (isNullOrUndefined(this.postotrabalho.id)) {
        this._postotrabalhoService
          .addPostoTrabalho(this._tokenManager.retrieve(), this.postotrabalho)
          .subscribe(
            data => {
              this.emProcessamento = false;
              this.postotrabalho = data;
              this.postotrabalho_ant = data;
              this.exibeIncluir = true;
              form.resetForm();
              this.dialog.success('SIH', 'Posto de Trabalho salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SIH',
                'Erro ao salvar o registro.',
                error.error + ' - Detalhe: ' + error.message
              );
            }
          );
      } else {
        this._postotrabalhoService
          .editPostoTrabalho(
            this._tokenManager.retrieve(),
            this.postotrabalho.id,
            this.postotrabalho
          )
          .subscribe(
            data => {
              this.emProcessamento = false;
              this.postotrabalho = data;
              this.postotrabalho_ant = data;
              this.exibeIncluir = true;
              form.resetForm();
              this.dialog.success('SIH', 'Posto de Trabalho salvo com sucesso.');
            },
            error => {
              this.emProcessamento = false;
              this.dialog.error(
                'SIH',
                'Erro ao salvar o registro.',
                error.error + ' - Detalhe: ' + error.message
              );
            }
          );
      }
    } else {
      this.emProcessamento = false;
      this.dialog.warning('SIH', 'Campos obrigatórios não preenchidos');
    }
  }

  btnIncluir_click(form: NgForm) {
    this.postotrabalho = new PostoTrabalho();
    this.postotrabalho_ant = new PostoTrabalho();
    // form.form.reset();
    // form.controls['descricao'].reset('');
    form.controls['descricao'].clearValidators();
    document.getElementById('descricao').focus();
  }

  getDescricaoErrorMessage(control: any) {
    let mensagem = '';

    if (control.hasError('required')) {
      mensagem = mensagem + 'Campo obrigatório.';
    }
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (JSON.stringify(this.postotrabalho) === JSON.stringify(this.postotrabalho_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
