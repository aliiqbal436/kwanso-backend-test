import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  @Injectable()
  export class AuthGuardJWT extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      // Add your custom authentication logic here
      // for example, call super.logIn(request) to establish a session.
      // const req: UserRequest = context.switchToHttp().getRequest();
  
      return super.canActivate(context);
    }
  
    handleRequest(err: any, user: any, info: any) {
      if (err) {
        throw new UnauthorizedException();
      }
  
      if (user?.userId && user?.email) {
        return user;
      }
      throw new UnauthorizedException();
    }
  }
  