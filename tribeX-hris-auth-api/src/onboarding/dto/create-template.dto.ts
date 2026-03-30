import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ example: 'NBI Clearance' })
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @ApiProperty({ example: 'Please upload a valid NBI clearance' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Is this required for 100% progress?', example: true })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({ description: 'How many days they have to complete this', example: 7 })
  @IsNumber()
  deadlineDays: number;
}
