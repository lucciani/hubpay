import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { AuthenticateResponseDTO } from '@api/model/auth/response/authenticate.response';
import { AuthenticateUsuarioUseCase } from './authenticate.usecase';

describe('AuthenticateUsuarioUseCase', () => {
  let authenticateUsuarioUseCase: AuthenticateUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUsuarioUseCase,
        {
          provide: IUsuarioRepository,
          useValue: {
            aunthenticUsuario: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authenticateUsuarioUseCase = module.get<AuthenticateUsuarioUseCase>(
      AuthenticateUsuarioUseCase,
    );
    usuarioRepository = module.get<IUsuarioRepository>(IUsuarioRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('execute', () => {
    it('should authenticate usuario and return response', async () => {
      const mockSecretId = 'secret-id';
      const mockSecret = 'secret';
      const mockUsuario = {
        id: 1,
        secretId: mockSecretId,
        secret: 'hashed-password',
        ativo: true,
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [],
        },
      };
      const mockSaltRounds = 10;

      jest
        .spyOn(usuarioRepository, 'aunthenticUsuario')
        .mockResolvedValue(mockUsuario);
      jest.spyOn(configService, 'get').mockReturnValue(mockSaltRounds);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await authenticateUsuarioUseCase.execute(
        mockSecretId,
        mockSecret,
      );

      expect(usuarioRepository.aunthenticUsuario).toHaveBeenCalledWith(
        mockSecretId,
      );
      expect(configService.get).toHaveBeenCalledWith('SALT_KEY');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        `${mockSecret}${mockSaltRounds}`,
        mockUsuario.secret,
      );
      expect(result).toEqual(
        new AuthenticateResponseDTO(
          mockUsuario.id,
          mockUsuario.secretId,
          mockUsuario.empresa.id,
        ),
      );
    });

    it('should throw unauthorized exception if usuario is not found', async () => {
      const mockSecretId = 'secret-id';
      const mockSecret = 'secret';

      jest
        .spyOn(usuarioRepository, 'aunthenticUsuario')
        .mockResolvedValue(null);

      await expect(
        authenticateUsuarioUseCase.execute(mockSecretId, mockSecret),
      ).rejects.toThrowError(
        new HttpException(
          'Secret id ou secret incorreto',
          HttpStatus.UNAUTHORIZED,
        ),
      );

      expect(usuarioRepository.aunthenticUsuario).toHaveBeenCalledWith(
        mockSecretId,
      );
    });

    it('should throw unauthorized exception if password does not match', async () => {
      const mockSecretId = 'secret-id';
      const mockSecret = 'secret';
      const mockUsuario = {
        id: 1,
        secretId: mockSecretId,
        secret: 'hashed-password',
        ativo: true,
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [],
        },
      };
      const mockSaltRounds = 10;

      jest
        .spyOn(usuarioRepository, 'aunthenticUsuario')
        .mockResolvedValue(mockUsuario);
      jest.spyOn(configService, 'get').mockReturnValue(mockSaltRounds);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        authenticateUsuarioUseCase.execute(mockSecretId, mockSecret),
      ).rejects.toThrowError(
        new HttpException(
          'Secret id ou secret incorreto',
          HttpStatus.UNAUTHORIZED,
        ),
      );

      expect(usuarioRepository.aunthenticUsuario).toHaveBeenCalledWith(
        mockSecretId,
      );
      expect(configService.get).toHaveBeenCalledWith('SALT_KEY');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        `${mockSecret}${mockSaltRounds}`,
        mockUsuario.secret,
      );
    });
  });
});
