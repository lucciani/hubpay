export class AuthenticateResponseDTO {
  id?: number;
  secretId?: string;
  empresaId?: number;

  constructor(id?: number, secretId?: string, empresaId?: number) {
    this.id = id;
    this.secretId = secretId;
    this.empresaId = empresaId;
  }
}
