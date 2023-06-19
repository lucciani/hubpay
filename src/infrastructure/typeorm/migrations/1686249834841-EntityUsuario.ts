import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class EntityUsuario1686249834841 implements MigrationInterface {
  private tableName = 'usuario';
  private foreignKeyTableName = 'empresa';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            length: '11',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'secret_id',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'secret',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'empresa_id',
            type: 'integer',
            isNullable: true,
            unsigned: true,
          },
          {
            name: 'ativo',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP()',
          },
        ],
        uniques: [
          {
            name: 'UQ_usuario_secret_id',
            columnNames: ['secret_id'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: 'fk_usuario_empresa',
        columnNames: ['empresa_id'],
        referencedTableName: this.foreignKeyTableName,
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('empresa_id') !== -1,
    );
    await queryRunner.dropForeignKey(this.tableName, foreignKey);
    await queryRunner.dropTable(this.tableName, true);
  }
}
