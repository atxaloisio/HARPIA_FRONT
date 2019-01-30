import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { UserService } from './user.service';
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
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { User } from './user';
import { passwordEqualsValidator } from './password-equals.directive';
import { Perfil } from '../perfil/perfil';

@Component({
  selector: 'app-user-form',
  templateUrl: './useradd-form.component.html',
  styleUrls: ['./useradd-form.component.css']
})
export class UserAddFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  hide = true;
  user: User;
  user_ant: User;
  emProcessamento = false;
  exibeIncluir = false;
  perfis: Perfil[];

  valPerfil = new FormControl('', [Validators.required]);
  valNome = new FormControl('', [Validators.required]);
  valEmail = new FormControl('', [Validators.email, Validators.required]);
  valPassword = new FormControl('', [Validators.minLength(6), Validators.required]);
  valConfPassword = new FormControl('', [
    Validators.minLength(6),
    Validators.required,
    passwordEqualsValidator(this.valPassword)
  ]);

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('userForm') public form: NgForm;

  constructor(
    private _userService: UserService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService
  ) {}

  validaCampos(form: NgForm) {
    return form.form.valid;
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.user = new User();
    this.user_ant = new User();

    this.perfis = new Array<Perfil>();
    this._userService.getListPerfis(this._tokenManager.retrieve()).subscribe(data => {
      this.perfis = data.json();
    });

    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._userService
          .getUser(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(dt => {
            this.user = dt.json();
            this.user_ant = dt.json();
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
      if (isNullOrUndefined(this.user.id)) {
        this._userService.addUser(this._tokenManager.retrieve(), this.user).subscribe(
          data => {
            this.emProcessamento = false;
            this.user = data;
            this.user_ant = data;
            this.exibeIncluir = true;
            form.resetForm();
            this.dialog.success('SIH', 'Usuário salvo com sucesso.');
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
        this._userService
          .editUser(this._tokenManager.retrieve(), this.user.id, this.user)
          .subscribe(
            data => {
              this.emProcessamento = false;
              this.user = data;
              this.user_ant = data;
              this.exibeIncluir = true;
              form.resetForm();
              this.dialog.success('SIH', 'Usuário salvo com sucesso.');
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
    this.user = new User();
    this.user_ant = new User();
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

  getEmailErrorMessage() {
    let mensagem = '';
    if (this.valEmail.hasError('required')) {
      mensagem = 'Campo e-mail não informado.';
    }

    if (mensagem === '') {
      if (this.valEmail.hasError('email')) {
        mensagem = 'e-mail inválido.';
      }
    }
    return mensagem;
  }

  getErrorMessage(control: FormControl) {
    let mensagem = '';
    if (control.hasError('required')) {
      mensagem = 'Campo obrigatório.';
    }

    if (mensagem === '') {
      if (control.hasError('email')) {
        mensagem = 'e-mail inválido.';
      }
    }

    if (mensagem === '') {
      if (control.hasError('pwsinvalid')) {
        mensagem = 'Senhas informadas não conferem .';
      }
    }
    return mensagem;
  }

  // onEnter(value: string) {
  //   if (value !== '') {
  //     this.onEntrarClick();
  //   }
  // }

  getPasswordErrorMessage() {
    const mensagem = '';
    return mensagem;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (JSON.stringify(this.user) === JSON.stringify(this.user_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
