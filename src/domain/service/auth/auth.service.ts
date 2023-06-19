import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { addTime, convertToUTC } from '@core/utils/date-provider';
import { ExistUsuarioUseCase } from '@domain/service/usuario/use-cases/exist-usuario/exist-usuario.usecase';
import {
  EXPIRES_REFRESH_TOKEN,
  EXPIRES_TOKEN,
  SECRET_REFRESH_TOKEN,
} from '@core/config/constants';
import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';
import { TokenResponse } from '@api/model/auth/response/token.response';
import { JwtPayload } from '@api/model/auth/request/jwt-payload';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly existUsuarioUseCase: ExistUsuarioUseCase,
  ) {}

  async createToken(params: AuthenticateResponseDTO): Promise<TokenResponse> {
    this.logger.debug(`Gerando token.`);
    const { secretId: client, id: subject, empresaId } = params;

    const expiresToken = convertToUTC(
      addTime(Number(this.configService.get(EXPIRES_TOKEN)), 's'),
    );

    const user: JwtPayload = { client, subject, empresaId };
    const accessToken = this.jwtService.sign(user);

    const refreshToken = await this.createRefreshToken(params);

    return new TokenResponse(
      subject,
      client,
      accessToken,
      expiresToken,
      true,
      refreshToken,
    );
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticateResponseDTO> {
    this.logger.debug(`Validando token.`);
    const { empresaId, id, secretId } = await this.existUsuarioUseCase.execute(
      payload.client,
    );
    return new AuthenticateResponseDTO(id, secretId, empresaId);
  }

  async createRefreshToken(params: AuthenticateResponseDTO): Promise<any> {
    this.logger.debug(`Gerando refresh token.`);
    const { secretId: client, id: subject, empresaId } = params;

    const user: JwtPayload = { client, subject, empresaId };
    const refreshToken = await this.jwtService.signAsync(user, {
      secret: this.configService.get(SECRET_REFRESH_TOKEN),
      expiresIn: `${this.configService.get(EXPIRES_REFRESH_TOKEN)}s`,
    });

    return refreshToken;
  }
}
