import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734470576927 implements MigrationInterface {
  name = 'Migrations1734470576927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`semesters\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sessions\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sessions\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` DROP FOREIGN KEY \`FK_a84f54ed79e0a301622069efd92\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL`,
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
      `ALTER TABLE \`semesters\` DROP FOREIGN KEY \`FK_09ef0b82a4d33cc3bf3ca83aba7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` CHANGE \`sessionId\` \`sessionId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_06c28c4fb8386c143c5c5d1f3fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_991b0b42fb5ca44bf61d3772188\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_fd1cecfbb001ebcd3a2221dff8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`lecturerId\` \`lecturerId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`classId\` \`classId\` varchar(36) NULL`,
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
      `ALTER TABLE \`semesters\` ADD CONSTRAINT \`FK_09ef0b82a4d33cc3bf3ca83aba7\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE \`semesters\` DROP FOREIGN KEY \`FK_09ef0b82a4d33cc3bf3ca83aba7\``,
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
      `ALTER TABLE \`courses\` CHANGE \`classId\` \`classId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`lecturerId\` \`lecturerId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_fd1cecfbb001ebcd3a2221dff8c\` FOREIGN KEY (\`classId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_991b0b42fb5ca44bf61d3772188\` FOREIGN KEY (\`lecturerId\`) REFERENCES \`staffs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_06c28c4fb8386c143c5c5d1f3fc\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` CHANGE \`sessionId\` \`sessionId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` ADD CONSTRAINT \`FK_09ef0b82a4d33cc3bf3ca83aba7\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_492f4df328e3a1db2296576cf7f\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_44855579fce3690c57ae8b12999\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_4627550896111589a4da245dadf\` FOREIGN KEY (\`levelId\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` ADD CONSTRAINT \`FK_a84f54ed79e0a301622069efd92\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sessions\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sessions\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` DROP COLUMN \`created_at\``,
    );
  }
}
