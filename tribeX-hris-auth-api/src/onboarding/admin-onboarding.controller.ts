import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('System Admin Onboarding')
@ApiBearerAuth()
@Controller('onboarding/system-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminOnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('templates')
  @Roles('System Admin')
  @ApiOperation({ summary: 'Create a new onboarding checklist requirement template' })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.onboardingService.createTemplate(dto);
  }
}
