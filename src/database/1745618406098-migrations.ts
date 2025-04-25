import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745618406098 implements MigrationInterface {
    name = 'Migrations1745618406098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`staffs_courses_courses\` (\`staffsId\` varchar(36) NOT NULL, \`coursesId\` varchar(36) NOT NULL, INDEX \`IDX_015bfe062b5c057b6c0386a003\` (\`staffsId\`), INDEX \`IDX_9f4d82c6383de41cf6c56f861b\` (\`coursesId\`), PRIMARY KEY (\`staffsId\`, \`coursesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`staffs_courses_courses\` ADD CONSTRAINT \`FK_015bfe062b5c057b6c0386a003d\` FOREIGN KEY (\`staffsId\`) REFERENCES \`staffs\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`staffs_courses_courses\` ADD CONSTRAINT \`FK_9f4d82c6383de41cf6c56f861b1\` FOREIGN KEY (\`coursesId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staffs_courses_courses\` DROP FOREIGN KEY \`FK_9f4d82c6383de41cf6c56f861b1\``);
        await queryRunner.query(`ALTER TABLE \`staffs_courses_courses\` DROP FOREIGN KEY \`FK_015bfe062b5c057b6c0386a003d\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f4d82c6383de41cf6c56f861b\` ON \`staffs_courses_courses\``);
        await queryRunner.query(`DROP INDEX \`IDX_015bfe062b5c057b6c0386a003\` ON \`staffs_courses_courses\``);
        await queryRunner.query(`DROP TABLE \`staffs_courses_courses\``);
    }

}
