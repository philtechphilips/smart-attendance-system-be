import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734614271389 implements MigrationInterface {
  name = 'Migrations1734614271389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_7953eac210a0e34a3e82a3c533\` ON \`staffs\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD \`guardianEmail\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` DROP FOREIGN KEY \`FK_a84f54ed79e0a301622069efd92\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_ebc3adae3c7b211f927b6403bc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_c14488f46704b1c5aacfb12d232\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_2a7ac955ea573f8be71d736cef8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_aa8edc7905ad764f85924569647\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_fb3eff90b11bddf7285f9b4e281\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`matricNo\` \`matricNo\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`level_id\` \`level_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`department_id\` \`department_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`program_id\` \`program_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`school_id\` \`school_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_7953eac210a0e34a3e82a3c5332\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_06c28c4fb8386c143c5c5d1f3fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` DROP FOREIGN KEY \`FK_09ef0b82a4d33cc3bf3ca83aba7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` CHANGE \`sessionId\` \`sessionId\` varchar(36) NULL`,
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
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_ebc3adae3c7b211f927b6403bc5\` FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_c14488f46704b1c5aacfb12d232\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_2a7ac955ea573f8be71d736cef8\` FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_aa8edc7905ad764f85924569647\` FOREIGN KEY (\`school_id\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_fb3eff90b11bddf7285f9b4e281\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_7953eac210a0e34a3e82a3c5332\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_06c28c4fb8386c143c5c5d1f3fc\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` ADD CONSTRAINT \`FK_09ef0b82a4d33cc3bf3ca83aba7\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`semesters\` DROP FOREIGN KEY \`FK_09ef0b82a4d33cc3bf3ca83aba7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_06c28c4fb8386c143c5c5d1f3fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` DROP FOREIGN KEY \`FK_7953eac210a0e34a3e82a3c5332\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_fb3eff90b11bddf7285f9b4e281\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_aa8edc7905ad764f85924569647\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_2a7ac955ea573f8be71d736cef8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_c14488f46704b1c5aacfb12d232\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_ebc3adae3c7b211f927b6403bc5\``,
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
      `ALTER TABLE \`semesters\` CHANGE \`sessionId\` \`sessionId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`semesters\` ADD CONSTRAINT \`FK_09ef0b82a4d33cc3bf3ca83aba7\` FOREIGN KEY (\`sessionId\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`departmentId\` \`departmentId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_06c28c4fb8386c143c5c5d1f3fc\` FOREIGN KEY (\`departmentId\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`staffs\` ADD CONSTRAINT \`FK_7953eac210a0e34a3e82a3c5332\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`user_id\` \`user_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`school_id\` \`school_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`program_id\` \`program_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`department_id\` \`department_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`level_id\` \`level_id\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` CHANGE \`matricNo\` \`matricNo\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_fb3eff90b11bddf7285f9b4e281\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_aa8edc7905ad764f85924569647\` FOREIGN KEY (\`school_id\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_2a7ac955ea573f8be71d736cef8\` FOREIGN KEY (\`program_id\`) REFERENCES \`programs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_c14488f46704b1c5aacfb12d232\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` ADD CONSTRAINT \`FK_ebc3adae3c7b211f927b6403bc5\` FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` CHANGE \`schoolId\` \`schoolId\` varchar(36) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`departments\` ADD CONSTRAINT \`FK_a84f54ed79e0a301622069efd92\` FOREIGN KEY (\`schoolId\`) REFERENCES \`schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`students\` DROP COLUMN \`guardianEmail\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_7953eac210a0e34a3e82a3c533\` ON \`staffs\` (\`user_id\`)`,
    );
  }
}
