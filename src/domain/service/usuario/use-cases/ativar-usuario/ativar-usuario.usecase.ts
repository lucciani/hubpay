import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';

@Injectable()
export class AtivarUsuarioUseCase {
  private readonly logger = new Logger(AtivarUsuarioUseCase.name);

  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(usuarioId: number): Promise<void> {
    this.logger.debug(`Preparando o AtivarUsuarioUseCase...`);

    const usuarioAtual = await this.usuarioRepository.findById(
      usuarioId,
      false,
    );

    if (!usuarioAtual) {
      this.logger.error(
        `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
      );
      throw new UsuarioNotFoundException(
        `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
      );
    }

    usuarioAtual.ativo = true;
    usuarioAtual.updatedAt = new Date();

    await this.usuarioRepository.update(usuarioId, usuarioAtual);
  }
}
