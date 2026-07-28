export class Municipality {
  constructor({ id, code, name, department }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.department = department; // id del Department, o el subdocumento poblado
  }
}
