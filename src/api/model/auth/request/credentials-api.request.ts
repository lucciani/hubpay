import { ApiProperty } from '@nestjs/swagger';

export class CredentialsApiDTO {
  @ApiProperty({
    description: 'Scret id do usuário',
    example: 'teste_id',
  })
  secretId: string;

  @ApiProperty({
    description: 'Secret do usuário',
    example: '321',
  })
  secret?: string;

  constructor(secretId?: string, secret?: string) {
    this.secretId = secretId;
    this.secret = secret;
  }
}
