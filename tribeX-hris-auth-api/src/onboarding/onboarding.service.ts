import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  // ---------------------------------------------------------
  // 1. APPLICANT METHODS
  // ---------------------------------------------------------

  getEmployeeProgress(employeeId: string) {
    const tasks = [
      { id: 'task-1', title: 'Review Handbook', status: 'pending', isRequired: true, type: 'confirm' },
      { id: 'task-2', title: 'NBI Clearance', status: 'approved', isRequired: true, type: 'upload' },
      { id: 'task-3', title: 'Equipment Proof', status: 'pending', isRequired: false, type: 'upload' },
    ];

    // Only calculate progress using REQUIRED tasks
    const required = tasks.filter(t => t.isRequired);
    const completed = required.filter(t => t.status === 'approved' || t.status === 'confirmed').length;
    const progress = required.length > 0 ? Math.round((completed / required.length) * 100) : 0;

    return { employeeId, overallProgress: progress, tasks };
  }

  uploadDocument(taskId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // Accept PDFs for documents, JPG/PNG for equipment proof
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF, JPG, and PNG allowed.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File is too large. Maximum size is 5MB.');
    }

    this.logger.log(`Valid file uploaded for task: ${taskId}`);

    return {
      message: 'Document uploaded successfully',
      taskId,
      status: 'for-review',
    };
  }

  confirmTask(taskId: string) {
    this.logger.log(`Task confirmed: ${taskId}`);
    return {
      message: 'Task confirmed successfully',
      taskId,
      status: 'confirmed',
    };
  }

  // ---------------------------------------------------------
  // 2. HR METHODS (Kerr's domain)
  // ---------------------------------------------------------

  getAllOnboardingEmployees() {
    return [
      {
        id: 'mock-applicant-1',
        name: 'John Doe',
        position: 'Software Engineer',
        startDate: '2026-04-01',
        overallProgress: 50,
        status: 'In Progress',
      },
      {
        id: 'mock-applicant-2',
        name: 'Jane Smith',
        position: 'Data Analyst',
        startDate: '2026-04-15',
        overallProgress: 100,
        status: 'For Review',
      },
    ];
  }

  updateTaskStatus(taskId: string, dto: UpdateTaskStatusDto) {
    this.logger.log(`HR updated task ${taskId} to: ${dto.status}`);

    return {
      message: `Task successfully marked as ${dto.status}`,
      taskId,
      updatedStatus: dto.status,
      remarks: dto.remarks || null,
    };
  }

  // ---------------------------------------------------------
  // 3. SYSTEM ADMIN METHODS (Kerr's domain)
  // ---------------------------------------------------------

  createTemplate(dto: CreateTemplateDto) {
    this.logger.log(`Admin created new requirement: ${dto.taskName}`);

    return {
      message: 'Onboarding template created successfully',
      template: {
        id: `template-${Date.now()}`,
        ...dto,
      },
    };
  }
}
