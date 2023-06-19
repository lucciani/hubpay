import { ApiProperty } from '@nestjs/swagger';

export class AdicionarUsuarioRequestDTO {
  @ApiProperty({
    description: 'Seu código de identificação do usuário',
    example: 'teste_id',
    required: true,
  })
  secretId?: string;

  @ApiProperty({
    description: 'A chave pra autenticação do usuário',
    example: '321',
    required: true,
  })
  secret?: string;

  @ApiProperty({
    description: 'Id de uma empresa cadastrada',
    example: 1,
    required: true,
  })
  empresaId?: number;

  constructor(secretId: string, secret: string, empresaId: number) {
    this.secretId = secretId;
    this.secret = secret;
    this.empresaId = empresaId;
  }
}
