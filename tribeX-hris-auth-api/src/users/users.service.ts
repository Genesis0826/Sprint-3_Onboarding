import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  // All queries filter by company_id — this is what enforces multi-tenancy.
  // company_id comes from req.user (decoded from the JWT), never from the request body.

  async findAll(companyId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('user_profile')
      .select('user_id, first_name, last_name, email, role_id')
      .eq('company_id', companyId)
      .order('first_name');

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async findOne(id: string, companyId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('user_profile')
      .select('user_id, first_name, last_name, email, role_id')
      .eq('user_id', id)
      .eq('company_id', companyId) // prevents cross-company lookups
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async stats(companyId: string) {
    const { count, error } = await this.supabaseService.getClient()
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  }

  async create(dto: CreateUserDto, companyId: string) {
    const supabase = this.supabaseService.getClient();
    const user_id = crypto.randomUUID();

    // Get the next employee ID from the sequence table — never reuses numbers
    // even if users are deleted or archived, preventing ID conflicts on reactivation
    const { data: seq, error: seqError } = await supabase
      .from('employee_id_sequence')
      .select('last_number')
      .eq('company_id', companyId)
      .maybeSingle();

    if (seqError) throw new Error(seqError.message);

    const nextNumber = (seq?.last_number ?? 0) + 1;
    const employee_id = `empno-${String(nextNumber).padStart(5, '0')}`;

    // Upsert the sequence — insert if first user in company, update otherwise
    const { error: upsertError } = await supabase
      .from('employee_id_sequence')
      .upsert({ company_id: companyId, last_number: nextNumber });

    if (upsertError) throw new Error(upsertError.message);

    // Insert the new user into user_profile
    // company_id comes from the JWT — admins can only create users under their own company
    const { error: insertError } = await supabase
      .from('user_profile')
      .insert({
        user_id,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        role_id: dto.role_id,
        company_id: companyId,
        employee_id,
        ...(dto.department_id ? { department_id: dto.department_id } : {}),
        ...(dto.start_date    ? { start_date: dto.start_date }       : {}),
      });

    if (insertError) throw new Error(insertError.message);

    // Generate invite token — raw token goes in the email, hashed version is stored in DB
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours

    const { error: inviteError } = await supabase
      .from('user_invites')
      .insert({
        invite_id: crypto.randomUUID(),
        user_id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (inviteError) throw new Error(inviteError.message);

    // Build the invite link and send the email
    // If email fails, roll back — delete the invite and user so there's no orphaned record
    const appUrl = this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    const inviteLink = `${appUrl}/set-password?token=${rawToken}`;

    try {
      await this.mailService.sendInvite(dto.email, inviteLink);
    } catch (emailError) {
      // TODO (Production): remove this fallback once a verified domain is set up in Resend
      // For development: log the invite link to the terminal so you can test without email
      console.log('==========================================');
      console.log('DEV MODE — invite link (copy and open in browser):');
      console.log(inviteLink);
      console.log('==========================================');
    }

    return { user_id, employee_id, email: dto.email };
  }
  update(id: string, dto: UpdateUserDto) {}

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: user, error: findError } = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('user_id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (findError) throw new Error(findError.message);
    if (!user) throw new Error('User not found in your company');

    // TODO (Production): Replace hard delete with soft delete.
    // Instead of deleting the user, add an `is_active boolean DEFAULT true` column to user_profile.
    // Set it to false here instead of deleting — this preserves all history (login logs, audit trails, etc.)
    // and makes the action reversible if it was a mistake.
    // Also update login() in auth.service.ts to block login when is_active is false:
    // → throw new UnauthorizedException('Your account has been deactivated. Contact your administrator.')

    // For now (development): hard delete — clear related records first to avoid FK constraint violations
    await supabase.from('refresh_session').delete().eq('user_id', id);
    await supabase.from('user_invites').delete().eq('user_id', id);

    const { error } = await supabase
      .from('user_profile')
      .delete()
      .eq('user_id', id);

    if (error) throw new Error(error.message);

    return { message: 'User deleted successfully /n Instead of deleting the user, add an `is_active boolean DEFAULT true` column to user_profile.' };
  }
}
