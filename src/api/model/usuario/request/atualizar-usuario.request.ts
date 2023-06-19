import { ApiProperty } from '@nestjs/swagger';

export class AtualizarUsuarioRequestDTO {
  id?: number;

  @ApiProperty({
    description: 'Seu código de identificação do usuário',
    example: 'teste_id',
    required: false,
  })
  secretId?: string;

  @ApiProperty({
    description: 'A chave pra autenticação do usuário',
    example: '321',
    required: false,
  })
  secret?: string;

  @ApiProperty({
    description: 'Id de uma empresa cadastrada',
    example: 1,
    required: false,
  })
  empresaId?: number;

  constructor(secretId: string, secret: string, empresaId: number) {
    this.secretId = secretId;
    this.secret = secret;
    this.empresaId = empresaId;
  }
}
