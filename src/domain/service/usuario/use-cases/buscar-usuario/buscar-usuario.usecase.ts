import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';

@Injectable()
export class BuscarUsuarioUseCase {
  private readonly logger = new Logger(BuscarUsuarioUseCase.name);

  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(usuarioId: number): Promise<BuscarUsuarioResponseDTO> {
    this.logger.debug(`Preparando o BuscarUsuarioUseCase...`);
    const usuario = await this.usuarioRepository.findById(usuarioId);

    if (!usuario) {
      throw new NotFoundException(
        `Usuário de id: ${usuarioId} não foi encontrado.`,
      );
    }

    const {
      id,
      secretId: secretIdAtual,
      empresa: { id: empresaId, nome },
    } = usuario;

    return new BuscarUsuarioResponseDTO(id, secretIdAtual, empresaId, nome);
  }
}
