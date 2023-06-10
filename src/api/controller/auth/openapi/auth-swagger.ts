import { CredentialsApiDTO } from '@api/model/auth/request/credentials-api.request';
import { TokenResponse } from '@api/model/auth/response/token.response';
import { HttpCode, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

export function AuthApi() {
  return applyDecorators(ApiTags('Auth'));
}

export function Authenticate() {
  return applyDecorators(
    HttpCode(201),
    ApiOperation({
      summary: 'Gerar o token JWT para autenticação.',
      description:
        'Usuário gerenciado pela para aquisição do secret do gatewa de pagamento.',
    }),
    ApiBody({
      type: CredentialsApiDTO,
    }),
    ApiCreatedResponse({
      type: TokenResponse,
    }),
  );
}
