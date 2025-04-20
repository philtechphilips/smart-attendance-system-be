import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745070614481 implements MigrationInterface {
    name = 'Migrations1745070614481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`image\` blob NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`image\``);
    }

}
