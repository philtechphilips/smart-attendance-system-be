import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745365298241 implements MigrationInterface {
    name = 'Migrations1745365298241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD \`image\` longblob NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP COLUMN \`image\``);
    }

}
