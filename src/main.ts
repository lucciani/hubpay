import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as chalk from 'chalk';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as basicAuth from 'express-basic-auth';
import 'reflect-metadata';
import { TrimPipe } from './core/config/rest/trim.pipe';
import { AllExceptionsFilter } from '@api/err/http-exception.filter';
import { ValidationPipe } from '@core/validation/validation.pipe';
import { GLOBAL_PREFIX, SERVER_PORT } from '@core/config/constants';
import { initSwagger } from '@core/config/swagger.config';

declare const module: any;

async function bootstrap() {
  const appOptions = {
    cors: {
      origin: ['*'],
      methods: ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS'],
    },
  };

  try {
    const app = await NestFactory.create(AppModule, appOptions);
    const configService = app.get(ConfigService);
    app.useGlobalFilters(new AllExceptionsFilter());

    Logger.log(
      `Environment: ${chalk
        .hex('#87e8de')
        .bold(process.env.NODE_ENV?.toUpperCase())}`,
      'Bootstrap',
    );

    app.use(compression());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
    );

    app.setGlobalPrefix(configService.get(GLOBAL_PREFIX));
    app.use(
      [`/${configService.get(GLOBAL_PREFIX)}/docs`],
      basicAuth({
        challenge: true,
        users: {
          Admin: process.env.SWAGGER_PASS,
        },
      }),
    );

    app.enableVersioning({ type: VersioningType.URI });

    // REST Global configurations
    app.useGlobalPipes(new TrimPipe());
    app.useGlobalPipes(new ValidationPipe());
    initSwagger(app);

    const PORT = parseInt(configService.get<string>(SERVER_PORT), 10) || 3000;
    await app.listen(PORT);

    Logger.log(
      process.env.NODE_ENV !== 'production'
        ? `🚀  Server ready at ${await app.getUrl()}`
        : `🚀  Server is listening on port ${chalk.hex('#87e8de').bold(PORT)}`,
      'Bootstrap',
      false,
    );

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap', false);
  throw e;
});
