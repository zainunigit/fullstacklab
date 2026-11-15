import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login(data: any) {
    const user = this.usersService.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      message: 'Login successful (demonstration only)',
      user: { id: user.id, fullName: user.fullName, email: user.email },
    };
  }

  logout() {
    return { message: 'Logout request received (no session is maintained in this demo)' };
  }

  forgotPassword(email: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) return { message: 'If the account exists, password recovery can be started' };
    return { message: 'Password recovery demonstration; no email or reset token is sent' };
  }

  resetPassword() {
    return { message: 'Password reset endpoint demonstration; secure token validation is not implemented' };
  }
}
