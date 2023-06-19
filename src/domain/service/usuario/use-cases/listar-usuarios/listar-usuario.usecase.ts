import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger } from '@nestjs/common';
import { BuscarUsuarioResponseDTO } from '@api/model/usuario/response/buscar-usuario.response';

@Injectable()
export class ListarUsuarioUseCase {
  private readonly logger = new Logger(ListarUsuarioUseCase.name);

  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<BuscarUsuarioResponseDTO[]> {
    this.logger.debug(`Preparando o ListarUsuarioUseCase...`);
    const usuarios = await this.usuarioRepository.find();

    if (usuarios.length === 0) {
      return [];
    }

    return usuarios.map((usuario) => {
      const {
        id,
        secretId: secretIdAtual,
        empresa: { id: empresaId, nome },
      } = usuario;

      return new BuscarUsuarioResponseDTO(id, secretIdAtual, empresaId, nome);
    });
  }
}
