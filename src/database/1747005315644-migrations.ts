import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1747005315644 implements MigrationInterface {
  name = 'Migrations1747005315644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`streams\` (\`id\` varchar(36) NOT NULL, \`timestamp\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roomId\` varchar(255) NULL, \`course_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`streams\` ADD CONSTRAINT \`FK_61490c35e0236f4c4e496c1d296\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`streams\` DROP FOREIGN KEY \`FK_61490c35e0236f4c4e496c1d296\``,
    );
    await queryRunner.query(`DROP TABLE \`streams\``);
  }
}
