import { AdicionarUsuarioResponseDTO } from '@api/model/usuario/response/adicionar-usuario.response';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';
import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
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

export function ListarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por listar os usuários',
    }),
    ApiOkResponse({
      type: [BuscarUsuarioResponseDTO],
    }),
  );
}

export function AdicionarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por criar o usuário pra uso da API',
    }),
    ApiCreatedResponse({
      type: AdicionarUsuarioResponseDTO,
    }),
  );
}

export function AlterarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por atualizar o usuário pra uso da API',
    }),
    ApiParam({
      name: 'usuarioId',
      type: Number,
      description: 'Identificador do usuario',
    }),
    ApiOkResponse({
      type: AdicionarUsuarioResponseDTO,
    }),
  );
}

export function DesativarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por desativar o acesso do usuário pra uso da API',
    }),
    ApiParam({
      name: 'usuarioId',
      type: Number,
      description: 'Identificador do usuario',
    }),
    ApiNoContentResponse(),
  );
}

export function AtivarUsuario() {
  return applyDecorators(
    ApiOperation({
      summary: 'Responsável por ativar o acesso do usuário pra uso da API',
    }),
    ApiParam({
      name: 'usuarioId',
      type: Number,
      description: 'Identificador do usuario',
    }),
    ApiNoContentResponse(),
  );
}
