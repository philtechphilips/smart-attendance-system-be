import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733611821711 implements MigrationInterface {
  name = 'Migrations1733611821711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`staffs\` (\`id\` varchar(36) NOT NULL, \`surname\` varchar(255) NOT NULL, \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`position\` varchar(255) NOT NULL, \`level\` varchar(255) NOT NULL, \`dob\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`departmentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`courses\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`lecturerId\` varchar(36) NULL, \`classId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`courses_categories_departments\` (\`coursesId\` varchar(36) NOT NULL, \`departmentsId\` varchar(36) NOT NULL, INDEX \`IDX_b6db7c6d54cd82cf13e89e6ec8\` (\`coursesId\`), INDEX \`IDX_b4b18c1faba54ce9c61c3050d7\` (\`departmentsId\`), PRIMARY KEY (\`coursesId\`, \`departmentsId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fullName\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isVerified\``);
    await queryRunner.query(
      `ALTER TABLE \`departments\` ADD \`schoolId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`surname\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`firstname\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`lastname\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_4627550896111589a4da245dadf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_44855579fce3690c57ae8b12999\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_492f4df328e3a1db2296576cf7f\``,
    );
    await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`dob\``);
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD \`dob\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`levelId\` \`levelId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` ADD CONSTRAINT \`FK_a84f54ed79e0a301622069efd92\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_4627550896111589a4da245dadf\` FOREIGN KEY (\`levelId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_44855579fce3690c57ae8b12999\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_492f4df328e3a1db2296576cf7f\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_06c28c4fb8386c143c5c5d1f3fc\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_991b0b42fb5ca44bf61d3772188\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`staffs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_fd1cecfbb001ebcd3a2221dff8c\` FOREIGN KEY (\`classId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses_categories_departments\` ADD CONSTRAINT \`FK_b6db7c6d54cd82cf13e89e6ec83\` FOREIGN KEY (\`coursesId\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses_categories_departments\` ADD CONSTRAINT \`FK_b4b18c1faba54ce9c61c3050d7b\` FOREIGN KEY (\`departmentsId\`) REFERENCES \`departments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses_categories_departments\` DROP FOREIGN KEY \`FK_b4b18c1faba54ce9c61c3050d7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses_categories_departments\` DROP FOREIGN KEY \`FK_b6db7c6d54cd82cf13e89e6ec83\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_fd1cecfbb001ebcd3a2221dff8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_991b0b42fb5ca44bf61d3772188\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_06c28c4fb8386c143c5c5d1f3fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_492f4df328e3a1db2296576cf7f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_44855579fce3690c57ae8b12999\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_4627550896111589a4da245dadf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` DROP FOREIGN KEY \`FK_a84f54ed79e0a301622069efd92\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`levelId\` \`levelId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`ALTER TABLE \`students\` DROP COLUMN \`dob\``);
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD \`dob\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_492f4df328e3a1db2296576cf7f\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_44855579fce3690c57ae8b12999\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_4627550896111589a4da245dadf\` FOREIGN KEY (\`levelId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastname\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstname\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`surname\``);
    await queryRunner.query(
      `ALTER TABLE \`departments\` DROP COLUMN \`schoolId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`isVerified\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`fullName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b4b18c1faba54ce9c61c3050d7\` ON \`courses_categories_departments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b6db7c6d54cd82cf13e89e6ec8\` ON \`courses_categories_departments\``,
    );
    await queryRunner.query(`DROP TABLE \`courses_categories_departments\``);
    await queryRunner.query(`DROP TABLE \`courses\``);
    await queryRunner.query(`DROP TABLE \`staffs\``);
  }
}
