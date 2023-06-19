import { ApiProperty } from '@nestjs/swagger';

export class BuscarEmpresaResponseDTO {
  @ApiProperty({
    example: '1',
    type: Number,
  })
  id?: number;

  @ApiProperty({
    example: 'Empresa Teste',
    type: String,
  })
  nome?: string;

  @ApiProperty({
    example: '123',
    type: Number,
  })
  secretKey?: string;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  ativo?: boolean;

  constructor(id?: number, nome?: string, secretKey?: string, ativo?: boolean) {
    this.id = id;
    this.nome = nome;
    this.secretKey = secretKey;
    this.ativo = ativo;
  }
}
