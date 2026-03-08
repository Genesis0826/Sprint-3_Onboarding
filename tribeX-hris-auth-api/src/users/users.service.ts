import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(companyId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_profile')
      .select('user_id, first_name, last_name, email, role_id')
      .eq('company_id', companyId);

    if (error) throw error;
    return data ?? [];
  }

  async findStats(companyId: string) {
    const supabase = this.supabaseService.getClient();
    const { count, error } = await supabase
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (error) throw error;
    return { total: count ?? 0 };
  }

  findOne(id: string) {}

  create(dto: CreateUserDto) {}

  update(id: string, dto: UpdateUserDto) {}

  remove(id: string) {}
}
