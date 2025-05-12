import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1745630494072 implements MigrationInterface {
  name = 'Migrations1745630494072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`middlename\` \`middlename\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`middlename\` \`middlename\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
  }
}
