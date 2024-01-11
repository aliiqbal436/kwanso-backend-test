import { Controller, Request, Post, UseGuards, Body, ValidationPipe, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/dto';
import { InvitesService } from 'src/invites/invites.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly invitesService: InvitesService) { }

  @Post('signIn')
  async login(@Body(ValidationPipe) user: LoginUserDto) {
    return this.authService.signIn(user);
  }

  @Post('signup')
  async singup(@Body(ValidationPipe) user: CreateUserDto) {
    const hasUnexpiredInvitation = await this.invitesService.hasUnexpiredInvitation(user.email);
    if (hasUnexpiredInvitation) {
      return this.authService.signup(user);

    } else {
      // User does not have a valid invitation
      throw new UnauthorizedException('Invalid or expired invitation');
    }
  }

}

