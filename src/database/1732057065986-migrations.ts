import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1732057065986 implements MigrationInterface {
    name = 'Migrations1732057065986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`departments\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`levels\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schools\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` varchar(36) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`firstname\` varchar(255) NOT NULL, \`middlename\` varchar(255) NOT NULL, \`matricNo\` varchar(255) NOT NULL, \`dob\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, \`lga\` varchar(255) NOT NULL, \`class\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`guardian\` varchar(255) NOT NULL, \`guardianAddress\` varchar(255) NOT NULL, \`guardianPhone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`levelId\` varchar(36) NULL, \`schoolId\` varchar(36) NULL, \`departmentId\` varchar(36) NULL, UNIQUE INDEX \`REL_4627550896111589a4da245dad\` (\`levelId\`), UNIQUE INDEX \`REL_44855579fce3690c57ae8b1299\` (\`schoolId\`), UNIQUE INDEX \`REL_492f4df328e3a1db2296576cf7\` (\`departmentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_4627550896111589a4da245dadf\` FOREIGN KEY (\`levelId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_44855579fce3690c57ae8b12999\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_492f4df328e3a1db2296576cf7f\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_492f4df328e3a1db2296576cf7f\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_44855579fce3690c57ae8b12999\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_4627550896111589a4da245dadf\``);
        await queryRunner.query(`DROP INDEX \`REL_492f4df328e3a1db2296576cf7\` ON \`students\``);
        await queryRunner.query(`DROP INDEX \`REL_44855579fce3690c57ae8b1299\` ON \`students\``);
        await queryRunner.query(`DROP INDEX \`REL_4627550896111589a4da245dad\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
        await queryRunner.query(`DROP TABLE \`schools\``);
        await queryRunner.query(`DROP TABLE \`levels\``);
        await queryRunner.query(`DROP TABLE \`departments\``);
    }

}
