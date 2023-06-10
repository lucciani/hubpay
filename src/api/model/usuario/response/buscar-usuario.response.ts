import { ApiProperty } from '@nestjs/swagger';

export class BuscarUsuarioResponseDTO {
  @ApiProperty({
    description: 'Identificador do usuário',
    example: '1',
    type: Number,
  })
  id?: number;

  @ApiProperty({
    description: 'Secret id do usuário',
    example: '1231',
    type: String,
  })
  secretId?: string;

  @ApiProperty({
    description: 'Identificador da empresa',
    example: '1',
    type: Number,
  })
  empresaId?: number;

  @ApiProperty({
    description: 'Nome da empresa',
    example: '1',
    type: String,
  })
  nomeEmpresa?: string;

  constructor(
    id?: number,
    secretId?: string,
    empresaId?: number,
    nomeEmpresa?: string,
  ) {
    this.id = id;
    this.secretId = secretId;
    this.empresaId = empresaId;
    this.nomeEmpresa = nomeEmpresa;
  }
}
