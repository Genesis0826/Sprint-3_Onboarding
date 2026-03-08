import { Controller, Get, Post, Patch, Delete, Param, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Role names must match exactly what is stored in the `role` table
const HR_AND_ABOVE = ['Admin', 'System Admin', 'HR Officer', 'HR Recruiter', 'HR Interviewer', 'Manager'];
const ADMIN_ONLY = ['Admin', 'System Admin'];

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(...HR_AND_ABOVE)
  findStats(@Req() req: any) {
    return this.usersService.findStats(req.user.company_id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...HR_AND_ABOVE)
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(...ADMIN_ONLY)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(...ADMIN_ONLY)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(...ADMIN_ONLY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
