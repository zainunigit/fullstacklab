import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Demonstration only: never store plain-text passwords in a real application.
  private users: any[] = [];
  private idCounter = 1;

  register(data: any) {
    if (this.users.some((user) => user.email === data.email)) {
      throw new ConflictException('An account with this email already exists');
    }
    const user = { id: this.idCounter++, fullName: data.fullName, email: data.email, password: data.password };
    this.users.push(user);
    return { id: user.id, fullName: user.fullName, email: user.email };
  }

  getAllUsers() {
    return this.users.map(({ password, ...user }) => user);
  }

  getUserById(id: number) {
    const user = this.users.find((item) => item.id === id);
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safeUser } = user;
    return safeUser;
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  updateUser(id: number, data: any) {
    const user = this.users.find((item) => item.id === id);
    if (!user) throw new NotFoundException('User not found');
    if (data.password) delete data.password;
    Object.assign(user, data, { id });
    return this.getUserById(id);
  }

  deleteUser(id: number) {
    this.getUserById(id);
    this.users = this.users.filter((item) => item.id !== id);
    return { message: 'User deleted successfully' };
  }
}
