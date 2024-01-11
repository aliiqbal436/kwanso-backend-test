import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitesService } from './invites.service';

import { InvitesController } from './invites.controller';
import { Invite, InviteSchema } from '../schemas/invites.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }])],
  controllers: [InvitesController],
  providers: [InvitesService]
})
export class InvitesModule {}
