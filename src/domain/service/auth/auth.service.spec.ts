import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ExistUsuarioUseCase } from '@domain/service/usuario/use-cases/exist-usuario/exist-usuario.usecase';
import { AuthService } from './auth.service';
import { JwtPayload } from '@api/model/auth/request/jwt-payload';
import { TokenResponse } from '@api/model/auth/response/token.response';
import { addTime, convertToUTC } from '@core/utils/date-provider';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let existUsuarioUseCase: ExistUsuarioUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access-token'),
            signAsync: jest.fn().mockResolvedValue('refresh-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ExistUsuarioUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              id: 1,
              secretId: 'user1',
              empresaId: 1,
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    existUsuarioUseCase = module.get<ExistUsuarioUseCase>(ExistUsuarioUseCase);
  });

  describe('createToken', () => {
    it('should create token', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('3600');
      jest.spyOn(jwtService, 'sign').mockReturnValue('access-token');
      jest
        .spyOn(authService, 'createRefreshToken')
        .mockResolvedValue('refresh-token');

      const params = {
        id: 1,
        secretId: 'user1',
        empresaId: 1,
      };

      const result = await authService.createToken(params);

      const expiresToken = convertToUTC(addTime(3600, 's'));

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          client: params.secretId,
          subject: params.id,
          empresaId: params.empresaId,
        }),
      );
      expect(authService.createRefreshToken).toHaveBeenCalledWith(params);
      expect(result).toEqual(
        new TokenResponse(
          params.id,
          params.secretId,
          'access-token',
          expiresToken,
          true,
          'refresh-token',
        ),
      );
    });
  });

  describe('createRefreshToken', () => {
    it('should create refresh token', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('3600');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('refresh-token');

      const params = {
        id: 1,
        secretId: 'user1',
        empresaId: 1,
      };

      const result = await authService.createRefreshToken(params);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          client: params.secretId,
          subject: params.id,
          empresaId: params.empresaId,
        }),
        expect.objectContaining({
          expiresIn: '3600s',
          secret: expect.any(String),
        }),
      );
      expect(result).toBe('refresh-token');
    });
  });

  describe('validateUser', () => {
    it('should validate user', async () => {
      const payload: JwtPayload = {
        client: 'user1',
        subject: 1,
        empresaId: 1,
      };

      const expectedResult = {
        id: 1,
        secretId: 'user1',
        empresaId: 1,
      };

      jest
        .spyOn(existUsuarioUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await authService.validateUser(payload);

      expect(existUsuarioUseCase.execute).toHaveBeenCalledWith(payload.client);
      expect(result).toEqual(
        expect.objectContaining({
          id: expectedResult.id,
          secretId: expectedResult.secretId,
          empresaId: expectedResult.empresaId,
        }),
      );
    });
  });
});
