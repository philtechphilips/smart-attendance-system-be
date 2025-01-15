import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardData() {
    return this.dashboardService.dashboardData();
  }

  @Get('insights')
  async getAttendanceInsights() {
    return this.dashboardService.attendanceInsights();
  }

  @Get('performance')
  async getStudentDepartmentPerformance() {
    return this.dashboardService.studentDepartmentPerformance();
  }
}
