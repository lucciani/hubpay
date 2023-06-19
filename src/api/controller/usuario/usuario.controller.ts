import { BuscarUsuarioUseCase } from '@domain/service/usuario/use-cases/buscar-usuario/buscar-usuario.usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import {
  AdicionarUsuario,
  AlterarUsuario,
  AtivarUsuario,
  BuscarUsuario,
  DesativarUsuario,
  ListarUsuario,
  UsuarioApi,
} from './openapi/usuario-swagger';
import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { ListarUsuarioUseCase } from '@domain/service/usuario/use-cases/listar-usuarios/listar-usuario.usecase';
import { AdicionarUsuarioUseCase } from '@domain/service/usuario/use-cases/adicionar-usuario/adicionar-usuario.usecase';
import { AtualizarUsuarioRequestDTO } from '@api/model/usuario/request/atualizar-usuario.request';
import { AtualizarUsuarioUseCase } from '@domain/service/usuario/use-cases/atualizar-usuario/atualizar-usuario.usecase';
import { AtivarUsuarioUseCase } from '@domain/service/usuario/use-cases/ativar-usuario/ativar-usuario.usecase';
import { InativarUsuarioUseCase } from '@domain/service/usuario/use-cases/inativar-usuario/inativar-usuario.usecase';

@UsuarioApi()
@Controller({ path: '/usuarios' })
export class UsuarioController {
  constructor(
    private readonly buscarUsuarioUseCase: BuscarUsuarioUseCase,
    private readonly listarUsuarioUseCase: ListarUsuarioUseCase,
    private readonly adicionarUsuarioUseCase: AdicionarUsuarioUseCase,
    private readonly atualizarUsuarioUseCase: AtualizarUsuarioUseCase,
    private readonly ativarUsuarioUseCase: AtivarUsuarioUseCase,
    private readonly inativarUsuarioUseCase: InativarUsuarioUseCase,
  ) {}

  @Version('1')
  @Get('/:usuarioId')
  @BuscarUsuario()
  async buscarUsuario(
    @Param('usuarioId') usuarioId: number,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.buscarUsuarioUseCase.execute(usuarioId);
    return response.status(HttpStatus.OK).json(result);
  }

  @Version('1')
  @Get()
  @ListarUsuario()
  async listar(
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.listarUsuarioUseCase.execute();
    return response.status(HttpStatus.OK).json(result);
  }

  @Version('1')
  @Post()
  @AdicionarUsuario()
  async adicionar(
    @Body() usuario: AdicionarUsuarioRequestDTO,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.adicionarUsuarioUseCase.execute(usuario);
    return response.status(HttpStatus.CREATED).json(result);
  }

  @Version('1')
  @Put('/:usuarioId')
  @AlterarUsuario()
  async alterar(
    @Param('usuarioId') usuarioId: number,
    @Body() params: AtualizarUsuarioRequestDTO,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const result = await this.atualizarUsuarioUseCase.execute(
      usuarioId,
      params,
    );
    return response.status(HttpStatus.OK).json(result);
  }

  @Version('1')
  @Delete('ativo/:usuarioId')
  @DesativarUsuario()
  async desativar(
    @Param('usuarioId') usuarioId: number,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    await this.inativarUsuarioUseCase.execute(usuarioId);
    return response.status(HttpStatus.NO_CONTENT).json();
  }

  @Version('1')
  @Put('ativo/:usuarioId')
  @AtivarUsuario()
  async ativar(
    @Param('usuarioId') usuarioId: number,
    @Res() response: Response,
  ): Promise<Response<any, Record<string, any>>> {
    await this.ativarUsuarioUseCase.execute(usuarioId);
    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
