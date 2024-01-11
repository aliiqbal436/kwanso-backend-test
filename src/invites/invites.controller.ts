import { Controller, Post, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthGuardJWT } from 'src/utils/auth.gaurd';

@Controller('invite')
export class InvitesController {
  constructor(private readonly invitationsService: InvitesService) {}

  @UseGuards(AuthGuardJWT)
  @Post(':email')
  async createInvitation(@Request() req, @Param('email') email: string): Promise<void> {
    if (req.user && req.user.isAdmin) {
      await this.invitationsService.createInvitation(email);
    } else {
      throw new ForbiddenException('You do not have permission to create invitations');
    }
  }

  @Post('use/:email')
  async useInvitation(@Param('email') email: string): Promise<void> {
    await this.invitationsService.useInvitation(email);
  }
}
