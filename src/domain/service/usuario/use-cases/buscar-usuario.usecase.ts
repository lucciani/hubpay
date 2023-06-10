import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BuscarUsuarioMapper } from '../mapper/buscar-usuario.mapper';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';

@Injectable()
export class BuscarUsuarioUseCase {
  private readonly logger = new Logger(BuscarUsuarioUseCase.name);
  private readonly buscarUsuarioMapper: BuscarUsuarioMapper;

  constructor(private readonly usuarioRepository: IUsuarioRepository) {
    this.buscarUsuarioMapper = new BuscarUsuarioMapper();
  }

  async execute(usuarioId: number): Promise<BuscarUsuarioResponseDTO> {
    const usuario = await this.usuarioRepository.buscarUsuario(usuarioId);

    if (!usuario) {
      throw new NotFoundException(
        `Usuário de id: ${usuarioId} não foi encontrado.`,
      );
    }

    const usuarioMapper = await this.buscarUsuarioMapper.mapFrom(usuario);

    return usuarioMapper;
  }
}
