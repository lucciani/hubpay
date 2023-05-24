import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  API_VERSION,
  APP_DESCRIPTION,
  APP_NAME,
  GLOBAL_PREFIX,
} from '@core/config/constants';

export const initSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const appName = configService.get(APP_NAME);
  const appDescription = configService.get(APP_DESCRIPTION);
  const apiVersion = configService.get(API_VERSION);
  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup(
    `/${configService.get(GLOBAL_PREFIX)}/docs`,
    app,
    document,
  );

  Logger.log(
    `Mapped {/${configService.get(
      'GLOBAL_PREFIX',
    )}/docs, GET} Swagger api route`,
    'RouterExplorer',
  );
};
