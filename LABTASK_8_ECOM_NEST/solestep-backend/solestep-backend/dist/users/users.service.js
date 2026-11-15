"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    constructor() {
        this.users = [];
        this.idCounter = 1;
    }
    register(data) {
        if (this.users.some((user) => user.email === data.email)) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const user = { id: this.idCounter++, fullName: data.fullName, email: data.email, password: data.password };
        this.users.push(user);
        return { id: user.id, fullName: user.fullName, email: user.email };
    }
    getAllUsers() {
        return this.users.map(({ password, ...user }) => user);
    }
    getUserById(id) {
        const user = this.users.find((item) => item.id === id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password, ...safeUser } = user;
        return safeUser;
    }
    findByEmail(email) {
        return this.users.find((user) => user.email === email);
    }
    updateUser(id, data) {
        const user = this.users.find((item) => item.id === id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (data.password)
            delete data.password;
        Object.assign(user, data, { id });
        return this.getUserById(id);
    }
    deleteUser(id) {
        this.getUserById(id);
        this.users = this.users.filter((item) => item.id !== id);
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map