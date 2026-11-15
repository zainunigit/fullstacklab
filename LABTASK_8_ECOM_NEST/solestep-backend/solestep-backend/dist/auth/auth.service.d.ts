import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(data: any): {
        message: string;
        user: {
            id: any;
            fullName: any;
            email: any;
        };
    };
    logout(): {
        message: string;
    };
    forgotPassword(email: string): {
        message: string;
    };
    resetPassword(): {
        message: string;
    };
}
