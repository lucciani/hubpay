import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmpresaEntity } from './empresa.entity';

@Entity({
  name: 'usuario',
})
export class UsuarioEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column({
    name: 'secret_id',
    length: 100,
  })
  secretId: string;

  @Column({
    name: 'secret',
    length: 100,
  })
  secret: string;

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: EmpresaEntity;

  @Column()
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
