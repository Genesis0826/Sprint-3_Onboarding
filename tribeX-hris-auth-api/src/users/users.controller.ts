import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Returns all users scoped to the requester's company via req.user.company_id.
  // No company_id in the URL or body — the JWT provides it, preventing cross-company access.
  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.company_id);
  }

  @Get('stats')
  stats(@Req() req: any) {
    return this.usersService.stats(req.user.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.user.company_id);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
