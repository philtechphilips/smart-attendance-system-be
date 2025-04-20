import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745072224385 implements MigrationInterface {
    name = 'Migrations1745072224385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`image\` longblob NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`students\` ADD \`image\` blob NOT NULL`);
    }

}
