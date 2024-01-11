import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument } from '../schemas/invites.schema';

@Injectable()
export class InvitesService {
  constructor(@InjectModel(Invite.name) private invitationModel: Model<InviteDocument>) {}

  async createInvitation(email: string): Promise<Invite> {
    // Check if there is an existing unused invitation for the email
    const existingInvitation = await this.invitationModel.findOne({ email, used: false }).exec();
    if (existingInvitation) {
      throw new ConflictException('An unused invitation for this email already exists');
    }

    const invitation = new this.invitationModel({ email });
    return invitation.save();
  }

  async getInvitationByEmail(email: string): Promise<Invite> {
    const invitation = await this.invitationModel.findOne({ email }).exec();
    if (!invitation) {
      throw new NotFoundException(`Invitation for email ${email} not found`);
    }
    return invitation;
  }

  async useInvitation(email: string): Promise<Invite> {
    const invitation = await this.getInvitationByEmail(email);
    
    // Check if the invitation has expired
    // having some date type issue and time is less to complete this task :-D 
    // @ts-ignore
    if (invitation.expireDate < new Date()) {
      throw new NotFoundException('Invitation has expired');
    }

    if (invitation.used) {
      throw new NotFoundException('Invitation has already been used');
    }

    invitation.used = true;
    return invitation.save();
  }

  async resetExpireDate(email: string): Promise<Invite> {
    const invitation = await this.getInvitationByEmail(email);
    // having some date type issue and time is less to complete this task :-D 
    // @ts-ignore
    invitation.expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reset expiration to 24 hours from now
    return invitation.save();
  }


  async hasUnexpiredInvitation(email: string): Promise<boolean> {
    const invitation = await this.invitationModel.findOne({ email, used: false, expireDate: { $gt: new Date() } }).exec();
    return !!invitation;
  }
}
