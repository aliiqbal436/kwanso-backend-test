import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

import { AuthService } from '../auth/auth.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        })],
    providers: [AuthService]
})
export class SeederModule implements OnModuleInit {
    constructor(
        private readonly authService: AuthService,
    ) { }

    async onModuleInit() {
        await this.seedAdminUser();
    }

    async seedAdminUser() {
        // Check if the admin user already exists
        const adminData = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, isAdmin: true }
        const adminExists = await this.authService.adminExists(adminData);
        if (!adminExists) {
            //   Create the first admin user
            await this.authService.signup(adminData);
        }
    }
}