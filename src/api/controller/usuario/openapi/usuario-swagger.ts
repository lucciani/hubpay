import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';
import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export function UsuarioApi() {
  return applyDecorators(ApiTags('Usuario'));
}

export function BuscarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por buscar usuário',
    }),
    ApiParam({
      name: 'usuarioId',
      type: Number,
      description: 'Identificador do usuario',
    }),
    ApiOkResponse({
      type: BuscarUsuarioResponseDTO,
    }),
  );
}
