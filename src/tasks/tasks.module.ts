import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
// import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
    UsersModule, 
    PassportModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class AuthModule {}