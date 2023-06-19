import { HttpException, HttpStatus } from '@nestjs/common';

export class EmpresaNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
