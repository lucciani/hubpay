export class AdicionarUsuarioResponseDTO {
  id?: number;
  secretId?: string;
  empresaId?: number;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: number,
    secretId: string,
    empresaId: number,
    ativo: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.secretId = secretId;
    this.empresaId = empresaId;
    this.ativo = ativo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
