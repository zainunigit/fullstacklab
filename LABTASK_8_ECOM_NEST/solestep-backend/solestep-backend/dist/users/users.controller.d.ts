import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(user: any): {
        id: number;
        fullName: any;
        email: any;
    };
    getAllUsers(): any[];
    getUserById(id: number): any;
    updateUser(id: number, user: any): any;
    deleteUser(id: number): {
        message: string;
    };
}
