import { Controller, Get, Logger, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  getDocs(@Res() res?: any) {
    Logger.debug(`Iniciando swagger`);
    return res
      .status(302)
      .redirect(
        `http://${process.env.HOST}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/docs`,
      );
  }
}
