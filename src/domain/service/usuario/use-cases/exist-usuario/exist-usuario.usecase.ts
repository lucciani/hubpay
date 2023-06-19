import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExistUsuarioUseCase {
  private readonly logger = new Logger(ExistUsuarioUseCase.name);

  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(secretId: string): Promise<AuthenticateResponseDTO> {
    this.logger.debug(`Preparando o ExistUsuarioUseCase...`);
    const usuarioAtual = await this.usuarioRepository.findBySecretId(secretId);

    if (!usuarioAtual) {
      throw new NotFoundException('Secret id ou secret incorreto');
    }

    const {
      id,
      secretId: secretIdAtual,
      empresa: { id: empresaId },
    } = usuarioAtual;

    return new AuthenticateResponseDTO(id, secretIdAtual, empresaId);
  }
}
