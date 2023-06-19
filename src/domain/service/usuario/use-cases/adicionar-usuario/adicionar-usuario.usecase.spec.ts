import { Test } from '@nestjs/testing';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { AdicionarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/adicionar-usuario.mapper';
import { AdicionarUsuarioUseCase } from './adicionar-usuario.usecase';
import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';
import { AdicionarUsuarioResponseDTO } from '@api/model/usuario/response/adicionar-usuario.response';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaNotFoundException } from '@api/err/empresa-notfound.exception';
import { EmpresaEntity } from '@domain/model/empresa.entity';

const usuarioAtual: UsuarioEntity = {
  id: 1,
  secretId: '123',
  secret: '$2b$10$3WR5fzGm7D4F/uXNjX6kwOe5W.djFtR5kdusbT2mwgrOnajLJnfaK',
  ativo: true,
  empresa: {
    id: 1,
    nome: 'Empresa Teste',
    secretKey: 'secret123',
    ativo: true,
    usuarios: [],
  },
};

const empresa: EmpresaEntity = {
  id: 1,
  nome: 'Empresa Teste',
  secretKey: '123',
  ativo: true,
  usuarios: [],
};

const usuarioDTO: AdicionarUsuarioRequestDTO = {
  secretId: '123',
  empresaId: 1,
  secret: '123',
};

describe('AdicionarUsuarioUseCase', () => {
  let adicionarUsuarioUseCase: AdicionarUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;
  let empresaRepository: IEmpresaRepository;
  let adicionarUsuarioMapper: AdicionarUsuarioMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdicionarUsuarioUseCase,
        AdicionarUsuarioMapper,
        {
          provide: IUsuarioRepository,
          useValue: {
            findBySecretId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: IEmpresaRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    adicionarUsuarioUseCase = moduleRef.get<AdicionarUsuarioUseCase>(
      AdicionarUsuarioUseCase,
    );
    usuarioRepository = moduleRef.get<IUsuarioRepository>(IUsuarioRepository);
    empresaRepository = moduleRef.get<IEmpresaRepository>(IEmpresaRepository);
    adicionarUsuarioMapper = moduleRef.get<AdicionarUsuarioMapper>(
      AdicionarUsuarioMapper,
    );
  });

  it('should be defined', () => {
    expect(adicionarUsuarioUseCase).toBeDefined();
    expect(usuarioRepository).toBeDefined();
    expect(adicionarUsuarioMapper).toBeDefined();
    expect(empresaRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw User NotFoundException if user is inactive or does not exist', async () => {
      // Arrange
      usuarioAtual.ativo = false;

      jest
        .spyOn(usuarioRepository, 'findBySecretId')
        .mockResolvedValueOnce(usuarioAtual);

      // Act & Assert
      await expect(adicionarUsuarioUseCase.execute(usuarioDTO)).rejects.toThrow(
        new UsuarioNotFoundException(
          `Usuário com secretId: ${usuarioDTO.secretId} não está ativo ou já existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(usuarioRepository.findBySecretId).toHaveBeenCalledTimes(1);
      expect(usuarioAtual.ativo).toEqual(false);
    });

    it('should throw EmpresaNotFoundException if empresa is inactive', async () => {
      // Arrange
      empresa.ativo = false;

      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(adicionarUsuarioUseCase.execute(usuarioDTO)).rejects.toThrow(
        new EmpresaNotFoundException(
          `Empresa com id: ${usuarioDTO.empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(empresaRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should create new usuario and return AdicionarUsuarioResponseDTO', async () => {
      // Arrange
      usuarioDTO.secretId = '321';
      empresa.ativo = true;

      const novoUsuario: UsuarioEntity = {
        id: 2,
        secretId: usuarioDTO.secretId,
        secret: usuarioAtual.secret,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        empresa: {
          id: 1,
          nome: 'Empresa Teste',
          secretKey: 'secret123',
          ativo: true,
          usuarios: [],
        },
      };

      // Act
      jest.spyOn(usuarioRepository, 'findBySecretId').mockResolvedValue(null);
      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(empresa);
      jest
        .spyOn(adicionarUsuarioMapper, 'mapFrom')
        .mockResolvedValue(novoUsuario);
      jest.spyOn(usuarioRepository, 'create').mockResolvedValue(novoUsuario);

      const mapper = await adicionarUsuarioMapper.mapFrom(usuarioDTO);
      const create = await usuarioRepository.create(mapper);
      const result = await adicionarUsuarioUseCase.execute(usuarioDTO);

      // Assert
      expect(usuarioRepository.findBySecretId).toHaveBeenCalledWith(
        usuarioDTO.secretId,
      );
      expect(empresaRepository.findById).toHaveBeenCalledWith(
        usuarioDTO.empresaId,
      );
      expect(mapper).toEqual(novoUsuario);
      expect(create).toEqual(novoUsuario);
      expect(result).toBeInstanceOf(AdicionarUsuarioResponseDTO);
      // Add additional assertions for the response DTO properties if needed
    });
  });
});
