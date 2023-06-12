import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';
import { ConfigService } from '@nestjs/config';
import { SALT_KEY } from '@core/config/constants';

@Injectable()
export class AuthenticateUsuarioUseCase {
  private readonly logger = new Logger(AuthenticateUsuarioUseCase.name);

  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    secretId: string,
    secret: string,
  ): Promise<AuthenticateResponseDTO> {
    this.logger.log(`Preparando o AuthenticateUsuarioUseCase...`);
    const usuario = await this.usuarioRepository.aunthenticUsuario(secretId);

    if (!usuario) {
      throw new HttpException(
        'Secret id ou secret incorreto',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const password = `${secret}${this.configService.get(SALT_KEY)}`;

    const passwordMatch = await bcrypt.compare(password, usuario.secret);

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
