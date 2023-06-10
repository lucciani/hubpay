import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BuscarUsuarioMapper } from '../mapper/buscar-usuario.mapper';
import * as bcrypt from 'bcrypt';
import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';

@Injectable()
export class AuthenticateUsuarioUseCase {
  private readonly logger = new Logger(AuthenticateUsuarioUseCase.name);
  private readonly buscarUsuarioMapper: BuscarUsuarioMapper;

  constructor(private readonly usuarioRepository: IUsuarioRepository) {
    this.buscarUsuarioMapper = new BuscarUsuarioMapper();
  }

  async execute(
    secretId: string,
    secret: string,
  ): Promise<AuthenticateResponseDTO> {
    const usuario = await this.usuarioRepository.aunthenticUsuario(secretId);

    if (!usuario) {
      throw new HttpException(
        'Secret id ou secret incorreto',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(secret, usuario.secret);

    if (!passwordMatch) {
      throw new HttpException(
        'Secret id ou secret incorreto',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return new AuthenticateResponseDTO(
      usuario.id,
      usuario.secretId,
      usuario.empresa.id,
    );
  }
}
