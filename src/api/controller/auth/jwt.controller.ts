import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateUsuarioUseCase } from '@domain/service/usuario/use-cases/authenticate.usecase';
import { TokenResponse } from '@api/model/auth/response/token.response';
import { CredentialsApiDTO } from '@api/model/auth/request/credentials-api.request';
import { AuthApi, Authenticate } from './openapi/auth-swagger';
import { AuthService } from '@domain/service/auth/auth.service';

@AuthApi()
@Controller('auth')
export class JwtController {
  constructor(
    private readonly authenticateService: AuthService,
    private readonly authenticateUsuarioUseCase: AuthenticateUsuarioUseCase,
  ) {}

  @Post()
  @Authenticate()
  async authenticate(
    @Body() credentials: CredentialsApiDTO,
  ): Promise<TokenResponse> {
    const { secretId, secret } = credentials;

    const usuarioVerificado = await this.authenticateUsuarioUseCase.execute(
      secretId,
      secret,
    );

    const token = await this.authenticateService.createToken(usuarioVerificado);

    return token;
  }
}
