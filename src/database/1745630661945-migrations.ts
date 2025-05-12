import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1745630661945 implements MigrationInterface {
  name = 'Migrations1745630661945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`imageId\` \`imageId\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`guardianEmail\` \`guardianEmail\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`guardianEmail\` \`guardianEmail\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`imageId\` \`imageId\` varchar(255) COLLATE "utf8mb4_general_ci" NOT NULL`,
    );
  }
}
