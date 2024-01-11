import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    IsOptional,
    IsObject,
    IsNumber,
    IsEmail
  } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message:
        'Password must contain minimum eight characters, at least one letter, one number and one special character',
    })
    password: string;

    @IsBoolean()
    @IsNotEmpty()
    isAdmin: boolean;
  }


  export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message:
        'Password must contain minimum eight characters, at least one letter, one number and one special character',
    })
    password: string;
  }


  
  export class ResponseDto {
    @IsOptional()
    @IsObject()
    data?: Object;
  
    @IsNotEmpty()
    @IsNumber()
    status: number;
  
    @IsOptional()
    @IsObject()
    error?: Object;
  }