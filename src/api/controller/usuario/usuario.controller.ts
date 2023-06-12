import { BuscarUsuarioUseCase } from '@domain/service/usuario/use-cases/buscar-usuario/buscar-usuario.usecase';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import { BuscarUsuario, UsuarioApi } from './openapi/usuario-swagger';

@UsuarioApi()
@Controller({ path: '/usuario' })
export class UsuarioController {
  constructor(
    private readonly autenticarUsuarioUseCase: BuscarUsuarioUseCase,
  ) {}

  @Version('1')
  @Get('/:usuarioId')
  @BuscarUsuario()
  async buscarUsuario(
    @Param('usuarioId') usuarioId: number,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.autenticarUsuarioUseCase.execute(usuarioId);
    return response.status(HttpStatus.OK).json(result);
  }
}
