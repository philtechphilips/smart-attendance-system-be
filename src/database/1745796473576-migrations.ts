import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1745796473576 implements MigrationInterface {
  name = 'Migrations1745796473576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`courses\` ADD \`unit\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`courses\` DROP COLUMN \`unit\``);
  }
}
