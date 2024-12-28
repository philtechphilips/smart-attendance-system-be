export class CreateAttendanceDto {
  studentId: string;
  courseId: string;
  status?: 'present' | 'absent' | 'late';
}
