import {
  Controller, Get, Post, Body, Param,
  UseGuards, UseInterceptors, UploadedFile, Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Employees who can access their own onboarding tasks
const ONBOARDING_USERS = ['Employee', 'Manager', 'HR Officer', 'Admin', 'System Admin'];

@ApiTags('Applicant Onboarding')
@ApiBearerAuth()
@Controller('onboarding/applicant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicantOnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  @Roles(...ONBOARDING_USERS)
  @ApiOperation({ summary: 'Get current onboarding progress' })
  getStatus(@Req() req: any) {
    const applicantId = req.user?.sub_userid || 'mock-applicant-id';
    return this.onboardingService.getEmployeeProgress(applicantId);
  }

  @Post('upload-document')
  @Roles(...ONBOARDING_USERS)
  @ApiOperation({ summary: 'Upload a required document or equipment proof' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(@Body() dto: UploadDocumentDto, @UploadedFile() file: Express.Multer.File) {
    return this.onboardingService.uploadDocument(dto.taskId, file);
  }

  @Post('tasks/:taskId/confirm')
  @Roles(...ONBOARDING_USERS)
  @ApiOperation({ summary: 'Confirm a text-based task (e.g., Review Handbook)' })
  confirmTask(@Param('taskId') taskId: string) {
    return this.onboardingService.confirmTask(taskId);
  }
}
