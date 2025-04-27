import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745773689537 implements MigrationInterface {
    name = 'Migrations1745773689537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activities\` DROP COLUMN \`timestamp\``);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD CONSTRAINT \`FK_5a2cfe6f705df945b20c1b22c71\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activities\` DROP FOREIGN KEY \`FK_5a2cfe6f705df945b20c1b22c71\``);
        await queryRunner.query(`ALTER TABLE \`activities\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`activities\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`activities\` ADD \`timestamp\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
