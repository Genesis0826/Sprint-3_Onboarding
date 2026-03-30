import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ description: 'The ID of the specific onboarding task' })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'PDF, JPG, or PNG (Max 5MB)' })
  file: any;
}
