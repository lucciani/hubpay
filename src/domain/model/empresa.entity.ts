import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity({
  name: 'empresa',
})
export class EmpresaEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column({
    length: 100,
  })
  nome: string;

  @Column({
    name: 'secret_key',
    length: 100,
    unique: true,
  })
  secretKey: string;

  @Column()
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @OneToMany(() => UsuarioEntity, (usuario) => usuario.empresa)
  usuarios: UsuarioEntity[];
}
