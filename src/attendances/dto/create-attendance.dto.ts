import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'The ID of the student',
    example: '12345',
  })
  studentId: string;

  @ApiProperty({
    description: 'The ID of the course',
    example: 'CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'The attendance status of the student',
    example: 'present',
    enum: ['present', 'absent', 'late'],
    required: false,
  })
  status?: 'present' | 'absent' | 'late';
}
