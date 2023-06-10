import { EXPIRES_TOKEN, SECRET } from '@core/config/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get(SECRET),
    signOptions: {
      expiresIn: parseInt(configService.get(EXPIRES_TOKEN)),
    },
  }),
  inject: [ConfigService],
};
