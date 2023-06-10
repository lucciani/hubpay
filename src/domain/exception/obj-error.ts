export class ObjError {
  status?: number;
  message?: string;
  timestamp?: string;
  cause?: any;
  path?: string;

  constructor(status?: number, message?: string, cause?: any, path?: string) {
    this.status = status;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.cause = cause;
    this.path = path;
  }
}
