import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // Implement password validation logic (e.g., using bcrypt)
    return false
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}