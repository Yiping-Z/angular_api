export class User {
  public name: string;
  public contact: string;
  public email: string;
  public id: number;
  constructor(name: string, contact: string, email: string, id: number) {
    this.name = name;
    this.contact = contact;
    this.email = email;
    this.id = id;
  }
}
