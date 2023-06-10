import { ApiProperty } from '@nestjs/swagger';

export class UsuarioRequestDTO {
  @ApiProperty({
    description: 'Seu código de identificação do usuário',
    example: '1',
    required: false,
  })
  usuarioId?: number;

  constructor(usuarioId?: number) {
    this.usuarioId = usuarioId;
  }
}
