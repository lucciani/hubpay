import { Test } from '@nestjs/testing';
import { IUsuarioRepository } from '@domain/repository/usuario.repository';
import { AdicionarUsuarioRequestDTO } from '@api/model/usuario/request/adicionar-usuario.request';
import { UsuarioEntity } from '@domain/model/usuario.entity';
import { UsuarioNotFoundException } from '@api/err/usuario-notfound.exception';
import { AdicionarUsuarioResponseDTO } from '@api/model/usuario/response/adicionar-usuario.response';
import { IEmpresaRepository } from '@domain/repository/empresa.repository';
import { EmpresaNotFoundException } from '@api/err/empresa-notfound.exception';
import { EmpresaEntity } from '@domain/model/empresa.entity';
import { AtualizarUsuarioUseCase } from './atualizar-usuario.usecase';
import { AtualizarUsuarioMapper } from '@infrastructure/repository/usuario/mapper/atualizar-usuario.mapper copy';

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

describe('AtualizarUsuarioUseCase', () => {
  let atualizarUsuarioUseCase: AtualizarUsuarioUseCase;
  let usuarioRepository: IUsuarioRepository;
  let empresaRepository: IEmpresaRepository;
  let atualizarUsuarioMapper: AtualizarUsuarioMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AtualizarUsuarioUseCase,
        AtualizarUsuarioMapper,
        {
          provide: IUsuarioRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
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

    atualizarUsuarioUseCase = moduleRef.get<AtualizarUsuarioUseCase>(
      AtualizarUsuarioUseCase,
    );
    usuarioRepository = moduleRef.get<IUsuarioRepository>(IUsuarioRepository);
    empresaRepository = moduleRef.get<IEmpresaRepository>(IEmpresaRepository);
    atualizarUsuarioMapper = moduleRef.get<AtualizarUsuarioMapper>(
      AtualizarUsuarioMapper,
    );
  });

  it('should be defined', () => {
    expect(atualizarUsuarioUseCase).toBeDefined();
    expect(usuarioRepository).toBeDefined();
    expect(atualizarUsuarioMapper).toBeDefined();
    expect(empresaRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw User NotFoundException if user is inactive or does not exist', async () => {
      // Arrange
      const user = null;
      const usuarioId = 1;

      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(user);

      // Act & Assert
      await expect(
        atualizarUsuarioUseCase.execute(usuarioId, usuarioDTO),
      ).rejects.toThrow(
        new UsuarioNotFoundException(
          `Usuário com id: ${usuarioId} não está ativo ou não existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(user).toEqual(null);
    });

    it('should throw EmpresaNotFoundException if empresa is inactive', async () => {
      // Arrange
      empresa.ativo = false;
      const empresaId = 1;

      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(usuarioAtual);
      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(
        atualizarUsuarioUseCase.execute(empresaId, usuarioDTO),
      ).rejects.toThrow(
        new EmpresaNotFoundException(
          `Empresa com id: ${usuarioDTO.empresaId} não está ativa ou não existe, favor entrar em contato com administrador do sistema.`,
        ),
      );
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(empresaRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should create new usuario and return AdicionarUsuarioResponseDTO', async () => {
      // Arrange
      usuarioDTO.secretId = '321';
      empresa.ativo = true;
      const usuarioId = 2;

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
      jest.spyOn(usuarioRepository, 'findById').mockResolvedValue(novoUsuario);
      jest.spyOn(empresaRepository, 'findById').mockResolvedValue(empresa);
      jest
        .spyOn(atualizarUsuarioMapper, 'mapFrom')
        .mockResolvedValue(novoUsuario);
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(novoUsuario);

      const result = await atualizarUsuarioUseCase.execute(
        novoUsuario.id,
        usuarioDTO,
      );
      const mapper = await atualizarUsuarioMapper.mapFrom(usuarioDTO);
      const update = await usuarioRepository.update(usuarioId, mapper);

      // Assert
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(empresaRepository.findById).toHaveBeenCalledWith(
        usuarioDTO.empresaId,
      );
      expect(mapper).toEqual(novoUsuario);
      expect(update).toEqual(novoUsuario);
      expect(result).toBeInstanceOf(AdicionarUsuarioResponseDTO);
      // Add additional assertions for the response DTO properties if needed
    });
  });
});
