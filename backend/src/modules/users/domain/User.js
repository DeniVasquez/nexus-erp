export class User {
  constructor({ id, name, email, password, role, isActive = true, lastLogin, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email?.toLowerCase();
    this.password = password; // hash, nunca se expone en las respuestas HTTP
    this.role = role; // id del Role, o el subdocumento poblado según la consulta
    this.isActive = isActive;
    this.lastLogin = lastLogin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
