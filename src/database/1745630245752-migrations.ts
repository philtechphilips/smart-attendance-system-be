import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1745630245752 implements MigrationInterface {
  name = 'Migrations1745630245752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`surname\` \`middlename\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`middlename\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`middlename\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`middlename\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`middlename\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`middlename\` \`surname\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
  }
}
