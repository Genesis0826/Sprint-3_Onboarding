import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from '../auth/dto/login.dto';

type UserRow = {
  user_id: string;
  company_id: string;
  role_id: number;
  email: string;
  username: string | null;
  employee_id: string | null;
  password_hash: string | null;
  is_active: boolean;
  first_name: string | null;
  last_name: string | null;
};

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getIp(req?: any): string | null {
  if (!req) return null;
  const xf = req.headers?.['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || null;
}

function getBrowser(req?: any): string | null {
  if (!req) return null;
  return req.headers?.['user-agent'] || null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, req?: any) {
    const supabase = this.supabaseService.getClient();
    const { identifier, password } = loginDto;
    const rememberMe = !!loginDto.rememberMe;

    if (!/^[a-zA-Z0-9._@\-]+$/.test(identifier)) {
      throw new UnauthorizedException('Invalid identifier format');
    }

    const { data: user, error } = await supabase
      .from('user_profile')
      .select('user_id, company_id, role_id, password_hash, email, username, first_name, last_name')
      .or(`email.eq."${identifier}",username.eq."${identifier}"`)
      .maybeSingle<UserRow>();

    if (error) {
      this.logger.error(`DB error during login for: ${identifier}`, error);
      throw new UnauthorizedException('Login failed');
    }
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.password_hash) throw new UnauthorizedException('No password set');

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      await supabase.from('login_history').insert({
        login_id: crypto.randomUUID(),
        role_id: String(user.role_id),
        user_id: user.user_id,
        ip_address: getIp(req),
        browser_info: getBrowser(req),
        status: 'FAILED',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const { data: roleRow, error: roleError } = await supabase
      .from('role')
      .select('role_name')
      .eq('role_id', user.role_id)
      .single();

    if (roleError || !roleRow) throw new UnauthorizedException('Role not found');

    const { data: companydb, error: companyError } = await supabase
      .from('company')
      .select('company_name')
      .eq('company_id', user.company_id)
      .single();

    if (companyError || !companydb) throw new UnauthorizedException('Company not found');

    const login_id = crypto.randomUUID();
    const session_id = crypto.randomUUID();

    await supabase.from('login_history').insert({
      login_id,
      role_id: String(user.role_id),
      user_id: user.user_id,
      ip_address: getIp(req),
      browser_info: getBrowser(req),
      status: 'SUCCESS',
    });

    // ✅ first_name and last_name now included
    const accessPayload = {
      type: 'access',
      sub_userid: user.user_id,
      company_id: user.company_id,
      role_id: user.role_id,
      role_name: roleRow.role_name,
      company_name: companydb.company_name,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const access_token = await this.jwtService.signAsync(accessPayload, {
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(
      {
        type: 'refresh',
        sub_userid: user.user_id,
        role_id: user.role_id,
        login_id,
        session_id,
      },
      { expiresIn: rememberMe ? '30d' : '7d' },
    );

    const decoded: any = this.jwtService.decode(refresh_token);
    const expires_at = new Date(decoded.exp * 1000).toISOString();
    const token_hash = sha256(refresh_token);

    await supabase.from('refresh_session').insert({
      user_id: user.user_id,
      token_hash,
      expires_at,
    });

    return { access_token, refresh_token };
  }

  async logout(refreshToken: string, req?: any) {
    const supabase = this.supabaseService.getClient();

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token_hash = sha256(refreshToken);

    await supabase
      .from('refresh_session')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', decoded.sub_userid)
      .eq('token_hash', token_hash);

    await supabase.from('logout_history').insert({
      logout_id: crypto.randomUUID(),
      login_id: decoded.login_id ?? null,
      role_id: decoded.role_id != null ? String(decoded.role_id) : null,
      user_id: decoded.sub_userid ?? null,
      session_id: decoded.session_id ?? token_hash,
      ip_address: getIp(req),
      browser_info: getBrowser(req),
    });

    const { data: user, error } = await supabase
      .from('user_profile')
      .select('username')
      .eq('user_id', decoded.sub_userid)
      .single();

    if (error || !user) throw new UnauthorizedException('User not found');

    return { message: 'Logged out', username: user.username };
  }

  async refresh(refreshToken: string) {
    const supabase = this.supabaseService.getClient();

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (decoded.type !== 'refresh') throw new UnauthorizedException('Invalid refresh token type');

    const userId = decoded.sub_userid;
    const token_hash = sha256(refreshToken);

    const { data: session, error } = await supabase
      .from('refresh_session')
      .select('expires_at, revoked_at')
      .eq('user_id', userId)
      .eq('token_hash', token_hash)
      .maybeSingle();

    if (error || !session) throw new UnauthorizedException('Session not found');
    if (session.revoked_at) throw new UnauthorizedException('Session revoked');
    if (new Date(session.expires_at) <= new Date()) throw new UnauthorizedException('Session expired');

    const { data: user, error: userErr } = await supabase
      .from('user_profile')
      .select('user_id, company_id, role_id, first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (userErr || !user) throw new UnauthorizedException('User not found');

    const { data: roleRow } = await supabase
      .from('role')
      .select('role_name')
      .eq('role_id', user.role_id)
      .single();

    const { data: companydb } = await supabase
      .from('company')
      .select('company_name')
      .eq('company_id', user.company_id)
      .single();

    // ✅ first_name and last_name included in refresh too
    const accessPayload = {
      type: 'access',
      sub_userid: user.user_id,
      company_id: user.company_id,
      role_id: user.role_id,
      role_name: roleRow?.role_name,
      company_name: companydb?.company_name,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const access_token = await this.jwtService.signAsync(accessPayload, {
      expiresIn: '15m',
    });

    return { access_token };
  }

  async me(accessToken: string) {
    try {
      const decoded: any = await this.jwtService.verifyAsync(accessToken);
      const supabase = this.supabaseService.getClient();
      const userId = decoded.sub_userid;
      if (!userId) throw new UnauthorizedException('Invalid token payload');

      const { data: user, error } = await supabase
        .from('user_profile')
        .select('user_id, email, username, employee_id, company_id, role_id')
        .eq('user_id', userId)
        .maybeSingle<UserRow>();

      if (error || !user) throw new UnauthorizedException('User not found');

      return {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        employee_id: user.employee_id,
        company_id: user.company_id,
        role_id: user.role_id,
        role_name: decoded.role_name,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}