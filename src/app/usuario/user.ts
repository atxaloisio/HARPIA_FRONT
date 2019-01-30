export interface UserFilter {
  id: string;
  name: string;
  email: string;
}

export class User {
  constructor(
    public id: number = null,
    public name: string = '',
    public email: string = '',
    public password: string = '',
    public confpassword: string = '',
    public id_perfil: number = null,
    public inativo: string = 'N',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}

  equals(_user: User): boolean {
    return (
      this.name === _user.name &&
      this.email === _user.email &&
      this.password === _user.password &&
      this.inativo === _user.inativo &&
      this.id_perfil === _user.id_perfil
    );
  }
}
