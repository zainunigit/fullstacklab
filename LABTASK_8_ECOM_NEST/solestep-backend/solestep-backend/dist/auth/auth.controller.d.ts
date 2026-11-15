import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: any): {
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
    forgotPassword(body: any): {
        message: string;
    };
    resetPassword(body: any): {
        message: string;
    };
}
