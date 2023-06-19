import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class TokenResponse {
  @ApiProperty({ type: 'number' })
  subject: number;

  @ApiProperty({ type: 'string' })
  client: string;

  @ApiProperty({ type: 'string' })
  accessToken: string;

  @ApiProperty({ type: 'string' })
  expiresIn: string;

  @ApiProperty({ type: 'boolean' })
  isValid: boolean;

  @ApiProperty({ type: 'string' })
  refreshToken: string;

  constructor(
    subject: number,
    client: string,
    accessToken: string,
    expiresIn: string,
    isValid: boolean,
    refreshToken: string,
  ) {
    this.subject = subject;
    this.client = client;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.isValid = isValid;
    this.refreshToken = refreshToken;
  }
}
