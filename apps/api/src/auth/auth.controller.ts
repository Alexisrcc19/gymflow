import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { EnvironmentVariables, NodeEnvironment } from '../config/environment';
import { AuthService } from './auth.service';
import type { AuthResult } from './auth.service';
import { Cookies } from './decorators/cookies.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { AuthenticatedUser } from './domain/authenticated-user';
import { LoginDto } from './dto/login.dto';

interface HttpRequest {
  ip?: string;
  get(name: string): string | undefined;
}

interface HttpResponse {
  cookie(name: string, value: string, options: RefreshCookieOptions): void;
  clearCookie(name: string, options: RefreshCookieOptions): void;
}

interface RefreshCookieOptions {
  httpOnly: boolean;
  maxAge?: number;
  path: string;
  sameSite: 'strict';
  secure: boolean;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  async login(
    @Body() input: LoginDto,
    @Req() request: HttpRequest,
    @Res({ passthrough: true }) response: HttpResponse,
  ) {
    const result = await this.auth.login(input.email, input.password, {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
    this.setRefreshCookie(response, result.refreshToken);

    return this.responseBody(result);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate a refresh session' })
  async refresh(
    @Cookies() cookies: Record<string, string> | undefined,
    @Req() request: HttpRequest,
    @Res({ passthrough: true }) response: HttpResponse,
  ) {
    const result = await this.auth.refresh(cookies?.[this.cookieName], {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
    this.setRefreshCookie(response, result.refreshToken);

    return this.responseBody(result);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke the current refresh session' })
  async logout(
    @Cookies() cookies: Record<string, string> | undefined,
    @Res({ passthrough: true }) response: HttpResponse,
  ): Promise<void> {
    await this.auth.logout(cookies?.[this.cookieName]);
    response.clearCookie(this.cookieName, this.cookieOptions);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.auth.getCurrentUser(user);
  }

  private setRefreshCookie(response: HttpResponse, token: string): void {
    const days = this.config.get('REFRESH_SESSION_TTL_DAYS', { infer: true });
    response.cookie(this.cookieName, token, {
      ...this.cookieOptions,
      maxAge: days * 24 * 60 * 60 * 1_000,
    });
  }

  private responseBody({ accessToken, expiresIn, user }: AuthResult) {
    return { accessToken, expiresIn, user };
  }

  private get cookieName(): string {
    return this.config.get('REFRESH_COOKIE_NAME', { infer: true });
  }

  private get cookieOptions() {
    return {
      httpOnly: true,
      path: '/api/v1/auth',
      sameSite: 'strict' as const,
      secure:
        this.config.get('NODE_ENV', { infer: true }) ===
        NodeEnvironment.Production,
    };
  }
}
