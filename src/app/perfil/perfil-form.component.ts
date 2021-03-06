import { isNullOrUndefined } from 'util';
import { DialogService } from './../dialog/dialog.service';
import { TokenManagerService } from './../token-manager.service';
import { PerfilService } from './perfil.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input } from '@angular/core';
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
import { Perfil } from '../perfil/perfil';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { booleanToStrSN, strToBoolean } from '../utilitario/utilitarios';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css']
})
export class PerfilFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  perfil: Perfil;
  perfil_ant: Perfil;
  emProcessamento = false;
  exibeIncluir = false;
  _cadastros = false;
  _desabilitacad = false;
  cadastros_indeterminado = false;
  _processos = false;
  _desabilitaproc = false;
  processos_indeterminado = false;
  _relatorios = false;
  _desabilitarel = false;
  relatorios_indeterminado = false;
  _utilitarios = false;
  _desabilitautil = false;
  utilitarios_indeterminado = false;
  _aclcontrol = false;
  _desabilitaacl = false;
  aclcontrol_indeterminado = false;

  @ViewChildren('input') vc;
  @ViewChild('focuscomp') focuscomp: ElementRef;
  @ViewChild('perfilForm') public form: NgForm;

  //#region Campos cadastro
  @Input('funcao')
  set funcao(funcao: boolean) {
    this.perfil.cadastros_funcao = booleanToStrSN(funcao);
    if (!this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get funcao(): boolean {
    return strToBoolean(this.perfil.cadastros_funcao);
  }

  @Input('empresa')
  set empresa(empresa: boolean) {
    this.perfil.cadastros_empresa = booleanToStrSN(empresa);
    if (!this._desabilitacad) {
      this.marcaCadastro();
    }
  }
  get empresa(): boolean {
    return strToBoolean(this.perfil.cadastros_empresa);
  }

  //#endregion

  //#region Campos Processos

  @Input('parametro_contrato')
  set parametro_contrato(parametro_contrato: boolean) {
    this.perfil.processos_parametro_contrato = booleanToStrSN(parametro_contrato);
    if (!this._desabilitaproc) {
      this.marcaProcesso();
    }
  }
  get parametro_contrato(): boolean {
    return strToBoolean(this.perfil.processos_parametro_contrato);
  }

  @Input('faturamento_contrato')
  set faturamento_contrato(faturamento_contrato: boolean) {
    this.perfil.processos_faturamento_contrato = booleanToStrSN(faturamento_contrato);
    if (!this._desabilitaproc) {
      this.marcaProcesso();
    }
  }
  get faturamento_contrato(): boolean {
    return strToBoolean(this.perfil.processos_faturamento_contrato);
  }

  //#endregion

  //#region campos utilitarios
  @Input('sincronizar')
  set sincronizar(sincronizar: boolean) {
    this.perfil.utilitarios_sincronizar = booleanToStrSN(sincronizar);
    if (!this._desabilitautil) {
      this.marcaUtilitario();
    }
  }
  get sincronizar(): boolean {
    return strToBoolean(this.perfil.utilitarios_sincronizar);
  }
  //#endregion

  //#region Campos Relatorio
  // @Input('listagem_fornecedores')
  // set listagem_fornecedores(listagem_fornecedores: boolean) {
  //   this.perfil.relatorios_listagem_fornecedores = booleanToStrSN(listagem_fornecedores);
  //   if (!this._desabilitarel) {
  //     this.marcaRelatorio();
  //   }
  // }
  // get listagem_fornecedores(): boolean {
  //   return strToBoolean(this.perfil.relatorios_listagem_fornecedores);
  // }

  // @Input('listagem_parametro_contrato')
  // set listagem_parametro_contrato(listagem_parametro_contrato: boolean) {
  //   this.perfil.relatorios_listagem_parametro_contrato = booleanToStrSN(listagem_parametro_contrato);
  //   if (!this._desabilitarel) {
  //     this.marcaRelatorio();
  //   }
  // }
  // get listagem_parametro_contrato(): boolean {
  //   return strToBoolean(this.perfil.relatorios_listagem_parametro_contrato);
  // }

  // @Input('relatorios_parametro_contrato')
  // set relatorios_parametro_contrato(relatorios_parametro_contrato: boolean) {
  //   this.perfil.relatorios_parametro_contrato = booleanToStrSN(relatorios_parametro_contrato);
  //   if (!this._desabilitarel) {
  //     this.marcaRelatorio();
  //   }
  // }
  // get relatorios_parametro_contrato(): boolean {
  //   return strToBoolean(this.perfil.relatorios_parametro_contrato);
  // }
  //#endregion

  //#region Campos Controle de Acesso
  @Input('aclcontrol_usuario')
  set aclcontrol_usuario(aclcontrol_usuario: boolean) {
    this.perfil.aclcontrol_usuario = booleanToStrSN(aclcontrol_usuario);
    if (!this._desabilitaacl) {
      this.marcaAclControl();
    }
  }
  get aclcontrol_usuario(): boolean {
    return strToBoolean(this.perfil.aclcontrol_usuario);
  }

  @Input('aclcontrol_redefinir_senha')
  set aclcontrol_redefinir_senha(aclcontrol_redefinir_senha: boolean) {
    this.perfil.aclcontrol_redefinir_senha = booleanToStrSN(aclcontrol_redefinir_senha);
    if (!this._desabilitaacl) {
      this.marcaAclControl();
    }
  }
  get aclcontrol_redefinir_senha(): boolean {
    return strToBoolean(this.perfil.aclcontrol_redefinir_senha);
  }

  // @Input('aclcontrol_alterar_usuario')
  // set aclcontrol_alterar_usuario(aclcontrol_alterar_usuario: boolean) {
  //   this.perfil.aclcontrol_alterar_usuario = booleanToStrSN(aclcontrol_alterar_usuario);
  //   if (!this._desabilitaacl) {
  //     this.marcaAclControl();
  //   }
  // }
  // get aclcontrol_alterar_usuario(): boolean {
  //   return strToBoolean(this.perfil.aclcontrol_alterar_usuario);
  // }

  // @Input('aclcontrol_usuario_centro_custo')
  // set aclcontrol_usuario_centro_custo(aclcontrol_usuario_centro_custo: boolean) {
  //   this.perfil.aclcontrol_usuario_centro_custo = booleanToStrSN(aclcontrol_usuario_centro_custo);
  //   if (!this._desabilitaacl) {
  //     this.marcaAclControl();
  //   }
  // }
  // get aclcontrol_usuario_centro_custo(): boolean {
  //   return strToBoolean(this.perfil.aclcontrol_usuario_centro_custo);
  // }

  @Input('aclcontrol_usuario_empresa')
  set aclcontrol_usuario_empresa(aclcontrol_usuario_empresa: boolean) {
    this.perfil.aclcontrol_usuario_empresa = booleanToStrSN(aclcontrol_usuario_empresa);
    if (!this._desabilitaacl) {
      this.marcaAclControl();
    }
  }
  get aclcontrol_usuario_empresa(): boolean {
    return strToBoolean(this.perfil.aclcontrol_usuario_empresa);
  }

  @Input('aclcontrol_perfil')
  set aclcontrol_perfil(aclcontrol_perfil: boolean) {
    this.perfil.aclcontrol_perfil = booleanToStrSN(aclcontrol_perfil);
    if (!this._desabilitaacl) {
      this.marcaAclControl();
    }
  }
  get aclcontrol_perfil(): boolean {
    return strToBoolean(this.perfil.aclcontrol_perfil);
  }
  //#endregion

  @Input('cadastros')
  set cadastros(cadastros: boolean) {
    if (!this._desabilitacad) {
      this._cadastros = cadastros;
      this._desabilitacad = true;
      if (cadastros) {
        this.cadastros_indeterminado = false;
        this.funcao = true;
        this.empresa = true;
        this.perfil.cadastros = booleanToStrSN(true);
      } else {
        this.cadastros_indeterminado = false;
        this.funcao = false;
        this.empresa = false;
        this.perfil.cadastros = booleanToStrSN(false);
      }
      this._desabilitacad = false;
    }
  }
  get cadastros(): boolean {
    return this._cadastros;
  }

  @Input('processos')
  set processos(processos: boolean) {
    if (!this._desabilitaproc) {
      this._processos = processos;
      this._desabilitaproc = true;
      if (processos) {
        this.processos_indeterminado = false;
        this.parametro_contrato = true;
        this.faturamento_contrato = true;
        this.perfil.processos = booleanToStrSN(true);
      } else {
        this.processos_indeterminado = false;
        this.parametro_contrato = false;
        this.faturamento_contrato = false;
        this.perfil.processos = booleanToStrSN(false);
      }
      this._desabilitaproc = false;
    }
  }
  get processos(): boolean {
    return this._processos;
  }

  @Input('utilitarios')
  set utilitarios(utilitarios: boolean) {
    if (!this._desabilitautil) {
      this._utilitarios = utilitarios;
      this._desabilitautil = true;
      if (utilitarios) {
        this.utilitarios_indeterminado = false;
        this.parametro_contrato = true;
        this.faturamento_contrato = true;
        this.perfil.processos = booleanToStrSN(true);
      } else {
        this.utilitarios_indeterminado = false;
        this.sincronizar = false;
        this.perfil.utilitarios = booleanToStrSN(false);
      }
      this._desabilitautil = false;
    }
  }
  get utilitarios(): boolean {
    return this._utilitarios;
  }

  // @Input('relatorios')
  // set relatorios(relatorios: boolean) {
  //   if (!this._desabilitarel) {
  //     this._relatorios = relatorios;
  //     this._desabilitarel = true;
  //     if (relatorios) {
  //       this.relatorios_indeterminado = false;
  //       this.listagem_fornecedores = true;
  //       this.listagem_parametro_contrato = true;
  //       this.relatorios_parametro_contrato = true;
  //       this.perfil.relatorios = booleanToStrSN(true);
  //     } else {
  //       this.relatorios_indeterminado = false;
  //       this.listagem_fornecedores = false;
  //       this.listagem_parametro_contrato = false;
  //       this.relatorios_parametro_contrato = false;
  //       this.perfil.relatorios = booleanToStrSN(false);
  //     }
  //   }
  //   this._desabilitarel = false;
  // }
  // get relatorios(): boolean {
  //   return this._relatorios;
  // }

  @Input('aclcontrol')
  set aclcontrol(aclcontrol: boolean) {
    if (!this._desabilitaacl) {
      this._aclcontrol = aclcontrol;
      this._desabilitaacl = true;
      if (aclcontrol) {
        this.aclcontrol_indeterminado = false;
        this.aclcontrol_usuario = true;
        this.aclcontrol_redefinir_senha = true;
        // this.aclcontrol_alterar_usuario = true;
        // this.aclcontrol_usuario_centro_custo = true;
        this.aclcontrol_usuario_empresa = true;
        this.aclcontrol_perfil = true;
        this.perfil.aclcontrol = booleanToStrSN(true);
      } else {
        this.aclcontrol_indeterminado = false;
        this.aclcontrol_usuario = false;
        this.aclcontrol_redefinir_senha = false;
        // this.aclcontrol_alterar_usuario = false;
        // this.aclcontrol_usuario_centro_custo = false;
        this.aclcontrol_usuario_empresa = false;
        this.aclcontrol_perfil = false;
        this.perfil.aclcontrol = booleanToStrSN(false);
      }
    }
    this._desabilitaacl = false;
  }
  get aclcontrol(): boolean {
    return this._aclcontrol;
  }

  constructor(
    private _perfilService: PerfilService,
    private _tokenManager: TokenManagerService,
    private _route: ActivatedRoute,
    private dialog: DialogService
  ) {}

  validaCampos(form: NgForm) {
    return form.form.valid;
  }

  marcaCadastro() {
    if (this.funcao && this.empresa) {
      this.cadastros = true;
      this.perfil.cadastros = booleanToStrSN(true);
      this.cadastros_indeterminado = false;
    } else {
      if ((this.funcao || this.empresa) && !this.cadastros_indeterminado) {
        this.cadastros_indeterminado = true;
        this.perfil.cadastros = booleanToStrSN(true);
      } else {
        if (!this.funcao && !this.empresa) {
          this.cadastros = false;
          this.cadastros_indeterminado = false;
          this.perfil.cadastros = booleanToStrSN(false);
        }
      }
    }
  }

  marcaProcesso() {
    if (this.parametro_contrato && this.faturamento_contrato) {
      this.processos = true;
      this.perfil.processos = booleanToStrSN(true);
      this.processos_indeterminado = false;
    } else {
      if ((this.parametro_contrato || this.faturamento_contrato) && !this.processos_indeterminado) {
        this.processos_indeterminado = true;
        this.perfil.processos = booleanToStrSN(true);
      } else {
        if (!this.parametro_contrato && !this.faturamento_contrato) {
          this.processos = false;
          this.processos_indeterminado = false;
          this.perfil.processos = booleanToStrSN(false);
        }
      }
    }
  }

  marcaUtilitario() {
    if (this.sincronizar) {
      this.utilitarios = true;
      this.perfil.utilitarios = booleanToStrSN(true);
      this.utilitarios_indeterminado = false;
    } else {
      if (this.sincronizar && !this.utilitarios_indeterminado) {
        this.utilitarios_indeterminado = true;
        this.perfil.utilitarios = booleanToStrSN(true);
      } else {
        if (!this.sincronizar) {
          this.utilitarios = false;
          this.utilitarios_indeterminado = false;
          this.perfil.utilitarios = booleanToStrSN(false);
        }
      }
    }
  }

  // marcaRelatorio() {
  //   if (this.listagem_fornecedores && this.listagem_parametro_contrato && this.relatorios_parametro_contrato) {
  //     this.relatorios = true;
  //     this.perfil.relatorios = booleanToStrSN(true);
  //     this.relatorios_indeterminado = false;
  //   } else {
  //     if (
  //       (this.listagem_fornecedores || this.listagem_parametro_contrato || this.relatorios_parametro_contrato) &&
  //       !this.relatorios_indeterminado
  //     ) {
  //       this.relatorios_indeterminado = true;
  //       this.perfil.relatorios = booleanToStrSN(true);
  //     } else {
  //       if (!this.listagem_fornecedores && !this.listagem_parametro_contrato && !this.relatorios_parametro_contrato) {
  //         this.relatorios = false;
  //         this.relatorios_indeterminado = false;
  //         this.perfil.relatorios = booleanToStrSN(false);
  //       }
  //     }
  //   }
  // }

  marcaAclControl() {
    if (
      this.aclcontrol_usuario &&
      this.aclcontrol_redefinir_senha &&
      // this.aclcontrol_alterar_usuario &&
      // this.aclcontrol_usuario_centro_custo &&
      this.aclcontrol_usuario_empresa &&
      this.aclcontrol_perfil
    ) {
      this.aclcontrol = true;
      this.perfil.aclcontrol = booleanToStrSN(true);
      this.aclcontrol_indeterminado = false;
    } else {
      if (
        (this.aclcontrol_usuario ||
          this.aclcontrol_redefinir_senha ||
          // this.aclcontrol_alterar_usuario ||
          // this.aclcontrol_usuario_centro_custo ||
          this.aclcontrol_usuario_empresa ||
          this.aclcontrol_perfil) &&
        !this.aclcontrol_indeterminado
      ) {
        this.aclcontrol_indeterminado = true;
        this.perfil.aclcontrol = booleanToStrSN(true);
      } else {
        if (
          !this.aclcontrol_usuario &&
          !this.aclcontrol_redefinir_senha &&
          // !this.aclcontrol_alterar_usuario &&
          // !this.aclcontrol_usuario_centro_custo &&
          !this.aclcontrol_usuario_empresa &&
          !this.aclcontrol_perfil
        ) {
          this.aclcontrol = false;
          this.aclcontrol_indeterminado = false;
          this.perfil.aclcontrol = booleanToStrSN(false);
        }
      }
    }
  }

  ngOnInit() {
    this.emProcessamento = true;
    this.perfil = new Perfil();
    this.perfil_ant = new Perfil();
    this._route.params.forEach((params: Params) => {
      const id: number = +params['id'];
      if (id) {
        this._perfilService
          .getPerfil(this._tokenManager.retrieve(), id)
          .retry(3)
          .subscribe(dt => {
            this.perfil = dt.json();
            this.marcaCadastro();
            this.marcaProcesso();
            // this.marcaRelatorio();
            this.marcaAclControl();
            this.perfil_ant = dt.json();
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
      if (isNullOrUndefined(this.perfil.id)) {
        this._perfilService.addPerfil(this._tokenManager.retrieve(), this.perfil).subscribe(
          data => {
            this.emProcessamento = false;
            this.perfil = data;
            this.perfil_ant = data;
            this.exibeIncluir = true;
            form.resetForm();
            this.dialog.success('SIH', 'Perfil salvo com sucesso.');
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
        this._perfilService
          .editPerfil(this._tokenManager.retrieve(), this.perfil.id, this.perfil)
          .subscribe(
            data => {
              this.emProcessamento = false;
              this.perfil = data;
              this.perfil_ant = data;
              this.exibeIncluir = true;
              form.resetForm();
              this.dialog.success('SIH', 'Perfil salvo com sucesso.');
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
    this.perfil = new Perfil();
    this.perfil_ant = new Perfil();
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
    if (JSON.stringify(this.perfil) === JSON.stringify(this.perfil_ant)) {
      return true;
    }
    return this.dialog.confirm('Existem dados não salvos. Deseja descarta-los?');
  }
}
