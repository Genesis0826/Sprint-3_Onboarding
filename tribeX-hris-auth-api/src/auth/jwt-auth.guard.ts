import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader: string | undefined =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      const decoded = this.jwtService.verify(token);

      // BLOCK refresh tokens from accessing protected routes
      if (decoded.type !== 'access') {
        throw new UnauthorizedException('Access token required');
      }

      // Reject blacklisted (logged-out) tokens
      const { data: blacklisted } = await this.supabaseService.getClient()
        .from('token_blacklist')
        .select('token_hash')
        .eq('token_hash', sha256(token))
        .maybeSingle();
      if (blacklisted) throw new UnauthorizedException('Token has been revoked');

      req.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        err instanceof UnauthorizedException ? err.message : 'Invalid token',
      );
    }
  }
}