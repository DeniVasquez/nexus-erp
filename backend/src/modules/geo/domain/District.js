export class District {
  constructor({ id, code, name, municipality }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.municipality = municipality; // id de Municipality, o el subdocumento poblado
  }
}
