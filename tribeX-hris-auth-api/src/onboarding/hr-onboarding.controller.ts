import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const HR_ONLY = ['HR Officer', 'HR Recruiter', 'Admin', 'System Admin'];

@ApiTags('HR Onboarding Management')
@ApiBearerAuth()
@Controller('onboarding/hr')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HrOnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('applicants')
  @Roles(...HR_ONLY)
  @ApiOperation({ summary: 'Get the dashboard list of all applicants currently onboarding' })
  getOnboardingApplicants() {
    return this.onboardingService.getAllOnboardingEmployees();
  }

  @Patch('tasks/:taskId')
  @Roles(...HR_ONLY)
  @ApiOperation({ summary: 'Approve or Reject a submitted document' })
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.onboardingService.updateTaskStatus(taskId, dto);
  }
}
