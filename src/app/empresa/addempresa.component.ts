import { isNullOrUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { EmpresaService } from './empresa.service';
import { TokenManagerService } from '../token-manager.service';

@Component({
  selector: 'app-addempresa',
  templateUrl: './addempresa.component.html',
  styleUrls: ['./addempresa.component.css']
})
export class AddEmpresaComponent implements OnInit {
  hide = true;

  private _app_key = '';
  private _app_secret = '';

  erroLogin: boolean;
  msgErroLogin = '';
  emProcessamento = false;

  @Input('app_key')
  set app_key(app_key: string) {
    this._app_key = app_key;
  }
  get app_key(): string {
    return this._app_key;
  }

  @Input('app_secret')
  set app_secret(app_secret: string) {
    this._app_secret = app_secret;
  }
  get app_secret(): string {
    return this._app_secret;
  }

  valAppKey = new FormControl('', [Validators.required]);
  valAppSecret = new FormControl('', [Validators.required]);

  constructor(
    private _empresaService: EmpresaService,
    private _tokenManager: TokenManagerService,
    private _snackBar: MatSnackBar,
    public dialogLoginRef: MatDialogRef<AddEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  validaCampos(): boolean {
    return this.valAppKey.valid && this.valAppSecret.valid;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000
    });
  }

  onEntrarClick(): void {
    this.emProcessamento = true;
    if (this.validaCampos()) {
      this._empresaService
        .syncEmpresaOmie(
          this._tokenManager.retrieve(),
          this.app_key,
          this.app_secret
        )
        .subscribe(
          data => {
            this.emProcessamento = false;
            this.openSnackBar(
              'Empresa ' +
                data.json().nome_fantasia +
                ' importada com sucesso.',
              'SIH'
            );
            this.dialogLoginRef.close(this.data);
          },
          error => {
            this.emProcessamento = false;
            this.openSnackBar(error.message, error.error);
          }
        );
    }

    // this.data.logado = false;
    // let mensagem = '';

    // if (isNullOrUndefined(this.data.email)) {
    //   mensagem = 'e-mail do usuário não informado.';
    // }

    // if (isNullOrUndefined(this.data.password)) {
    //   if (!isNullOrUndefined(mensagem)) {
    //       mensagem = mensagem + '/n';
    //   }
    //   mensagem = mensagem + 'e-mail do usuário não informado.';
    // }

    // if ((!isNullOrUndefined(this.data.email)) &&
    //    (!isNullOrUndefined(this.data.password))) {
    //     this.loginService.Login(this.data.email, this.data.password).subscribe(data => {
    //       // console.log(data);
    //       this.data.Usuario = data.usuario;
    //       this.data.Perfil = data.perfil;
    //       // console.log(this.Usuario.name);
    //       // console.log(data.token);
    //       // this.getUsuarios(data.token);
    //       this.data.token = data.token;
    //       this.data.logado = data.logado;
    //       // this.emProcessamento = false;
    //       this.dialogLoginRef.close(this.data);
    //     },
    //       error => {
    //         this.setErroMsg(error);
    //     });
    // }
  }

  setErroMsg(erro: any) {
    if (!isNullOrUndefined(erro.error) && isNullOrUndefined(erro.message)) {
      this.msgErroLogin = erro.error + ' ' + erro.message;
    } else {
      this.msgErroLogin = 'Não foi possivel se comunicar com o servidor';
    }

    this.erroLogin = true;
    this.emProcessamento = false;
  }

  onNoClick(): void {
    this.data = null;
    this.dialogLoginRef.close(this.data);
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

  onEnter(value: string) {
    if (value !== '') {
      this.onEntrarClick();
    }
  }

  getPasswordErrorMessage() {
    const mensagem = '';
    return mensagem;
  }
}
