import { Controller, Get, Query, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('/v1/dashboard')
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

  @Get('staff-dashboard')
  async getLecturerDashboardData(@Req() req, @Query('period') period: string) {
    const user = req.user;
    return this.dashboardService.staffDashboard(user.id, period);
  }

  @Get('admin-dashboard')
  async getAdminDashboardData(@Req() req, @Query('period') period: string) {
    const user = req.user;
    return this.dashboardService.adminDashboard(user.id, period);
  }


  @Get('student-dashboard')
  async studentDashboard(@Req() req) {
    const user = req.user;
    return this.dashboardService.studentDashboard(user.id);
  }
}
