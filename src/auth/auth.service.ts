import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto, ResponseDto } from 'src/dto/dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signIn(user: LoginUserDto) {
        const userFound = await this.userModel
            .findOne({ email: user.email })
            .lean();

        if (!userFound?._id) {
            throw new NotFoundException('User Not Found')
        }

        const { password } = userFound;
        const comparePassword = await bcrypt.compare(user.password, password);

        if (userFound && comparePassword) {
            const payload = { email: user.email, id: userFound._id, isAdmin: userFound.isAdmin };
            return { token: this.jwtService.sign(payload) }
        }

        throw new UnauthorizedException('User not found')
    }

    async adminExists(user: CreateUserDto): Promise<User> {
        const userData = await this.userModel
            .findOne({ email: user.email })
            .exec();
        return userData
    }

    async signup(user: CreateUserDto): Promise<User> {
        const OldUser = await this.userModel
            .findOne({ email: user.email })
            .exec();
        if (OldUser) {
            throw new ConflictException('This email already registered')
        }


        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);

        const reqBody = {
            ...user,
            password: hash,
        };
        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }


    async validateUser(userData: LoginUserDto): Promise<User | null> {
        const user = await this.userModel
            .findOne({ email: userData.email })
            .exec();
        const comparePassword = await bcrypt.compare(user.password, userData.password);
        if (user && await comparePassword) {
            return user;
        }
        return null;
    }
}